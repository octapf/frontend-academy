import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell/AppShell";
import { getSession } from "@/lib/auth/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return <AppShell username={session.username}>{children}</AppShell>;
}
