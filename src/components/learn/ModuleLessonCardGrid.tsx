"use client";

import { TrackLink } from "@/components/track/TrackLink";
import { useProgressQuery } from "@/hooks/use-progress-query";
import type { LessonLang } from "@/lib/content/get-lesson";
import { exerciseIdForLesson } from "@/lib/exercises/exercise-lesson-map";
import { learnLangSearchSuffix } from "@/lib/i18n/learn-lang";
import { t } from "@/lib/i18n/ui";
import { lessonProgressKey } from "@/lib/progress/keys";
import { useMemo, useState } from "react";

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
  const viewed = useMemo(() => new Set(progress?.lessonKeys ?? []), [progress?.lessonKeys]);
  const exercisesDone = useMemo(
    () => new Set(progress?.exerciseIds ?? []),
    [progress?.exerciseIds]
  );
  const langQs = learnLangSearchSuffix(lang);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "unseen" | "in_progress" | "done">(
    "all"
  );

  const ordered = useMemo(() => {
    const normQ = q.trim().toLowerCase();
    const matchesQ = (row: Row) => {
      if (!normQ) return true;
      const title = lang === "en" ? row.titleEn : row.titleEs;
      const subtitle = lang === "en" ? row.titleEs : row.titleEn;
      const hay = `${title} ${subtitle} ${row.slug} ${row.level ?? ""}`.toLowerCase();
      return hay.includes(normQ);
    };

    const matchesStatus = (row: Row) => {
      const key = lessonProgressKey(moduleSlug, row.slug);
      const done = viewed.has(key);
      const linkedExercise = exerciseIdForLesson(moduleSlug, row.slug);
      const exerciseOk =
        linkedExercise !== undefined && exercisesDone.has(linkedExercise);
      const inProgress = done && !exerciseOk;

      if (status === "all") return true;
      if (status === "unseen") return !done;
      if (status === "in_progress") return inProgress;
      return exerciseOk;
    };

    return [...lessons]
      .filter((row) => matchesQ(row) && matchesStatus(row))
      .sort((a, b) => {
        const ka = lessonProgressKey(moduleSlug, a.slug);
        const kb = lessonProgressKey(moduleSlug, b.slug);
        const viewedA = viewed.has(ka);
        const viewedB = viewed.has(kb);
        const exA = exerciseIdForLesson(moduleSlug, a.slug);
        const exB = exerciseIdForLesson(moduleSlug, b.slug);
        const okA = exA !== undefined && exercisesDone.has(exA);
        const okB = exB !== undefined && exercisesDone.has(exB);

        // 0: not viewed, 1: viewed not ok, 2: ok
        const rank = (v: boolean, ok: boolean) => (ok ? 2 : v ? 1 : 0);
        const ra = rank(viewedA, okA);
        const rb = rank(viewedB, okB);
        if (ra !== rb) return ra - rb;
        return a.slug.localeCompare(b.slug);
      });
  }, [exercisesDone, lang, lessons, moduleSlug, q, status, viewed]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <label className="sr-only" htmlFor="lesson-search">
            {t(lang, { es: "Buscar", en: "Search" })}
          </label>
          <input
            id="lesson-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(lang, {
              es: "Buscar por título, slug o nivel…",
              en: "Search by title, slug, or level…",
            })}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/60 dark:border-zinc-600 dark:bg-zinc-950 dark:focus:ring-brand/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="lesson-status">
            {t(lang, { es: "Estado", en: "Status" })}
          </label>
          <select
            id="lesson-status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as typeof status)
            }
            className="rounded-lg border border-zinc-200 bg-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/60 dark:border-zinc-600 dark:bg-zinc-950 dark:focus:ring-brand/50"
          >
            <option value="all">{t(lang, { es: "Todas", en: "All" })}</option>
            <option value="unseen">{t(lang, { es: "No vistas", en: "Unseen" })}</option>
            <option value="in_progress">{t(lang, { es: "En progreso", en: "In progress" })}</option>
            <option value="done">{t(lang, { es: "Completas", en: "Done" })}</option>
          </select>
        </div>
      </div>

      {ordered.length === 0 ? (
        <div className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
          {t(lang, {
            es: "No hay resultados con esos filtros.",
            en: "No results for those filters.",
          })}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {ordered.map((l) => {
        const key = lessonProgressKey(moduleSlug, l.slug);
        const done = viewed.has(key);
        const linkedExercise = exerciseIdForLesson(moduleSlug, l.slug);
        const exerciseOk =
          linkedExercise !== undefined && exercisesDone.has(linkedExercise);
        const inProgress = done && !exerciseOk;
        const title = lang === "en" ? l.titleEn : l.titleEs;
        const subtitle = lang === "en" ? l.titleEs : l.titleEn;

        return (
          <TrackLink
            key={l.slug}
            href={`/learn/${moduleSlug}/${l.slug}${langQs}`}
            className="flex flex-col rounded-xl border border-zinc-300 bg-zinc-100 p-5 outline-none transition-colors hover:bg-zinc-900/5 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:ring-brand/50 dark:hover:bg-zinc-100/10"
          >
            <div className="min-w-0 flex-1">
              <div className="text-lg font-semibold leading-snug">{title}</div>
              <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {done ? (
                <span className="rounded-md bg-brand/15 px-2 py-0.5 text-xs font-medium text-zinc-800 dark:text-zinc-100">
                  {t(lang, { es: "Vista", en: "Viewed" })}
                </span>
              ) : null}
              {exerciseOk ? (
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">
                  {t(lang, { es: "Ej. OK", en: "Ex OK" })}
                </span>
              ) : null}
              {inProgress ? (
                <span className="rounded-md bg-zinc-900/5 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-100/10 dark:text-zinc-200">
                  {t(lang, { es: "En progreso", en: "In progress" })}
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
    </div>
  );
}
