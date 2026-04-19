import { notFound } from "next/navigation";
import { Suspense } from "react";

import { LessonLanguageSwitcher } from "@/components/lesson/LessonLanguageSwitcher";
import { LessonProgressBadges } from "@/components/lesson/LessonProgressBadges";
import { LessonProgressBeacon } from "@/components/lesson/LessonProgressBeacon";
import { TrackLink } from "@/components/track/TrackLink";
import {
  type LessonLang,
  loadLessonMdx,
} from "@/lib/content/get-lesson";

type Params = { moduleSlug: string; lessonSlug: string };

function parseLang(value: string | string[] | undefined): LessonLang {
  if (value === "en") return "en";
  return "es";
}

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { moduleSlug, lessonSlug } = await params;
  const sp = await searchParams;
  const lang = parseLang(sp.lang);

  let lesson: Awaited<ReturnType<typeof loadLessonMdx>>;
  try {
    lesson = await loadLessonMdx(moduleSlug, lessonSlug, lang);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-4">
      <LessonProgressBeacon moduleSlug={moduleSlug} lessonSlug={lessonSlug} />
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
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
        <Suspense fallback={<div className="h-9 w-28 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />}>
          <LessonLanguageSwitcher
            moduleSlug={moduleSlug}
            lessonSlug={lessonSlug}
            current={lang}
          />
        </Suspense>
      </div>

      <article className="prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-zinc-900 prose-a:underline dark:prose-a:text-zinc-100">
        {lesson.content}
      </article>

      {lessonSlug === "hooks-basics" && moduleSlug === "react" ? (
        <div className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-zinc-950">
          <div className="text-sm font-medium">Ejercicio de código</div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Practicá TypeScript con validación en servidor.
          </p>
          <TrackLink
            href={`/learn/${moduleSlug}/${lessonSlug}/exercise/ts-sum${lang === "en" ? "?lang=en" : "?lang=es"}`}
            className="mt-3 inline-flex rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            Ir al ejercicio
          </TrackLink>
        </div>
      ) : null}

      {lessonSlug === "narrowing" && moduleSlug === "typescript" ? (
        <div className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-zinc-950">
          <div className="text-sm font-medium">Ejercicio de código</div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Implementá un type predicate con validación en servidor.
          </p>
          <TrackLink
            href={`/learn/${moduleSlug}/${lessonSlug}/exercise/ts-positive${lang === "en" ? "?lang=en" : "?lang=es"}`}
            className="mt-3 inline-flex rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            Ir al ejercicio
          </TrackLink>
        </div>
      ) : null}

      {lessonSlug === "string-templates" && moduleSlug === "typescript" ? (
        <div className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-zinc-950">
          <div className="text-sm font-medium">Ejercicio de código</div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Template strings: formato exacto con tests en servidor.
          </p>
          <TrackLink
            href={`/learn/${moduleSlug}/${lessonSlug}/exercise/ts-greeting${lang === "en" ? "?lang=en" : "?lang=es"}`}
            className="mt-3 inline-flex rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            Ir al ejercicio
          </TrackLink>
        </div>
      ) : null}

      {lessonSlug === "utility-types" && moduleSlug === "typescript" ? (
        <div className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-zinc-950">
          <div className="text-sm font-medium">
            {lang === "en" ? "Code exercise" : "Ejercicio de código"}
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {lang === "en"
              ? "`Pick` on a parameter: exact label format with server tests."
              : "`Pick` en el parámetro: formato de etiqueta exacto con tests en servidor."}
          </p>
          <TrackLink
            href={`/learn/${moduleSlug}/${lessonSlug}/exercise/ts-user-label${lang === "en" ? "?lang=en" : "?lang=es"}`}
            className="mt-3 inline-flex rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            {lang === "en" ? "Open exercise" : "Ir al ejercicio"}
          </TrackLink>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <TrackLink
          href={`/learn/${moduleSlug}`}
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm hover:bg-black/5 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/10"
        >
          Volver al módulo
        </TrackLink>
        <TrackLink
          href="/reference/glossary"
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm hover:bg-black/5 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/10"
        >
          Glossary
        </TrackLink>
        <TrackLink
          href="/reference/slang"
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm hover:bg-black/5 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/10"
        >
          Slang
        </TrackLink>
      </div>
    </div>
  );
}
