import { notFound } from "next/navigation";

import { LessonProgressBadges } from "@/components/lesson/LessonProgressBadges";
import { LessonProgressBeacon } from "@/components/lesson/LessonProgressBeacon";
import { TrackLink } from "@/components/track/TrackLink";
import { loadLessonMdx } from "@/lib/content/get-lesson";
import { learnLangSearchSuffix, parseLearnLang } from "@/lib/i18n/learn-lang";

type Params = { moduleSlug: string; lessonSlug: string };

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { moduleSlug, lessonSlug } = await params;
  const sp = await searchParams;
  const lang = parseLearnLang(sp.lang);
  const langQs = learnLangSearchSuffix(lang);

  let lesson: Awaited<ReturnType<typeof loadLessonMdx>>;
  try {
    lesson = await loadLessonMdx(moduleSlug, lessonSlug, lang);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-4">
      <LessonProgressBeacon moduleSlug={moduleSlug} lessonSlug={lessonSlug} />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {lesson.frontmatter.title}
        </h1>
        {lesson.frontmatter.description ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {lesson.frontmatter.description}
          </p>
        ) : null}
        <LessonProgressBadges
          moduleSlug={moduleSlug}
          lessonSlug={lessonSlug}
        />
      </div>

      <article className="prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-zinc-900 prose-a:underline dark:prose-a:text-zinc-100">
        {lesson.content}
      </article>

      {lessonSlug === "hooks-basics" && moduleSlug === "react" ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
          <div className="text-sm font-medium">Ejercicio de código</div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Practicá TypeScript con validación en servidor.
          </p>
          <TrackLink
            href={`/learn/${moduleSlug}/${lessonSlug}/exercise/ts-sum${langQs}`}
            className="mt-3 inline-flex rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Ir al ejercicio
          </TrackLink>
        </div>
      ) : null}

      {lessonSlug === "narrowing" && moduleSlug === "typescript" ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
          <div className="text-sm font-medium">Ejercicio de código</div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Implementá un type predicate con validación en servidor.
          </p>
          <TrackLink
            href={`/learn/${moduleSlug}/${lessonSlug}/exercise/ts-positive${langQs}`}
            className="mt-3 inline-flex rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Ir al ejercicio
          </TrackLink>
        </div>
      ) : null}

      {lessonSlug === "string-templates" && moduleSlug === "typescript" ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
          <div className="text-sm font-medium">Ejercicio de código</div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Template strings: formato exacto con tests en servidor.
          </p>
          <TrackLink
            href={`/learn/${moduleSlug}/${lessonSlug}/exercise/ts-greeting${langQs}`}
            className="mt-3 inline-flex rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Ir al ejercicio
          </TrackLink>
        </div>
      ) : null}

      {lessonSlug === "utility-types" && moduleSlug === "typescript" ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
          <div className="text-sm font-medium">
            {lang === "en" ? "Code exercise" : "Ejercicio de código"}
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {lang === "en"
              ? "`Pick` on a parameter: exact label format with server tests."
              : "`Pick` en el parámetro: formato de etiqueta exacto con tests en servidor."}
          </p>
          <TrackLink
            href={`/learn/${moduleSlug}/${lessonSlug}/exercise/ts-user-label${langQs}`}
            className="mt-3 inline-flex rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {lang === "en" ? "Open exercise" : "Ir al ejercicio"}
          </TrackLink>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <TrackLink
          href={`/learn/${moduleSlug}${langQs}`}
          className="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm hover:bg-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-100/10"
        >
          Volver al módulo
        </TrackLink>
        <TrackLink
          href="/reference/glossary"
          className="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm hover:bg-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-100/10"
        >
          Glossary
        </TrackLink>
        <TrackLink
          href="/reference/slang"
          className="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm hover:bg-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-100/10"
        >
          Slang
        </TrackLink>
      </div>
    </div>
  );
}
