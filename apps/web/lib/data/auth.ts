import { prisma } from "@drumr/db";
import { createClient } from "@/lib/supabase/server";

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
