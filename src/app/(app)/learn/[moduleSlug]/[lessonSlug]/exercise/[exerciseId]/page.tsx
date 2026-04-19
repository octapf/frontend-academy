import { notFound } from "next/navigation";

import { TsCodeExercise } from "@/components/exercise/TsCodeExercise";
import { TrackLink } from "@/components/track/TrackLink";
import { getExercise } from "@/exercises/index";
import type { ExerciseId } from "@/exercises/types";
import { getSession } from "@/lib/auth/session";
import { getProgressSummary } from "@/lib/progress/progress-store";

type Params = {
  moduleSlug: string;
  lessonSlug: string;
  exerciseId: string;
};

function parseLang(value: string | string[] | undefined): "es" | "en" {
  return value === "en" ? "en" : "es";
}

export default async function ExercisePage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { moduleSlug, lessonSlug, exerciseId } = await params;
  const sp = await searchParams;
  const lang = parseLang(sp.lang);

  const exercise = getExercise(exerciseId);
  if (!exercise || exercise.kind !== "typescript") {
    notFound();
  }

  const session = await getSession();
  let serverCompleted = false;
  if (session) {
    const summary = await getProgressSummary(session.username);
    serverCompleted = summary.exerciseIds.includes(exercise.id as ExerciseId);
  }

  const langQs = lang === "en" ? "?lang=en" : "?lang=es";

  return (
    <div className="space-y-6">
      <div>
        <nav
          className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm text-zinc-500 dark:text-zinc-400"
          aria-label="Breadcrumb"
        >
          <TrackLink
            href="/learn"
            className="hover:text-zinc-900 hover:underline dark:hover:text-zinc-100"
          >
            Learn
          </TrackLink>
          <span aria-hidden>/</span>
          <TrackLink
            href={`/learn/${moduleSlug}${langQs}`}
            className="hover:text-zinc-900 hover:underline dark:hover:text-zinc-100"
          >
            {moduleSlug}
          </TrackLink>
          <span aria-hidden>/</span>
          <TrackLink
            href={`/learn/${moduleSlug}/${lessonSlug}${langQs}`}
            className="hover:text-zinc-900 hover:underline dark:hover:text-zinc-100"
          >
            {lessonSlug}
          </TrackLink>
          <span aria-hidden>/</span>
          <span className="text-zinc-800 dark:text-zinc-200">{exerciseId}</span>
        </nav>
        <TrackLink
          href={`/learn/${moduleSlug}/${lessonSlug}${langQs}`}
          className="mt-2 inline-block text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          {lang === "en" ? "Back to lesson" : "Volver a la lección"}
        </TrackLink>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {lang === "en" ? "Code exercise" : "Ejercicio de código"}
        </h1>
      </div>

      <TsCodeExercise
        exercise={exercise}
        lang={lang}
        serverCompleted={serverCompleted}
      />
    </div>
  );
}
