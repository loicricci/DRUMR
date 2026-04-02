import { PrismaClient } from "./generated/client";
import { existsSync } from "fs";
import { join } from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

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

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
export * from "./generated/client";
