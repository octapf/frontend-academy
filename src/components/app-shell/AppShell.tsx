"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import { TrackSelector } from "@/components/app-shell/TrackSelector";
import { UserMenu } from "@/components/app-shell/UserMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { TrackLink } from "@/components/track/TrackLink";
import { TrackUrlSync } from "@/components/track/TrackUrlSync";
import { useTrackStore } from "@/stores/useTrackStore";

const NAV_MAIN = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/learn", label: "Learn" },
];

const NAV_REF = [
  { href: "/reference/glossary", label: "Glossary" },
  { href: "/reference/slang", label: "Slang" },
];

export function AppShell({
  children,
  username,
}: {
  children: React.ReactNode;
  username: string;
}) {
  const pathname = usePathname();
  const track = useTrackStore((s) => s.track);

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <Suspense fallback={null}>
        <TrackUrlSync />
      </Suspense>
      <header className="sticky top-0 z-10 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/15 dark:bg-black/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <TrackLink
              href="/dashboard"
              className="font-semibold tracking-tight"
            >
              Frontend Academy
            </TrackLink>
            <div className="hidden md:block">
              <TrackSelector />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="hidden text-sm text-zinc-600 dark:text-zinc-300 md:block">
              Track: <span className="font-medium">{track}</span>
            </span>
            <UserMenu username={username} />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border border-black/10 bg-white p-3 dark:border-white/15 dark:bg-zinc-950">
          <nav className="space-y-1">
            <div className="px-2 pb-1 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Main
            </div>
            {NAV_MAIN.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={pathname === item.href}
              />
            ))}

            <div className="mt-4 px-2 pb-1 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Reference
            </div>
            {NAV_REF.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={pathname === item.href}
              />
            ))}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <TrackLink
      href={href}
      className={[
        "block rounded-lg px-2.5 py-2 text-sm transition-colors",
        active
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </TrackLink>
  );
}

