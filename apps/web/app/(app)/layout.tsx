import { redirect } from "next/navigation";
import { getOrCreateAccount } from "@/lib/data/auth";
import { AppSidebar } from "@/components/app-sidebar";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = await getOrCreateAccount();

  if (!account) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar userName={account.name} />
      <main className="flex-1 pl-60">
        <div className="mx-auto max-w-6xl p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
