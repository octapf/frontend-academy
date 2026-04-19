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
      <div className="h-16 animate-pulse rounded-xl border border-black/10 bg-zinc-100 dark:border-white/15 dark:bg-zinc-900" />
    );
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-zinc-950">
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-zinc-50 px-2.5 py-1.5 text-xs transition-colors hover:bg-black/5 dark:border-white/15 dark:bg-black/40 dark:hover:bg-white/10"
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
