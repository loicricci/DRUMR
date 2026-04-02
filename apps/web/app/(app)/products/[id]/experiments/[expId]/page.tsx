import { notFound } from "next/navigation";
import { getExperiment } from "@/lib/actions/experiments";
import { ExperimentDetailClient } from "@/components/experiments/experiment-detail";

export default async function ExperimentDetailPage({
  params,
}: {
  params: Promise<{ id: string; expId: string }>;
}) {
  const { id, expId } = await params;
  const experiment = await getExperiment(expId);
  if (!experiment || experiment.productId !== id) notFound();

  return <ExperimentDetailClient experiment={experiment} />;
}
