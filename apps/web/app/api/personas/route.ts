import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@drumr/db";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId)
    return NextResponse.json(
      { error: "productId required" },
      { status: 400 }
    );

  const personas = await prisma.persona.findMany({
    where: { product: { id: productId, accountId: user.id } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(personas);
}
