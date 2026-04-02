import { PrismaClient } from "./generated/client";
import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

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

function resolveEngineLibraryPath() {
  const candidates = [
    "/var/task/packages/db/src/generated/client/libquery_engine-rhel-openssl-3.0.x.so.node",
    join(process.cwd(), "../../packages/db/src/generated/client/libquery_engine-rhel-openssl-3.0.x.so.node"),
    join(process.cwd(), "packages/db/src/generated/client/libquery_engine-rhel-openssl-3.0.x.so.node"),
  ];
  return candidates.find((candidate) => existsSync(candidate));
}

const forcedEnginePath = resolveEngineLibraryPath();
if (forcedEnginePath && !process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = forcedEnginePath;
}

debugLog("H6", "packages/db/src/index.ts:engineOverride", "Resolved Prisma engine library override", {
  forcedEnginePath: forcedEnginePath ?? null,
  envEnginePath: process.env.PRISMA_QUERY_ENGINE_LIBRARY ?? null,
  cwd: process.cwd(),
});

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

const moduleFilePath = fileURLToPath(import.meta.url);
const moduleDirPath = dirname(moduleFilePath);
const generatedClientDir = join(moduleDirPath, "generated", "client");
const prismaDebugMeta = {
  moduleFilePath,
  moduleDirPath,
  generatedClientDir,
  generatedClientDirExists: existsSync(generatedClientDir),
  engineConfigDirname: engineConfig?.dirname ?? null,
  forcedEnginePath: forcedEnginePath ?? null,
  envEnginePath: process.env.PRISMA_QUERY_ENGINE_LIBRARY ?? null,
};

debugLog("H5", "packages/db/src/index.ts:modulePath", "DB module runtime path snapshot", prismaDebugMeta);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
export { prismaDebugMeta };
export * from "./generated/client";
