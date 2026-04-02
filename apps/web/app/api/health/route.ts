import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "SET" : "MISSING",
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING",
    },
  };

  try {
    const { prisma } = await import("@drumr/db");
    await prisma.$queryRaw`SELECT 1 as ok`;
    checks.database = "OK";
  } catch (e: any) {
    checks.database = { error: e.message, name: e.name };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    checks.supabase = error ? { error: error.message } : { user: data.user?.email ?? "anonymous" };
  } catch (e: any) {
    checks.supabase = { error: e.message, name: e.name };
  }

  const ok = checks.database === "OK";
  return NextResponse.json(checks, { status: ok ? 200 : 500 });
}
