"use client";

import { TrackLink } from "@/components/track/TrackLink";
import { useProgressQuery } from "@/hooks/use-progress-query";
import type { LessonLang } from "@/lib/content/get-lesson";
import { exerciseIdsInModule } from "@/lib/exercises/exercise-lesson-map";
import { learnLangSearchSuffix } from "@/lib/i18n/learn-lang";
import { LEARN_MODULES } from "@/lib/learn/modules";
import { t } from "@/lib/i18n/ui";

export function LearnModuleGrid({
  lessonCounts,
  lang,
}: {
  lessonCounts: Record<string, number>;
  lang: LessonLang;
}) {
  const { data: progress } = useProgressQuery();
  const langQs = learnLangSearchSuffix(lang);
  const lessonKeys = progress?.lessonKeys ?? [];
  const exIds = progress?.exerciseIds ?? [];
  const passedSet = new Set(exIds);

  const modulesSorted = [...LEARN_MODULES].sort((a, b) => {
    const totalA = lessonCounts[a.slug] ?? 0;
    const totalB = lessonCounts[b.slug] ?? 0;
    const viewedA = lessonKeys.filter((k) => k.startsWith(`${a.slug}/`)).length;
    const viewedB = lessonKeys.filter((k) => k.startsWith(`${b.slug}/`)).length;
    const pctA = totalA > 0 ? viewedA / totalA : 0;
    const pctB = totalB > 0 ? viewedB / totalB : 0;
    // incompletos primero, luego por menor progreso
    if (pctA !== pctB) return pctA - pctB;
    return (lang === "en" ? a.title.en : a.title.es).localeCompare(
      lang === "en" ? b.title.en : b.title.es
    );
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {modulesSorted.map((m) => {
        const prefix = `${m.slug}/`;
        const totalLessons = lessonCounts[m.slug] ?? 0;
        const viewedHere =
          lessonKeys.filter((k) => k.startsWith(prefix)).length ?? 0;
        const moduleEx = exerciseIdsInModule(m.slug);
        const exDone = moduleEx.filter((id) => passedSet.has(id)).length;
        const exTotal = moduleEx.length;

        return (
          <TrackLink
            key={m.slug}
            href={`/learn/${m.slug}${langQs}`}
            className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 outline-none transition-colors hover:bg-zinc-900/5 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:ring-brand/50 dark:hover:bg-zinc-100/10"
          >
            <div className="text-lg font-semibold">
              {lang === "en" ? m.title.en : m.title.es}
            </div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              {lang === "en" ? m.description.en : m.description.es}
            </div>
            {totalLessons > 0 ? (
              <div className="mt-3 space-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                <div>
                  {t(lang, { es: "Lecciones", en: "Lessons" })}:{" "}
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {viewedHere}/{totalLessons}
                  </span>{" "}
                  {t(lang, { es: "vistas", en: "viewed" })}
                </div>
                {exTotal > 0 ? (
                  <div>
                    {t(lang, { es: "Ejercicios código", en: "Code exercises" })}:{" "}
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {exDone}/{exTotal}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                {t(lang, { es: "Sin lecciones todavía", en: "No lessons yet" })}
              </div>
            )}
          </TrackLink>
        );
      })}
    </div>
  );
}
