import { prisma } from "@drumr/db";
import { createClient } from "@/lib/supabase/server";

export async function getReports(filters?: {
  productId?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const where: Record<string, unknown> = {
    product: { accountId: user.id },
  };

  if (filters?.productId) where.productId = filters.productId;
  if (filters?.type) where.type = filters.type;

  if (filters?.dateFrom || filters?.dateTo) {
    const createdAt: Record<string, Date> = {};
    if (filters.dateFrom) createdAt.gte = new Date(filters.dateFrom);
    if (filters.dateTo) createdAt.lte = new Date(filters.dateTo);
    where.createdAt = createdAt;
  }

  return prisma.report.findMany({
    where,
    include: {
      product: { select: { name: true } },
      experiment: { select: { slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getReport(reportId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.report.findFirst({
    where: {
      id: reportId,
      product: { accountId: user.id },
    },
    include: {
      product: true,
      experiment: true,
    },
  });
}
