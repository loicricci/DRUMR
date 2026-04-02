import { PrismaClient } from "./generated/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function debugLog(hypothesisId: string, location: string, message: string, data: Record<string, unknown>) {
  // #region agent log
  fetch("http://127.0.0.1:7767/ingest/7405ed59-a27b-49c4-bbbc-9491d244845b", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "c0355a" },
    body: JSON.stringify({
      sessionId: "c0355a",
      runId: "pre-fix",
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

const prisma = globalForPrisma.prisma ?? new PrismaClient();

debugLog("H1", "packages/db/src/index.ts:new PrismaClient", "Prisma client constructed", {
  nodeEnv: process.env.NODE_ENV ?? "unknown",
  hasGlobalClient: Boolean(globalForPrisma.prisma),
  clientCtorName: prisma?.constructor?.name ?? "unknown",
});

const engineConfig = (prisma as any)?._engineConfig;
debugLog("H1", "packages/db/src/index.ts:_engineConfig", "Prisma engine config snapshot", {
  dirname: engineConfig?.dirname ?? null,
  clientVersion: engineConfig?.clientVersion ?? null,
  generator: engineConfig?.generator ?? null,
  engineType: engineConfig?.engineType ?? null,
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
export * from "./generated/client";
