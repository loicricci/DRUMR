"use server";

import { prisma } from "@drumr/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getOrCreateAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  let account = await prisma.account.findUnique({
    where: { id: user.id },
  });

  if (!account) {
    account = await prisma.account.create({
      data: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name ?? user.email!.split("@")[0],
      },
    });
  }

  return account;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
