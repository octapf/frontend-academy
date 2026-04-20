"use client";

import { TrackLink } from "@/components/track/TrackLink";
import { useProgressQuery } from "@/hooks/use-progress-query";
import { exerciseIdsInModule } from "@/lib/exercises/exercise-lesson-map";
import { withLearnLang } from "@/lib/i18n/learn-lang";
import { LEARN_MODULES } from "@/lib/learn/modules";
import { useLearnLangStore } from "@/stores/useLearnLangStore";

export function DashboardModuleChips({
  lessonCounts,
}: {
  lessonCounts: Record<string, number>;
}) {
  const { data: progress, isPending, isError } = useProgressQuery();
  const learnLang = useLearnLangStore((s) => s.lang);

  if (isPending || isError || !progress) {
    return (
      <div className="h-16 animate-pulse rounded-xl border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900" />
    );
  }

  return (
    <div className="rounded-xl border border-zinc-300 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-950">
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

          const pct =
            total > 0 ? Math.round((viewed / Math.max(1, total)) * 100) : 0;
          const showProgress = total > 0 && viewed > 0;

          return (
            <TrackLink
              key={m.slug}
              href={withLearnLang(`/learn/${m.slug}`, learnLang)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-zinc-200 px-2.5 py-1.5 text-xs outline-none transition-colors hover:bg-zinc-900/5 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:ring-brand/50 dark:focus-visible:ring-offset-zinc-950 dark:hover:bg-zinc-100/10"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {m.title}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">{sub}</span>
              {showProgress ? (
                <span className="ml-1 inline-flex items-center gap-1 rounded-md bg-brand/15 px-1.5 py-0.5 text-[10px] font-medium text-zinc-800 dark:text-zinc-100">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-brand"
                    aria-hidden="true"
                  />
                  {pct}%
                </span>
              ) : null}
            </TrackLink>
          );
        })}
      </div>
    </div>
  );
}
