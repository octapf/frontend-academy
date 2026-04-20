"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import { LearnLanguageNav } from "@/components/app-shell/LearnLanguageNav";
import { LearnLangUrlSync } from "@/components/learn/LearnLangUrlSync";
import { TrackSelector } from "@/components/app-shell/TrackSelector";
import { UserMenu } from "@/components/app-shell/UserMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { TrackLink } from "@/components/track/TrackLink";
import { TrackUrlSync } from "@/components/track/TrackUrlSync";
import { withLearnLang } from "@/lib/i18n/learn-lang";
import { montserrat } from "@/lib/fonts";
import { useLearnLangStore } from "@/stores/useLearnLangStore";
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
  useTrackStore((s) => s.track);

  return (
    <div className="min-h-dvh bg-background text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <Suspense fallback={null}>
        <TrackUrlSync />
        <LearnLangUrlSync />
      </Suspense>
      <header className="sticky top-0 z-10 border-b border-zinc-300/80 bg-zinc-100/90 backdrop-blur dark:border-zinc-700/80 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-4 md:w-[220px] md:justify-center">
            <TrackLink
              href="/dashboard"
              className="flex items-center"
              aria-label="Frontend Academy"
            >
              <span className={`${montserrat.className} select-none text-center leading-none`}>
                <span className="block text-[18px] font-bold uppercase tracking-[0.08em] text-[#2D343E] dark:text-zinc-50">
                  FRONTEND
                </span>
                <span className="mt-0.5 block text-[12px] font-medium uppercase tracking-[0.28em] text-[#2D343E]/85 dark:text-zinc-200">
                  ACADEMY
                </span>
              </span>
            </TrackLink>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <TrackSelector />
            </div>
            <LearnLanguageNav />
            <ThemeToggle />
            <UserMenu username={username} />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border border-zinc-200 bg-zinc-100 p-3 dark:border-zinc-700 dark:bg-zinc-950">
          <nav className="space-y-1">
            <div className="px-2 pb-1 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Main
            </div>
            {NAV_MAIN.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={
                  item.href === "/learn"
                    ? pathname.startsWith("/learn")
                    : pathname === item.href
                }
                learnPrefixed={item.href === "/learn"}
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
  learnPrefixed = false,
}: {
  href: string;
  label: string;
  active: boolean;
  learnPrefixed?: boolean;
}) {
  const learnLang = useLearnLangStore((s) => s.lang);
  const resolvedHref = learnPrefixed ? withLearnLang(href, learnLang) : href;

  return (
    <TrackLink
      href={resolvedHref}
      className={[
        "block rounded-lg px-2.5 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100 dark:focus-visible:ring-brand/50 dark:focus-visible:ring-offset-zinc-950",
        active
          ? "bg-brand text-zinc-900"
          : "text-zinc-700 hover:bg-zinc-900/5 dark:text-zinc-200 dark:hover:bg-zinc-100/10",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </TrackLink>
  );
}

