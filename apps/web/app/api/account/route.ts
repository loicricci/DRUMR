import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@drumr/db";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const account = await prisma.account.findUnique({
    where: { id: user.id },
  });

  if (!account)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(account);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const updated = await prisma.account.update({
    where: { id: user.id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.settings && { settings: body.settings }),
    },
  });

  return NextResponse.json(updated);
}
