"use client";

import { exerciseIdsInModule } from "@/lib/exercises/exercise-lesson-map";
import { useProgressQuery } from "@/hooks/use-progress-query";

export function ModuleProgressStrip({
  moduleSlug,
  totalLessons,
}: {
  moduleSlug: string;
  totalLessons: number;
}) {
  const prefix = `${moduleSlug}/`;

  const { data, isPending, isError } = useProgressQuery();

  if (isPending || isError || !data) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Cargando progreso del módulo…
      </p>
    );
  }

  const viewedHere = data.lessonKeys.filter((k) => k.startsWith(prefix)).length;
  const moduleExercises = exerciseIdsInModule(moduleSlug);
  const passedSet = new Set(data.exerciseIds);
  const exercisesDone = moduleExercises.filter((id) => passedSet.has(id)).length;
  const exercisesTotal = moduleExercises.length;
  const pct =
    totalLessons > 0 ? Math.round((viewedHere / Math.max(1, totalLessons)) * 100) : 0;

  return (
    <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
      <div className="flex items-center justify-between gap-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-300/70 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="w-12 text-right text-xs font-medium text-zinc-700 dark:text-zinc-200">
          {pct}%
        </div>
      </div>
      <p>
        En este módulo abriste{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {viewedHere}/{totalLessons}
        </span>{" "}
        lecciones.
      </p>
      {exercisesTotal > 0 ? (
        <p>
          Ejercicios de código en este módulo:{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {exercisesDone}/{exercisesTotal}
          </span>{" "}
          completados.
        </p>
      ) : null}
    </div>
  );
}
