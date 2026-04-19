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

  const lessons =
    isPending || isError ? "—" : String(data.lessonsOpened);
  const exercises =
    isPending || isError ? "—" : String(data.exercisesPassed);
  const last =
    isPending || isError
      ? "—"
      : formatLastActivity(data.lastActivityIso);

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
        </div>
        <div className="grid w-full max-w-md grid-cols-1 gap-3 text-right sm:grid-cols-3">
          <Stat label="Lecciones vistas" value={lessons} />
          <Stat label="Ejercicios OK" value={exercises} />
          <Stat label="Última actividad" value={last} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-200 px-3 py-2 dark:bg-zinc-900">
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
