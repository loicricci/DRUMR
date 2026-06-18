import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@drumr/db";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

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

  try {
    await prisma.waitlistEntry.create({
      data: {
        email,
        source: parsed.data.source,
      },
    });
  } catch (error) {
    const isDuplicate =
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2002";

    if (!isDuplicate) {
      console.error("Waitlist signup failed:", error);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
