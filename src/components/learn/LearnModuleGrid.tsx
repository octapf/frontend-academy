"use client";

import { TrackLink } from "@/components/track/TrackLink";
import { useProgressQuery } from "@/hooks/use-progress-query";
import { exerciseIdsInModule } from "@/lib/exercises/exercise-lesson-map";
import { LEARN_MODULES } from "@/lib/learn/modules";

export function LearnModuleGrid({
  lessonCounts,
}: {
  lessonCounts: Record<string, number>;
}) {
  const { data: progress } = useProgressQuery();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {LEARN_MODULES.map((m) => {
        const prefix = `${m.slug}/`;
        const totalLessons = lessonCounts[m.slug] ?? 0;
        const viewedHere =
          progress?.lessonKeys.filter((k) => k.startsWith(prefix)).length ?? 0;
        const moduleEx = exerciseIdsInModule(m.slug);
        const passedSet = new Set(progress?.exerciseIds ?? []);
        const exDone = moduleEx.filter((id) => passedSet.has(id)).length;
        const exTotal = moduleEx.length;

        return (
          <TrackLink
            key={m.slug}
            href={`/learn/${m.slug}`}
            className="rounded-xl border border-black/10 bg-white p-5 transition-colors hover:bg-black/5 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/10"
          >
            <div className="text-lg font-semibold">{m.title}</div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              {m.description}
            </div>
            {totalLessons > 0 ? (
              <div className="mt-3 space-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                <div>
                  Lecciones:{" "}
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {viewedHere}/{totalLessons}
                  </span>{" "}
                  vistas
                </div>
                {exTotal > 0 ? (
                  <div>
                    Ejercicios código:{" "}
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {exDone}/{exTotal}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                Sin lecciones todavía
              </div>
            )}
          </TrackLink>
        );
      })}
    </div>
  );
}
