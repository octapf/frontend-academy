import { TrackLink } from "@/components/track/TrackLink";
import { getSession } from "@/lib/auth/session";
import { parseLearnLang } from "@/lib/i18n/learn-lang";
import { t } from "@/lib/i18n/ui";
import { getProgressSummary } from "@/lib/progress/progress-store";
import { EXERCISE_IDS } from "@/exercises/ids";
import { getExercise } from "@/exercises/index";

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const lang = parseLearnLang(sp.lang);
  const session = await getSession();
  const summary = session ? await getProgressSummary(session.username) : null;
  const passed = new Set(summary?.exerciseIds ?? []);

  const rows = EXERCISE_IDS.map((id) => {
    const ex = getExercise(id);
    return {
      id,
      title: ex ? (lang === "en" ? ex.title.en : ex.title.es) : id,
      description: ex ? (lang === "en" ? ex.description.en : ex.description.es) : "",
      done: passed.has(id),
    };
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t(lang, { es: "Ejercicios", en: "Exercises" })}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {t(lang, {
            es: "Práctica pura: resolvés código y el servidor valida con tests.",
            en: "Pure practice: solve code and the server validates with tests.",
          })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <TrackLink
            key={r.id}
            href={`/exercises/${r.id}`}
            className="flex flex-col rounded-xl border border-zinc-300 bg-zinc-100 p-5 outline-none transition-colors hover:bg-zinc-900/5 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-700 dark:bg-zinc-950 dark:focus-visible:ring-brand/50 dark:hover:bg-zinc-100/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg font-semibold leading-snug">{r.title}</div>
                {r.description ? (
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                    {r.description}
                  </div>
                ) : null}
              </div>
              {r.done ? (
                <span className="shrink-0 rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">
                  {t(lang, { es: "OK", en: "Passed" })}
                </span>
              ) : null}
            </div>
            <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">{r.id}</div>
          </TrackLink>
        ))}
      </div>
    </div>
  );
}

