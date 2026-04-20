import { AppShell } from "@/components/app-shell/AppShell";
import { getSession } from "@/lib/auth/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return <AppShell username={session?.username ?? null}>{children}</AppShell>;
}
