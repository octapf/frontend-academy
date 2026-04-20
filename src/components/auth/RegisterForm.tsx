"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
      let data: {
        ok?: boolean;
        error?: string;
        hint?: string;
        mongoCode?: number;
        issues?: Record<string, string[] | undefined>;
      };
      try {
        data = (await res.json()) as typeof data;
      } catch {
        setError(
          `El servidor respondió ${res.status} sin JSON. Revisá los logs del deploy en Vercel (Functions → /api/auth/register).`
        );
        return;
      }
      if (!res.ok || !data.ok) {
        const flat = data.issues ? Object.values(data.issues).flat() : [];
        const first = flat.find((m) => typeof m === "string" && m.length > 0);
        const base = first ?? data.error ?? "Error al registrar";
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
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          3–32 caracteres: letras, números, _ o -
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Contraseña
        </label>
        <Input
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Mínimo 8 caracteres. Podés cambiarla después en Settings (sin email de recuperación).
        </p>
      </div>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={loading} variant="primary" className="w-full">
        {loading ? "Creando…" : "Crear cuenta"}
      </Button>
    </form>
  );
}
