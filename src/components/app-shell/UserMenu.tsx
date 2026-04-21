"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { TrackLink } from "@/components/track/TrackLink";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n/ui";
import { useLearnLangStore } from "@/stores/useLearnLangStore";

export function UserMenu({ username }: { username: string | null }) {
  const router = useRouter();
  const lang = useLearnLangStore((s) => s.lang);
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!username) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="secondary" size="sm">
          <TrackLink href="/login">{t(lang, { es: "Ingresar", en: "Login" })}</TrackLink>
        </Button>
        <Button asChild variant="primary" size="sm">
          <TrackLink href="/register">{t(lang, { es: "Crear cuenta", en: "Create account" })}</TrackLink>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <TrackLink
        href="/dashboard"
        className="hidden max-w-[120px] truncate text-sm text-zinc-600 hover:underline dark:text-zinc-300 sm:inline"
      >
        {username}
      </TrackLink>
      <button
        type="button"
        onClick={logout}
        disabled={loading}
        className="rounded-lg border border-zinc-200 bg-zinc-100 px-2.5 py-1.5 text-xs font-medium hover:bg-zinc-900/5 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-100/10"
      >
        {loading ? "…" : t(lang, { es: "Salir", en: "Sign out" })}
      </button>
    </div>
  );
}
