import { notFound } from "next/navigation";

import { TsCodeExercise } from "@/components/exercise/TsCodeExercise";
import { TrackLink } from "@/components/track/TrackLink";
import { getExercise } from "@/exercises/index";
import type { ExerciseId } from "@/exercises/types";
import { getSession } from "@/lib/auth/session";
import { parseLearnLang } from "@/lib/i18n/learn-lang";
import { t } from "@/lib/i18n/ui";
import { getProgressSummary } from "@/lib/progress/progress-store";

type Params = { exerciseId: string };

export default async function ExerciseStandalonePage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { exerciseId } = await params;
  const sp = await searchParams;
  const lang = parseLearnLang(sp.lang);

  const exercise = getExercise(exerciseId);
  if (!exercise || exercise.kind !== "typescript") notFound();

  const session = await getSession();
  let serverCompleted = false;
  if (session) {
    const summary = await getProgressSummary(session.username);
    serverCompleted = summary.exerciseIds.includes(exercise.id as ExerciseId);
  }

  return (
    <div className="space-y-6">
      <div>
        <nav
          className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm text-zinc-500 dark:text-zinc-400"
          aria-label="Breadcrumb"
        >
          <TrackLink
            href="/exercises"
            className="hover:text-zinc-900 hover:underline dark:hover:text-zinc-100"
          >
            {t(lang, { es: "Ejercicios", en: "Exercises" })}
          </TrackLink>
          <span aria-hidden>/</span>
          <span className="text-zinc-800 dark:text-zinc-200">{exerciseId}</span>
        </nav>

        <TrackLink
          href="/exercises"
          className="mt-2 inline-block text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          {t(lang, { es: "← Volver a Ejercicios", en: "← Back to Exercises" })}
        </TrackLink>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {t(lang, { es: "Ejercicio de código", en: "Code exercise" })}
        </h1>
      </div>

      <TsCodeExercise exercise={exercise} lang={lang} serverCompleted={serverCompleted} />
    </div>
  );
}

