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

  return (
    <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
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
