import { NextResponse } from "next/server";
import { readdirSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

function ls(dir: string): string[] | string {
  try {
    if (!existsSync(dir)) return "NOT_FOUND";
    return readdirSync(dir);
  } catch (e: any) {
    return `ERROR: ${e.message}`;
  }
}

export async function GET() {
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
    const { prisma } = await import("@drumr/db");
    await prisma.$queryRaw`SELECT 1 as ok`;
    checks.database = "OK";
  } catch (e: any) {
    checks.database = { error: e.message.slice(0, 300), name: e.name };
  }

  const ok = checks.database === "OK";
  return NextResponse.json(checks, { status: ok ? 200 : 500 });
}
