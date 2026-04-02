"use server";

import { prisma } from "@drumr/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function triggerMarketAnalysis(data: {
  productId: string;
  personaId?: string;
  regions: string[];
  competitors: string[];
  researchQuestion?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const product = await prisma.product.findFirst({
    where: { id: data.productId, accountId: user.id },
  });
  if (!product) throw new Error("Product not found");

  const report = await prisma.marketReport.create({
    data: {
      productId: data.productId,
      personaId: data.personaId || null,
      region: data.regions,
      competitorsInput: data.competitors,
      researchQuestion: data.researchQuestion || null,
    },
  });

  await prisma.job.create({
    data: {
      type: "market_analysis",
      payload: {
        marketReportId: report.id,
        productId: data.productId,
      },
      scheduledAt: new Date(),
    },
  });

  revalidatePath(`/products/${data.productId}/market`);
  return report;
}

