"use client";

import { useMemo, useState } from "react";

import { TrackLink } from "@/components/track/TrackLink";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useProgressQuery } from "@/hooks/use-progress-query";
import { exerciseIdsInModule } from "@/lib/exercises/exercise-lesson-map";
import { learnLangSearchSuffix } from "@/lib/i18n/learn-lang";
import { LEARN_MODULES } from "@/lib/learn/modules";

export function LearningRoadmap({
  lessonCounts,
  lang,
}: {
  lessonCounts: Record<string, number>;
  lang: "es" | "en";
}) {
  const { data: progress } = useProgressQuery();
  const lessonKeys = useMemo(() => progress?.lessonKeys ?? [], [progress?.lessonKeys]);
  const exIds = useMemo(() => progress?.exerciseIds ?? [], [progress?.exerciseIds]);
  const passedSet = useMemo(() => new Set(exIds), [exIds]);
  const langQs = learnLangSearchSuffix(lang);

  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = (() => {
    for (const m of LEARN_MODULES) {
      // We don't have lesson list here; fall back to module-level continue.
      // The module page itself already picks next lesson cards.
      const total = lessonCounts[m.slug] ?? 0;
      const viewed = lessonKeys.filter((k) => k.startsWith(`${m.slug}/`)).length;
      if (total === 0) continue;
      if (viewed < total) return { href: `/learn/${m.slug}${langQs}`, label: m.title };
    }
    return null;
  })();

  async function onSubmitFeedback(e: React.FormEvent) {
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

  return (
    <div className="space-y-6">
      {next ? (
        <div className="rounded-xl border border-brand/25 bg-brand/10 p-5 dark:border-brand/30 dark:bg-brand/15">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {lang === "en" ? "Next up" : "Siguiente paso"}
          </div>
          <div className="mt-1 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {lang === "en" ? `Continue in ${next.label}` : `Continuá por ${next.label}`}
          </div>
          <div className="mt-3">
            <TrackLink
              href={next.href}
              className="inline-flex rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-zinc-900 outline-none transition-colors hover:bg-brand/90 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {lang === "en" ? "Continue" : "Continuar"}
            </TrackLink>
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-sm font-medium">{lang === "en" ? "Learning path" : "Ruta de aprendizaje"}</div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {lang === "en"
            ? "Recommended order. Track your progress per module."
            : "Orden recomendado. Tu progreso se refleja por módulo."}
        </p>

        <div className="mt-4 space-y-3">
          {LEARN_MODULES.map((m, idx) => {
            const totalLessons = lessonCounts[m.slug] ?? 0;
            const viewedHere = lessonKeys.filter((k) => k.startsWith(`${m.slug}/`)).length;
            const pct = totalLessons > 0 ? Math.round((viewedHere / totalLessons) * 100) : 0;
            const moduleEx = exerciseIdsInModule(m.slug);
            const exDone = moduleEx.filter((id) => passedSet.has(id)).length;
            const exTotal = moduleEx.length;

            return (
              <TrackLink
                key={m.slug}
                href={`/learn/${m.slug}${langQs}`}
                className="block rounded-xl border border-zinc-200 bg-zinc-200/60 p-4 outline-none transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-700 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/55"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {lang === "en" ? "Step" : "Paso"} {idx + 1}
                    </div>
                    <div className="mt-0.5 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {m.title}
                    </div>
                    <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                      {m.description}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {totalLessons > 0 ? `${pct}%` : "—"}
                    </div>
                    <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      {totalLessons > 0
                        ? `${viewedHere}/${totalLessons} ${lang === "en" ? "lessons" : "lecciones"}`
                        : lang === "en"
                          ? "No lessons yet"
                          : "Sin lecciones"}
                      {exTotal > 0 ? ` · ${exDone}/${exTotal} ${lang === "en" ? "exercises" : "ej."}` : ""}
                    </div>
                  </div>
                </div>

                {totalLessons > 0 ? (
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900/10 dark:bg-zinc-100/10">
                    <div
                      className="h-full bg-brand"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                ) : null}
              </TrackLink>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-sm font-medium">{lang === "en" ? "Feedback" : "Feedback"}</div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {lang === "en"
            ? "Report bugs, suggest lessons/exercises, or request new topics."
            : "Reportá bugs, sugerí lecciones/ejercicios o pedí temas nuevos."}
        </p>

        <form onSubmit={onSubmitFeedback} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {lang === "en" ? "Message" : "Mensaje"}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/60 dark:border-zinc-600 dark:bg-zinc-950 dark:focus:ring-brand/50"
              placeholder={
                lang === "en"
                  ? "E.g. This lesson needs an example, mobile layout breaks, etc."
                  : "Ej: a esta lección le falta un ejemplo, en mobile se rompe X, etc."
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {lang === "en" ? "Contact (optional)" : "Contacto (opcional)"}
            </label>
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={lang === "en" ? "Email / Discord / anything" : "Email / Discord / lo que uses"}
            />
          </div>

          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          {sent ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-200" role="status">
              {lang === "en" ? "Sent. Thanks." : "Enviado. Gracias."}
            </p>
          ) : null}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (lang === "en" ? "Sending…" : "Enviando…") : lang === "en" ? "Send" : "Enviar"}
          </Button>
        </form>
      </div>
    </div>
  );
}

