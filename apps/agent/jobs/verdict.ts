import { prisma } from "@drumr/db";
import { callClaude } from "../lib/claude.js";
import { buildContext, formatContextPrompt } from "../lib/context-builder.js";
import { runPersonaUpdate } from "./persona-update.js";

export async function runVerdict(payload: {
  experimentId: string;
  productId: string;
}): Promise<void> {
  const { experimentId, productId } = payload;

  const experiment = await prisma.experiment.findUniqueOrThrow({
    where: { id: experimentId },
    include: {
      snapshots: { orderBy: { date: "asc" } },
      persona: true,
    },
  });

  const ctx = await buildContext(productId, "verdict", experimentId);
  const contextPrompt = formatContextPrompt(ctx);

  const systemPrompt = `${contextPrompt}

You are rendering the final verdict on this experiment. Analyze the full KPI history.

Rules:
- Primary KPI met threshold → VALIDATED
- Primary KPI never reached 50% of threshold → INVALIDATED
- Primary KPI between 50-99% → INCONCLUSIVE

Generate a verdict narrative covering:
1. What happened (KPI trajectory over the experiment duration)
2. Why it happened (root cause analysis)
3. What it means for the persona (how should persona assumptions be updated)
4. What it implies for the next experiment (proposed follow-up hypothesis)

Output JSON with keys: verdict ("validated" | "invalidated" | "inconclusive"), narrative (string), personaUpdates (object with key learnings), nextHypotheses (array of 1-2 strings).`;

  const resultText = await callClaude(
    systemPrompt,
    `Full experiment data:\n${JSON.stringify({
      slug: experiment.slug,
      hypothesis: experiment.hypothesis,
      kpiPrimary: experiment.kpiPrimary,
      kpiSecondary: experiment.kpiSecondary,
      snapshots: experiment.snapshots.map((s) => ({
        date: s.date,
        values: s.kpiValues,
        recommendation: s.recommendation,
      })),
      startedAt: experiment.startedAt,
      endsAt: experiment.endsAt,
    }, null, 2)}\n\nRender the verdict now.`
  );

  let verdict: "validated" | "invalidated" | "inconclusive" = "inconclusive";
  let narrative = resultText;
  let personaUpdates: Record<string, unknown> = {};
  let nextHypotheses: string[] = [];

  try {
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : resultText);
    verdict = parsed.verdict || "inconclusive";
    narrative = parsed.narrative || resultText;
    personaUpdates = parsed.personaUpdates || {};
    nextHypotheses = parsed.nextHypotheses || [];
  } catch {
    // Use defaults
  }

  await prisma.experiment.update({
    where: { id: experimentId },
    data: {
      status: verdict,
      verdict,
      verdictNotes: narrative,
    },
  });

  await prisma.report.create({
    data: {
      productId,
      type: "verdict",
      experimentId,
      contentMd: narrative,
      agentModel: "claude-sonnet-4-20250514",
    },
  });

  await runPersonaUpdate({
    personaId: experiment.personaId,
    experimentSlug: experiment.slug,
    verdict,
    narrative,
    personaUpdates,
    nextHypotheses,
  });
}
