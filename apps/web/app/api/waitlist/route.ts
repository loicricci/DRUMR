import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { createServiceClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  email: z.string().email(),
  source: z.string().max(50).optional(),
});

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(`waitlist:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();

  const supabase = await createServiceClient();
  const { error } = await supabase
    .from("waitlist_entries")
    .insert({ email, source: parsed.data.source ?? null });

  if (error) {
    // 23505 = unique_violation: email already on the list, treat as success
    if (error.code !== "23505") {
      console.error("Waitlist signup failed:", error);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
