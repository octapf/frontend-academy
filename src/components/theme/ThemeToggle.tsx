"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100/90 text-sm dark:border-zinc-700 dark:bg-zinc-950/90"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-sm text-zinc-800 hover:bg-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-100/10"
      title={isDark ? "Modo claro" : "Modo oscuro"}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
