"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { sanitizeNextParam } from "@/lib/auth/next-redirect";
import { hrefWithTrack } from "@/lib/track/href";
import { parseTrackParam } from "@/lib/track";
import { useTrackStore } from "@/stores/useTrackStore";

export function LoginForm() {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      let data: { ok?: boolean; error?: string; hint?: string; mongoCode?: number };
      try {
        data = (await res.json()) as typeof data;
      } catch {
        setError(
          `El servidor respondió ${res.status} sin JSON. Revisá los logs del deploy en Vercel (Functions → /api/auth/login).`
        );
        return;
      }
      if (!res.ok || !data.ok) {
        const base = data.error ?? "Error al ingresar";
        const code =
          typeof data.mongoCode === "number" ? ` [Mongo código ${data.mongoCode}]` : "";
        const extra = data.hint ? ` ${data.hint}` : "";
        setError(`${base}${code}${extra}`.trim());
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
        <Input
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Contraseña
        </label>
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={loading} variant="primary" className="w-full">
        {loading ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
