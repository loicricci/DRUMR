import { NextResponse } from "next/server";
import { readdirSync, existsSync } from "fs";

export const dynamic = "force-dynamic";

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

function ls(dir: string): string[] | string {
  try {
    if (!existsSync(dir)) return "NOT_FOUND";
    return readdirSync(dir);
  } catch (e: any) {
    return `ERROR: ${e.message}`;
  }
}

export async function GET() {
  debugLog("H4", "apps/web/app/api/health/route.ts:GET", "Health route entered", {
    cwd: process.cwd(),
  });

  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    cwd: process.cwd(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "SET" : "MISSING",
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING",
    },
    fs: {
      "/var/task": ls("/var/task"),
      "/var/task/packages": ls("/var/task/packages"),
      "/var/task/packages/db": ls("/var/task/packages/db"),
      "/var/task/packages/db/src": ls("/var/task/packages/db/src"),
      "/var/task/packages/db/src/generated": ls("/var/task/packages/db/src/generated"),
      "/var/task/packages/db/src/generated/client": ls("/var/task/packages/db/src/generated/client"),
    },
  };

  try {
    const dbModule = await import("@drumr/db");
    const { prisma } = dbModule;
    debugLog("H2", "apps/web/app/api/health/route.ts:import @drumr/db", "Imported DB module", {
      exportedKeys: Object.keys(dbModule),
      prismaCtorName: (prisma as any)?.constructor?.name ?? null,
      engineDirname: (prisma as any)?._engineConfig?.dirname ?? null,
      generatorProvider: (prisma as any)?._engineConfig?.generator?.provider ?? null,
    });
    await prisma.$queryRaw`SELECT 1 as ok`;
    checks.database = "OK";
  } catch (e: any) {
    debugLog("H3", "apps/web/app/api/health/route.ts:$queryRaw catch", "Prisma query failed", {
      name: e?.name ?? null,
      messageHead: typeof e?.message === "string" ? e.message.slice(0, 240) : null,
      stackHead: typeof e?.stack === "string" ? e.stack.slice(0, 240) : null,
    });
    checks.database = { error: e.message.slice(0, 300), name: e.name };
  }

  const ok = checks.database === "OK";
  return NextResponse.json(checks, { status: ok ? 200 : 500 });
}
