"use client";

import { TrackLink } from "@/components/track/TrackLink";
import { useProgressQuery } from "@/hooks/use-progress-query";
import type { LessonLang } from "@/lib/content/get-lesson";
import { exerciseIdForLesson } from "@/lib/exercises/exercise-lesson-map";
import { learnLangSearchSuffix } from "@/lib/i18n/learn-lang";
import { lessonProgressKey } from "@/lib/progress/keys";

type Row = {
  slug: string;
  titleEs: string;
  titleEn: string;
  level?: string;
};

export function ModuleLessonCardGrid({
  moduleSlug,
  lessons,
  lang,
}: {
  moduleSlug: string;
  lessons: Row[];
  lang: LessonLang;
}) {
  const { data: progress } = useProgressQuery();
  const viewed = new Set(progress?.lessonKeys ?? []);
  const exercisesDone = new Set(progress?.exerciseIds ?? []);
  const langQs = learnLangSearchSuffix(lang);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {lessons.map((l) => {
        const key = lessonProgressKey(moduleSlug, l.slug);
        const done = viewed.has(key);
        const linkedExercise = exerciseIdForLesson(moduleSlug, l.slug);
        const exerciseOk =
          linkedExercise !== undefined && exercisesDone.has(linkedExercise);
        const title = lang === "en" ? l.titleEn : l.titleEs;
        const subtitle = lang === "en" ? l.titleEs : l.titleEn;

        return (
          <TrackLink
            key={l.slug}
            href={`/learn/${moduleSlug}/${l.slug}${langQs}`}
            className="flex flex-col rounded-xl border border-zinc-300 bg-zinc-100 p-5 outline-none transition-colors hover:bg-zinc-900/5 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:ring-zinc-500 dark:hover:bg-zinc-100/10"
          >
            <div className="min-w-0 flex-1">
              <div className="text-lg font-semibold leading-snug">{title}</div>
              <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {done ? (
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">
                  Vista
                </span>
              ) : null}
              {exerciseOk ? (
                <span className="rounded-md bg-sky-500/15 px-2 py-0.5 text-xs font-medium text-sky-900 dark:text-sky-100">
                  Ej. OK
                </span>
              ) : null}
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {l.level ? `${l.level} · ` : null}
                {l.slug}
              </span>
            </div>
          </TrackLink>
        );
      })}
    </div>
  );
}
