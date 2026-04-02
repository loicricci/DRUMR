import { prisma } from "@drumr/db";
import { createClient } from "@/lib/supabase/server";

export async function getExperiment(experimentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.experiment.findFirst({
    where: {
      id: experimentId,
      product: { accountId: user.id },
    },
    include: {
      persona: true,
      snapshots: { orderBy: { date: "desc" } },
      reports: { orderBy: { createdAt: "desc" } },
      product: true,
    },
  });
}
