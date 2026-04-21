"use client";

import { exerciseIdForLesson } from "@/lib/exercises/exercise-lesson-map";
import { useProgressQuery } from "@/hooks/use-progress-query";
import { t } from "@/lib/i18n/ui";
import { lessonProgressKey } from "@/lib/progress/keys";
import { useLearnLangStore } from "@/stores/useLearnLangStore";

export function LessonProgressBadges({
  moduleSlug,
  lessonSlug,
}: {
  moduleSlug: string;
  lessonSlug: string;
}) {
  const { data: progress, isPending, isError } = useProgressQuery();
  const lang = useLearnLangStore((s) => s.lang);

  if (isPending || isError || !progress) return null;

  const key = lessonProgressKey(moduleSlug, lessonSlug);
  const viewed = progress.lessonKeys.includes(key);
  const exId = exerciseIdForLesson(moduleSlug, lessonSlug);
  const exerciseOk =
    exId !== undefined && progress.exerciseIds.includes(exId);

  if (!viewed && !exerciseOk) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {viewed ? (
        <span className="rounded-md bg-brand/15 px-2 py-0.5 text-xs font-medium text-zinc-800 dark:text-zinc-100">
          {t(lang, { es: "Vista", en: "Viewed" })}
        </span>
      ) : null}
      {exerciseOk ? (
        <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">
          {t(lang, { es: "Ej. OK", en: "Ex OK" })}
        </span>
      ) : null}
    </div>
  );
}
