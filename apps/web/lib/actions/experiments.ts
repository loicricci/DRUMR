"use server";

import { prisma } from "@drumr/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const campaignNamePattern = /^exp-\d{3}-[a-z0-9-]+$/;

const kpiSchema = z.object({
  metric: z.string(),
  threshold: z.number(),
  operator: z.enum(["gte", "lte", "gt", "lt", "eq"]),
  current: z.number().nullable(),
});

const createExperimentSchema = z.object({
  productId: z.string().uuid(),
  personaId: z.string().uuid(),
  marketReportId: z.string().uuid().optional().nullable(),
  hypothesis: z.string().min(10),
  marketSignal: z.string().optional().nullable(),
  objective: z.string().optional().nullable(),
  strategy: z.any().optional().nullable(),
  channels: z.array(z.string()).optional(),
  budget: z.any().optional().nullable(),
  adPlatform: z.enum(["google", "twitter", "linkedin"]).optional().nullable(),
  campaignName: z
    .string()
    .regex(campaignNamePattern, {
      message: "Campaign name must match pattern: exp-XXX-[slug]",
    })
    .optional()
    .nullable(),
  adCopy: z.string().optional().nullable(),
  landingPageUrl: z.string().url().optional().nullable(),
  kpiPrimary: kpiSchema,
  kpiSecondary: z.array(kpiSchema),
  startDate: z.string().optional(),
  endDate: z.string(),
});

export async function createExperiment(
  data: z.infer<typeof createExperimentSchema>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const product = await prisma.product.findFirst({
    where: { id: data.productId, accountId: user.id },
  });
  if (!product) throw new Error("Product not found");

  const existingCount = await prisma.experiment.count({
    where: { productId: data.productId },
  });
  const num = String(existingCount + 1).padStart(3, "0");
  let slugSuffix: string;
  if (data.campaignName) {
    slugSuffix = data.campaignName.replace(/^exp-\d{3}-/, "");
  } else {
    slugSuffix = (data.objective || data.hypothesis)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
  }
  const slug = `exp-${num}-${slugSuffix}`;

  const experiment = await prisma.experiment.create({
    data: {
      productId: data.productId,
      personaId: data.personaId,
      marketReportId: data.marketReportId || null,
      slug,
      hypothesis: data.hypothesis,
      marketSignal: data.marketSignal || null,
      objective: data.objective || null,
      strategy: data.strategy ?? undefined,
      channels: data.channels ?? [],
      budget: data.budget ?? undefined,
      adPlatform: data.adPlatform || undefined,
      campaignName: data.campaignName || undefined,
      adCopy: data.adCopy || undefined,
      landingPageUrl: data.landingPageUrl || undefined,
      kpiPrimary: data.kpiPrimary,
      kpiSecondary: data.kpiSecondary,
      endsAt: new Date(data.endDate),
    },
  });

  revalidatePath(`/products/${data.productId}`);
  return experiment;
}

export async function activateExperiment(experimentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const experiment = await prisma.experiment.findUnique({
    where: { id: experimentId },
    include: { product: true },
  });
  if (!experiment || experiment.product.accountId !== user.id)
    throw new Error("Not found");

  const updated = await prisma.experiment.update({
    where: { id: experimentId },
    data: { status: "running", startedAt: new Date() },
  });

  revalidatePath(`/products/${experiment.productId}`);
  return updated;
}

export async function pauseExperiment(experimentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const experiment = await prisma.experiment.findUnique({
    where: { id: experimentId },
    include: { product: true },
  });
  if (!experiment || experiment.product.accountId !== user.id)
    throw new Error("Not found");

  const updated = await prisma.experiment.update({
    where: { id: experimentId },
    data: { status: "paused" },
  });

  revalidatePath(`/products/${experiment.productId}`);
  return updated;
}

