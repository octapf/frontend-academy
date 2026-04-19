"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { sanitizeNextParam } from "@/lib/auth/next-redirect";
import { hrefWithTrack } from "@/lib/track/href";
import { parseTrackParam } from "@/lib/track";
import { useTrackStore } from "@/stores/useTrackStore";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = sanitizeNextParam(searchParams.get("next"));
  const trackFromUrl = parseTrackParam(searchParams.get("track"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Error al registrar");
        return;
      }
      const raw = next ?? "/dashboard";
      const track = trackFromUrl ?? useTrackStore.getState().track;
      router.push(hrefWithTrack(raw, track));
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Usuario
        </label>
        <input
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-200 px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950"
          required
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          3–32 caracteres: letras, números, _ o -
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Contraseña
        </label>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-200 px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950"
          required
          minLength={8}
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Mínimo 8 caracteres. Sin recuperación de contraseña (MVP).
        </p>
      </div>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-zinc-800 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {loading ? "Creando…" : "Crear cuenta"}
      </button>
    </form>
  );
}
