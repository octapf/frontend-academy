"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { TrackLink } from "@/components/track/TrackLink";

export function UserMenu({ username }: { username: string }) {
  const router = useRouter();
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
        className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-black/5 disabled:opacity-60 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/10"
      >
        {loading ? "…" : "Salir"}
      </button>
    </div>
  );
}
