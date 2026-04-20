"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    if (newPassword !== newPassword2) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      let data: { ok?: boolean; error?: string; hint?: string; mongoCode?: number };
      try {
        data = (await res.json()) as typeof data;
      } catch {
        setError(
          `El servidor respondió ${res.status} sin JSON. Revisá los logs del deploy (Functions → /api/auth/change-password).`
        );
        return;
      }
      if (!res.ok || !data.ok) {
        const base = data.error ?? "No se pudo cambiar la contraseña";
        const code =
          typeof data.mongoCode === "number" ? ` [Mongo código ${data.mongoCode}]` : "";
        const extra = data.hint ? ` ${data.hint}` : "";
        setError(`${base}${code}${extra}`.trim());
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setNewPassword2("");
      setOk("Contraseña actualizada.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Contraseña actual
        </label>
        <Input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Nueva contraseña
        </label>
        <Input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Repetir nueva contraseña
        </label>
        <Input
          name="newPassword2"
          type="password"
          autoComplete="new-password"
          value={newPassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
          required
          minLength={8}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      {ok && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400" role="status">
          {ok}
        </p>
      )}
      <Button type="submit" variant="primary" size="sm" disabled={loading}>
        {loading ? "Guardando…" : "Actualizar contraseña"}
      </Button>
    </form>
  );
}
