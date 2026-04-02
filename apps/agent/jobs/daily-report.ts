import { prisma } from "@drumr/db";
import { callClaude } from "../lib/claude.js";
import { buildContext, formatContextPrompt } from "../lib/context-builder.js";

const PROMPT_VERSION = "daily-report-v1";

export async function runDailyReport(payload: {
  productId: string;
}): Promise<void> {
  const { productId } = payload;

  // Query 1: running experiments for this product (no snapshot include — avoids N+1)
  const experiments = await prisma.experiment.findMany({
    where: { productId, status: "running" },
    include: { persona: true },
  });

  if (experiments.length === 0) return;

  // Query 2: last 7 snapshots for all experiments in one bulk query
  const experimentIds = experiments.map((e) => e.id);
  const allSnapshots = await prisma.experimentSnapshot.findMany({
    where: { experimentId: { in: experimentIds } },
    orderBy: { date: "desc" },
  });

  // Group by experimentId, keep last 7 per experiment
  const snapshotsByExp = new Map<string, typeof allSnapshots>();
  for (const snap of allSnapshots) {
    const bucket = snapshotsByExp.get(snap.experimentId) ?? [];
    if (bucket.length < 7) {
      bucket.push(snap);
      snapshotsByExp.set(snap.experimentId, bucket);
    }
  }

  const experimentsWithSnapshots = experiments.map((exp) => ({
    ...exp,
    snapshots: snapshotsByExp.get(exp.id) ?? [],
  }));

  const ctx = await buildContext(productId, "daily_report");
  const contextPrompt = formatContextPrompt(ctx);

  const systemPrompt = `${contextPrompt}

You are generating a daily CEO report. For each running experiment, analyze the KPI data and produce a recommendation.

Recommendation logic:
- Primary KPI >= threshold → CONTINUE
- Primary KPI 50-99% of threshold and trending up → CONTINUE
- Primary KPI 30-49% of threshold or flat for 2 days → PUSH
- Primary KPI < 30% of threshold after 3+ days → PAUSE + REVIEW
- Primary KPI declining 2 consecutive days → PAUSE + REVIEW

Note: ad platform data may lag 24-48h. Check the dataFreshnessAt field on each snapshot before drawing conclusions from the most recent data point.

When PAUSE is recommended, diagnose which layer failed:
- Ad copy: Low CTR (<1%), high impressions
- Landing page: Decent CTR (>2%) but low scroll depth or high bounce
- Persona assumption: CTR ok, scroll ok, but zero signups
- Product readiness: Signups but no activation

Output a structured Markdown report with sections:
1. Header (date, product name, experiment count)
2. Per-experiment status (KPIs vs thresholds, delta vs yesterday)
3. Recommendation (CONTINUE / PUSH / PAUSE+REVIEW with rationale)
4. Diagnosis (if PAUSE)
5. Proposed actions (1-3 specific actions)
6. Next experiment candidate (if PAUSE: proposed hypothesis)`;

  const experimentsSummary = experimentsWithSnapshots
    .map((exp) => {
      const latest = exp.snapshots[0];
      const daysRunning = exp.startedAt
        ? Math.floor((Date.now() - new Date(exp.startedAt).getTime()) / 86_400_000)
        : 0;
      return [
        `Experiment ${exp.slug}: ${exp.hypothesis}`,
        `KPI Primary: ${JSON.stringify(exp.kpiPrimary)}`,
        `Latest snapshot: ${latest ? JSON.stringify(latest.kpiValues) : "no data yet"}`,
        `Data freshness: ${latest?.dataFreshnessAt ?? "unknown"}`,
        `Days running: ${daysRunning}`,
      ].join("\n");
    })
    .join("\n\n");

  const result = await callClaude(
    systemPrompt,
    `Generate the daily report for today. Here are the running experiments:\n\n${experimentsSummary}`,
    { promptVersion: PROMPT_VERSION }
  );

  await prisma.report.create({
    data: {
      productId,
      type: "daily",
      contentMd: result.text,
      agentModel: "claude-sonnet-4-20250514",
      promptVersion: PROMPT_VERSION,
    },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (const exp of experimentsWithSnapshots) {
    const recommendation = result.text.toLowerCase().includes("pause")
      ? "pause"
      : result.text.toLowerCase().includes("push")
        ? "push"
        : "continue";

    const latestSnap = exp.snapshots[0];

    await prisma.experimentSnapshot.create({
      data: {
        experimentId: exp.id,
        productId,
        date: today,
        kpiValues: (exp.kpiPrimary as Record<string, unknown>) ?? {},
        recommendation: recommendation as "continue" | "push" | "pause",
        recommendationRationale: `See daily report for ${today.toISOString().split("T")[0]}`,
        dataFreshnessAt: latestSnap?.dataFreshnessAt ?? null,
      },
    });
  }
}
