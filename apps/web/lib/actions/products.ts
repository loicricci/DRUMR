"use server";

import { prisma } from "@drumr/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url(),
  description: z.string().min(1).max(500),
  category: z.string().min(1),
  stage: z.enum(["pre_launch", "live", "pre_revenue", "traction"]),
  regions: z.array(z.string()).min(1),
  githubRepo: z.string().optional().nullable(),
  ga4PropertyId: z.string().optional().nullable(),
  googleAdsCustomerId: z.string().optional().nullable(),
  twitterAdsAccountId: z.string().optional().nullable(),
  linkedinAdsAccountId: z.string().optional().nullable(),
  resendAudienceId: z.string().optional().nullable(),
});

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = {
    name: formData.get("name") as string,
    url: formData.get("url") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    stage: formData.get("stage") as string,
    regions: (formData.get("regions") as string)
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean),
    githubRepo: (formData.get("githubRepo") as string) || null,
    ga4PropertyId: (formData.get("ga4PropertyId") as string) || null,
    googleAdsCustomerId:
      (formData.get("googleAdsCustomerId") as string) || null,
    twitterAdsAccountId:
      (formData.get("twitterAdsAccountId") as string) || null,
    linkedinAdsAccountId:
      (formData.get("linkedinAdsAccountId") as string) || null,
    resendAudienceId:
      (formData.get("resendAudienceId") as string) || null,
  };

  const parsed = createProductSchema.parse(raw);

  const product = await prisma.product.create({
    data: {
      accountId: user.id,
      ...parsed,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/products");
  redirect(`/products/${product.id}`);
}

export async function getProducts() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  return prisma.product.findMany({
    where: { accountId: user.id },
    include: {
      _count: {
        select: {
          experiments: { where: { status: "running" } },
          personas: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProduct(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.product.findFirst({
    where: { id, accountId: user.id },
    include: {
      personas: { orderBy: { updatedAt: "desc" } },
      experiments: {
        orderBy: { createdAt: "desc" },
        include: {
          persona: true,
          snapshots: { orderBy: { date: "desc" }, take: 1 },
        },
      },
      marketReports: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      reports: {
        where: { type: "daily" },
        orderBy: { createdAt: "desc" },
        take: 7,
      },
    },
  });
}

const updateProductSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url(),
  description: z.string().min(1).max(500),
  category: z.string().min(1),
  stage: z.enum(["pre_launch", "live", "pre_revenue", "traction"]),
  regions: z.array(z.string()).min(1),
  githubRepo: z.string().optional().nullable(),
  ga4PropertyId: z.string().optional().nullable(),
  googleAdsCustomerId: z.string().optional().nullable(),
  twitterAdsAccountId: z.string().optional().nullable(),
  linkedinAdsAccountId: z.string().optional().nullable(),
  resendAudienceId: z.string().optional().nullable(),
});

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = {
    name: formData.get("name") as string,
    url: formData.get("url") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    stage: formData.get("stage") as string,
    regions: (formData.get("regions") as string)
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean),
    githubRepo: (formData.get("githubRepo") as string) || null,
    ga4PropertyId: (formData.get("ga4PropertyId") as string) || null,
    googleAdsCustomerId:
      (formData.get("googleAdsCustomerId") as string) || null,
    twitterAdsAccountId:
      (formData.get("twitterAdsAccountId") as string) || null,
    linkedinAdsAccountId:
      (formData.get("linkedinAdsAccountId") as string) || null,
    resendAudienceId:
      (formData.get("resendAudienceId") as string) || null,
  };

  const parsed = updateProductSchema.parse(raw);

  await prisma.product.updateMany({
    where: { id, accountId: user.id },
    data: parsed,
  });

  revalidatePath(`/products/${id}`);
  revalidatePath("/dashboard");
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await prisma.product.deleteMany({
    where: { id, accountId: user.id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/products");
  redirect("/dashboard");
}
