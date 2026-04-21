"use client";

import { exerciseIdsInModule } from "@/lib/exercises/exercise-lesson-map";
import { useProgressQuery } from "@/hooks/use-progress-query";
import { t } from "@/lib/i18n/ui";
import { useLearnLangStore } from "@/stores/useLearnLangStore";

export function ModuleProgressStrip({
  moduleSlug,
  totalLessons,
}: {
  moduleSlug: string;
  totalLessons: number;
}) {
  const prefix = `${moduleSlug}/`;
  const lang = useLearnLangStore((s) => s.lang);

  const { data, isPending, isError } = useProgressQuery();

  if (isPending || isError || !data) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {t(lang, { es: "Cargando progreso del módulo…", en: "Loading module progress…" })}
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
        {t(lang, { es: "En este módulo abriste", en: "In this module you opened" })}{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {viewedHere}/{totalLessons}
        </span>{" "}
        {t(lang, { es: "lecciones.", en: "lessons." })}
      </p>
      {exercisesTotal > 0 ? (
        <p>
          {t(lang, { es: "Ejercicios de código en este módulo", en: "Code exercises in this module" })}:{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {exercisesDone}/{exercisesTotal}
          </span>{" "}
          {t(lang, { es: "completados.", en: "completed." })}
        </p>
      ) : null}
    </div>
  );
}
