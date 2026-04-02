import "dotenv/config";
import { prisma } from "@drumr/db";
import pLimit from "p-limit";
import { runDailyReport } from "./jobs/daily-report.js";
import { runMarketAnalysis } from "./jobs/market-analysis.js";
import { runVerdict } from "./jobs/verdict.js";
import { runPersonaUpdate } from "./jobs/persona-update.js";

const JOB_HANDLERS: Record<string, (payload: any) => Promise<void>> = {
  daily_report: runDailyReport,
  market_analysis: runMarketAnalysis,
  verdict: runVerdict,
  persona_update: runPersonaUpdate,
};

const MAX_ATTEMPTS = 3;
const POLL_INTERVAL_MS = 5_000;
const LOCK_TTL_MS = 90_000; // worker re-locks every 60s; 90s = safe margin
const HEARTBEAT_INTERVAL_MS = 60_000;
const CONCURRENCY = 5;

const limit = pLimit(CONCURRENCY);

async function tryClaimJob() {
  const now = new Date();

  const job = await prisma.job.findFirst({
    where: {
      status: "queued",
      scheduledAt: { lte: now },
      attempts: { lt: MAX_ATTEMPTS },
      OR: [{ lockedUntil: null }, { lockedUntil: { lt: now } }],
    },
    orderBy: { scheduledAt: "asc" },
  });

  if (!job) return null;

  // Atomic claim: only succeeds if still queued (prevents double-pickup)
  const claimed = await prisma.job.updateMany({
    where: { id: job.id, status: "queued" },
    data: {
      status: "running",
      startedAt: now,
      heartbeatAt: now,
      lockedUntil: new Date(Date.now() + LOCK_TTL_MS),
      attempts: { increment: 1 },
    },
  });

  if (claimed.count === 0) return null; // another worker claimed it first

  return job;
}

async function processJob(job: Awaited<ReturnType<typeof tryClaimJob>> & {}): Promise<void> {
  const handler = JOB_HANDLERS[job.type];

  if (!handler) {
    await prisma.job.update({
      where: { id: job.id },
      data: { status: "failed", error: `Unknown job type: ${job.type}` },
    });
    return;
  }

  // Heartbeat: extend lockedUntil every 60s so the lock never expires mid-job
  const heartbeat = setInterval(async () => {
    await prisma.job.update({
      where: { id: job.id },
      data: {
        heartbeatAt: new Date(),
        lockedUntil: new Date(Date.now() + LOCK_TTL_MS),
      },
    });
  }, HEARTBEAT_INTERVAL_MS);

  try {
    console.log(`Processing job ${job.id} (${job.type})...`);
    await handler(job.payload as any);
    clearInterval(heartbeat);
    await prisma.job.update({
      where: { id: job.id },
      data: { status: "done", completedAt: new Date() },
    });
    console.log(`Job ${job.id} completed.`);
  } catch (error) {
    clearInterval(heartbeat);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Job ${job.id} failed: ${errorMessage}`);

    const fresh = await prisma.job.findUnique({ where: { id: job.id } });
    const shouldRetry = (fresh?.attempts ?? 0) < MAX_ATTEMPTS;

    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: shouldRetry ? "queued" : "failed",
        error: errorMessage,
        lockedUntil: null,
        completedAt: shouldRetry ? null : new Date(),
      },
    });
  }
}

async function recoverStuckJobs(): Promise<void> {
  const reset = await prisma.job.updateMany({
    where: {
      status: "running",
      lockedUntil: { lt: new Date() },
    },
    data: {
      status: "queued",
      lockedUntil: null,
      heartbeatAt: null,
    },
  });

  if (reset.count > 0) {
    console.log(`Recovered ${reset.count} stuck job(s).`);
  }
}

async function poll(): Promise<void> {
  while (true) {
    try {
      await recoverStuckJobs();

      // Claim up to CONCURRENCY jobs and process them concurrently
      const claimTasks = Array.from({ length: CONCURRENCY }, () =>
        limit(async () => {
          const job = await tryClaimJob();
          if (!job) return false;
          await processJob(job);
          return true;
        })
      );

      const results = await Promise.all(claimTasks);
      const anyProcessed = results.some(Boolean);

      if (!anyProcessed) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }
    } catch (error) {
      console.error("Poll error:", error);
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
  }
}

async function runDailyReportCron(): Promise<void> {
  console.log("Running daily report cron...");

  const products = await prisma.product.findMany({
    where: { experiments: { some: { status: "running" } } },
  });

  await Promise.all(
    products.map((product) =>
      prisma.job.create({
        data: {
          type: "daily_report",
          payload: { productId: product.id },
          scheduledAt: new Date(),
        },
      })
    )
  );

  console.log(`Queued daily reports for ${products.length} products.`);
}

async function runVerdictCron(): Promise<void> {
  console.log("Running verdict cron...");

  const experiments = await prisma.experiment.findMany({
    where: { status: "running", endsAt: { lte: new Date() } },
  });

  await Promise.all(
    experiments.map((exp) =>
      prisma.job.create({
        data: {
          type: "verdict",
          payload: { experimentId: exp.id, productId: exp.productId },
          scheduledAt: new Date(),
        },
      })
    )
  );

  console.log(`Queued verdicts for ${experiments.length} experiments.`);
}

const command = process.argv[2];

switch (command) {
  case "daily":
    runDailyReportCron().then(() => poll());
    break;
  case "verdict":
    runVerdictCron().then(() => poll());
    break;
  case "poll":
    poll();
    break;
  default:
    console.log("Usage: worker.ts [daily|verdict|poll]");
    console.log("Starting poll mode...");
    poll();
    break;
}
