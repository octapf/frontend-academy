"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const ROADMAP = [
  { status: "done", title: "Auth + progreso básico" },
  { status: "doing", title: "Learn UX: filtros / continuar / navegación" },
  { status: "todo", title: "Reset de contraseña + rate limit" },
  { status: "todo", title: "Más ejercicios + hints" },
  { status: "todo", title: "Analytics básico + feedback loop" },
] as const;

export default function RoadmapPage() {
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSent(false);
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message,
          contact: contact.trim() ? contact.trim() : undefined,
          page: "/roadmap",
        }),
      });
      const json: unknown = await res.json().catch(() => null);
      const ok =
        !!json && typeof json === "object" && (json as Record<string, unknown>).ok === true;
      if (!res.ok || !ok) {
        const err =
          !!json &&
          typeof json === "object" &&
          typeof (json as Record<string, unknown>).error === "string"
            ? String((json as Record<string, unknown>).error)
            : `Error enviando feedback (${res.status})`;
        setError(err);
        return;
      }
      setSent(true);
      setMessage("");
      setContact("");
    } finally {
      setLoading(false);
    }
  }

  const chip = (s: (typeof ROADMAP)[number]["status"]) => {
    if (s === "done")
      return "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200";
    if (s === "doing") return "bg-brand/15 text-zinc-800 dark:text-zinc-100";
    return "bg-zinc-900/5 text-zinc-700 dark:bg-zinc-100/10 dark:text-zinc-200";
  };

  const label = (s: (typeof ROADMAP)[number]["status"]) => {
    if (s === "done") return "Hecho";
    if (s === "doing") return "En progreso";
    return "Pendiente";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Roadmap</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Prioridades del proyecto y canal rápido de feedback.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-sm font-medium">Próximos hitos</div>
        <div className="mt-3 space-y-2">
          {ROADMAP.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className={`mt-0.5 rounded-md px-2 py-0.5 text-xs font-medium ${chip(item.status)}`}>
                {label(item.status)}
              </span>
              <div className="text-sm text-zinc-800 dark:text-zinc-100">{item.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-sm font-medium">Enviar feedback</div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Bugs, ideas, contenido que falta, lo que sea. Si dejás un contacto, te puedo responder.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Mensaje
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/60 dark:border-zinc-600 dark:bg-zinc-950 dark:focus:ring-brand/50"
              placeholder="Ej: en la lección X faltaría un ejemplo / en mobile se rompe Y / etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Contacto (opcional)
            </label>
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Email / Discord / lo que uses"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          {sent ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-200" role="status">
              Enviado. Gracias.
            </p>
          ) : null}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Enviando…" : "Enviar"}
          </Button>
        </form>
      </div>
    </div>
  );
}

