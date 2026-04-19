"use client";

import { TrackLink } from "@/components/track/TrackLink";
import { useProgressQuery } from "@/hooks/use-progress-query";
import { exerciseIdsInModule } from "@/lib/exercises/exercise-lesson-map";
import { LEARN_MODULES } from "@/lib/learn/modules";

export function DashboardModuleChips({
  lessonCounts,
}: {
  lessonCounts: Record<string, number>;
}) {
  const { data: progress, isPending, isError } = useProgressQuery();

  if (isPending || isError || !progress) {
    return (
      <div className="h-16 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900" />
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-950">
      <div className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
        Por módulo
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {LEARN_MODULES.map((m) => {
          const prefix = `${m.slug}/`;
          const total = lessonCounts[m.slug] ?? 0;
          const viewed = progress.lessonKeys.filter((k) =>
            k.startsWith(prefix)
          ).length;
          const ex = exerciseIdsInModule(m.slug);
          const passed = new Set(progress.exerciseIds);
          const exDone = ex.filter((id) => passed.has(id)).length;
          const exTotal = ex.length;

          const sub =
            total > 0
              ? exTotal > 0
                ? `${viewed}/${total} · ${exDone}/${exTotal} ej.`
                : `${viewed}/${total} lecc.`
              : "sin lecciones";

          return (
            <TrackLink
              key={m.slug}
              href={`/learn/${m.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-200 px-2.5 py-1.5 text-xs transition-colors hover:bg-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-100/10"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {m.title}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">{sub}</span>
            </TrackLink>
          );
        })}
      </div>
    </div>
  );
}
