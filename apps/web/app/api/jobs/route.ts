import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@drumr/db";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { Prisma } from "@drumr/db";

const createJobSchema = z.object({
  type: z.enum(["daily_report", "market_analysis", "verdict", "persona_update"]),
  payload: z.record(z.unknown()),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createJobSchema.parse(body);

  if (parsed.payload.productId) {
    const product = await prisma.product.findFirst({
      where: {
        id: parsed.payload.productId as string,
        accountId: user.id,
      },
    });
    if (!product)
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
  }

  const job = await prisma.job.create({
    data: {
      type: parsed.type,
      payload: parsed.payload as Prisma.InputJsonValue,
      scheduledAt: new Date(),
    },
  });

  return NextResponse.json(job, { status: 201 });
}
