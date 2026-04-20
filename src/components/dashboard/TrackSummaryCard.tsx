"use client";

import { useProgressQuery } from "@/hooks/use-progress-query";
import { useTrackStore } from "@/stores/useTrackStore";

function formatLastActivity(iso: string | null): string {
  if (!iso) return "Sin actividad aún";
  try {
    return new Intl.DateTimeFormat("es", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function TrackSummaryCard() {
  const track = useTrackStore((s) => s.track);

  const { data, isPending, isError } = useProgressQuery();
  const ready = !isPending && !isError && !!data;

  const lessons = ready ? data.lessonsOpened : null;
  const exercises = ready ? data.exercisesPassed : null;
  const last = ready ? formatLastActivity(data.lastActivityIso) : null;
  const hasAnyActivity = Boolean(lessons || exercises);

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            Track activo
          </h2>
          <div className="mt-1 text-xl font-semibold">{track}</div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Progreso guardado en el servidor (archivo local en desarrollo).
          </p>
          {ready && !hasAnyActivity ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-brand/25 bg-brand/10 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100">
              <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
              Empezá por <span className="font-medium">Learn</span> y completá tu primer ejercicio.
            </div>
          ) : null}
        </div>
        <div className="grid w-full max-w-md grid-cols-1 gap-3 text-right sm:grid-cols-3">
          <Stat label="Lecciones vistas" value={lessons} loading={isPending || isError} />
          <Stat label="Ejercicios OK" value={exercises} loading={isPending || isError} />
          <Stat label="Última actividad" value={last} loading={isPending || isError} />
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  loading,
}: {
  label: string;
  value: number | string | null;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg bg-zinc-200 px-3 py-2 dark:bg-zinc-900">
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="text-sm font-semibold">
        {loading ? <span className="opacity-60">—</span> : String(value ?? "—")}
      </div>
    </div>
  );
}
