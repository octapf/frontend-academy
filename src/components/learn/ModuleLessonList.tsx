"use client";

import { TrackLink } from "@/components/track/TrackLink";
import { useProgressQuery } from "@/hooks/use-progress-query";
import { exerciseIdForLesson } from "@/lib/exercises/exercise-lesson-map";
import { lessonProgressKey } from "@/lib/progress/keys";

type Row = {
  slug: string;
  titleEs: string;
  titleEn: string;
  level?: string;
};

export function ModuleLessonList({
  moduleSlug,
  lessons,
}: {
  moduleSlug: string;
  lessons: Row[];
}) {
  const { data: progress } = useProgressQuery();

  const viewed = new Set(progress?.lessonKeys ?? []);
  const exercisesDone = new Set(progress?.exerciseIds ?? []);

  return (
    <div className="rounded-xl border border-black/10 bg-white dark:border-white/15 dark:bg-zinc-950">
      <div className="border-b border-black/10 px-5 py-3 text-sm font-medium text-zinc-600 dark:border-white/15 dark:text-zinc-300">
        Lecciones
      </div>
      <ul className="divide-y divide-black/10 dark:divide-white/10">
        {lessons.map((l) => {
          const key = lessonProgressKey(moduleSlug, l.slug);
          const done = viewed.has(key);
          const linkedExercise = exerciseIdForLesson(moduleSlug, l.slug);
          const exerciseOk =
            linkedExercise !== undefined && exercisesDone.has(linkedExercise);
          return (
            <li key={l.slug}>
              <TrackLink
                href={`/learn/${moduleSlug}/${l.slug}`}
                className="flex flex-col gap-0.5 px-5 py-4 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04] md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{l.titleEs}</div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    EN: {l.titleEn}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 md:flex-col md:items-end md:gap-1">
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
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {l.level ? `${l.level} · ` : null}
                    {l.slug}
                  </div>
                </div>
              </TrackLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
