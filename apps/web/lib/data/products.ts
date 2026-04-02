import { prisma } from "@drumr/db";
import { createClient } from "@/lib/supabase/server";

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
