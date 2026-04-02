import { prisma } from "@drumr/db";

const PLAN_LIMITS = {
  free: { maxProducts: 1 },
  pro: { maxProducts: 5 },
} as const;

export async function canCreateProduct(accountId: string): Promise<boolean> {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: { _count: { select: { products: true } } },
  });

  if (!account) return false;

  const limit = PLAN_LIMITS[account.plan]?.maxProducts ?? 1;
  return account._count.products < limit;
}

export function getPlanLimits(plan: "free" | "pro") {
  return PLAN_LIMITS[plan];
}
