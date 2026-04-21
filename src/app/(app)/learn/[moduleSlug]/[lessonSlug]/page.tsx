import { notFound } from "next/navigation";

import { LessonProgressBadges } from "@/components/lesson/LessonProgressBadges";
import { LessonProgressBeacon } from "@/components/lesson/LessonProgressBeacon";
import { GlossaryPracticeCard } from "@/components/reference/GlossaryPracticeCard";
import { SlangPracticeCard } from "@/components/reference/SlangPracticeCard";
import { TrackLink } from "@/components/track/TrackLink";
import { listLessonsForModule, loadLessonMdx } from "@/lib/content/get-lesson";
import { learnLangSearchSuffix, parseLearnLang } from "@/lib/i18n/learn-lang";
import { t } from "@/lib/i18n/ui";
import { LEARN_MODULES } from "@/lib/learn/modules";
import { lessonCodeExerciseFor } from "@/lib/learn/lesson-code-exercises";

type Params = { moduleSlug: string; lessonSlug: string };

const exerciseCardBtn =
  "mt-3 inline-flex rounded-lg bg-brand px-3 py-2 text-sm font-medium text-zinc-900 outline-none transition-colors hover:bg-brand/90 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100 dark:focus-visible:ring-offset-zinc-950";

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

  const moduleMeta = LEARN_MODULES.find((m) => m.slug === moduleSlug);
  const moduleTitle = moduleMeta?.title ?? moduleSlug;
  const allLessons = await listLessonsForModule(moduleSlug);
  const idx = allLessons.findIndex((l) => l.slug === lessonSlug);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  const codeExercise = lessonCodeExerciseFor(moduleSlug, lessonSlug);

  return (
    <div className="space-y-4">
      <LessonProgressBeacon moduleSlug={moduleSlug} lessonSlug={lessonSlug} />
      <nav className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <TrackLink
          href={`/learn${langQs}`}
          className="underline decoration-brand/50 underline-offset-4 hover:text-brand"
        >
          {t(lang, { es: "Aprender", en: "Learn" })}
        </TrackLink>
        <span className="text-zinc-400 dark:text-zinc-500">/</span>
        <TrackLink
          href={`/learn/${moduleSlug}${langQs}`}
          className="underline decoration-brand/50 underline-offset-4 hover:text-brand"
        >
          {moduleTitle}
        </TrackLink>
        <span className="text-zinc-400 dark:text-zinc-500">/</span>
        <span className="text-zinc-900 dark:text-zinc-100">{lesson.frontmatter.title}</span>
      </nav>
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

      <article className="prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-zinc-900 prose-a:underline prose-a:decoration-brand/50 prose-a:underline-offset-4 hover:prose-a:text-brand dark:prose-a:text-zinc-100">
        {lesson.content}
      </article>

      {moduleSlug === "vocab" && lessonSlug === "glossary" ? (
        <GlossaryPracticeCard />
      ) : null}
      {moduleSlug === "vocab" && lessonSlug === "slang" ? (
        <SlangPracticeCard />
      ) : null}

      {codeExercise ? (
        <div className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
          <div className="text-sm font-medium">{codeExercise.title[lang]}</div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {codeExercise.description[lang]}
          </p>
          <TrackLink
            href={`/learn/${moduleSlug}/${lessonSlug}/exercise/${codeExercise.exerciseId}${langQs}`}
            className={exerciseCardBtn}
          >
            {codeExercise.cta[lang]}
          </TrackLink>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <TrackLink
          href={`/learn/${moduleSlug}${langQs}`}
          className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm outline-none hover:bg-zinc-900/5 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-100/10"
        >
          {t(lang, { es: "Volver al módulo", en: "Back to module" })}
        </TrackLink>
        {prev ? (
          <TrackLink
            href={`/learn/${moduleSlug}/${prev.slug}${langQs}`}
            className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm outline-none hover:bg-zinc-900/5 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-100/10"
          >
            {t(lang, { es: "← Anterior", en: "← Prev" })}
          </TrackLink>
        ) : null}
        {next ? (
          <TrackLink
            href={`/learn/${moduleSlug}/${next.slug}${langQs}`}
            className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm outline-none hover:bg-zinc-900/5 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-100/10"
          >
            {t(lang, { es: "Siguiente →", en: "Next →" })}
          </TrackLink>
        ) : null}
        <TrackLink
          href={`/reference/glossary${langQs}`}
          className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm outline-none hover:bg-zinc-900/5 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-100/10"
        >
          {t(lang, { es: "Glosario", en: "Glossary" })}
        </TrackLink>
        <TrackLink
          href={`/reference/slang${langQs}`}
          className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm outline-none hover:bg-zinc-900/5 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-100/10"
        >
          {t(lang, { es: "Jerga", en: "Slang" })}
        </TrackLink>
      </div>
    </div>
  );
}
