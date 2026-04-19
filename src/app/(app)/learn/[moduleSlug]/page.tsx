import { ModuleLessonCardGrid } from "@/components/learn/ModuleLessonCardGrid";
import { ModuleProgressStrip } from "@/components/learn/ModuleProgressStrip";
import { TrackLink } from "@/components/track/TrackLink";
import { listLessonsForModule } from "@/lib/content/get-lesson";
import {
  learnLangSearchSuffix,
  parseLearnLang,
} from "@/lib/i18n/learn-lang";
import { LEARN_MODULES } from "@/lib/learn/modules";

type Params = { moduleSlug: string };

export default async function ModulePage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { moduleSlug } = await params;
  const sp = await searchParams;
  const lang = parseLearnLang(sp.lang);
  const lessons = await listLessonsForModule(moduleSlug);
  const moduleMeta = LEARN_MODULES.find((m) => m.slug === moduleSlug);
  const moduleTitle = moduleMeta?.title ?? moduleSlug;
  const langQs = learnLangSearchSuffix(lang);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{moduleTitle}</h1>
        {moduleMeta?.description ? (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {moduleMeta.description}
          </p>
        ) : (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Lecciones y ejercicios del módulo.
          </p>
        )}
      </div>

      {lessons.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Todavía no hay lecciones en este módulo.
        </p>
      ) : (
        <>
          <div className="rounded-xl border border-zinc-300 bg-zinc-100 px-5 py-4 dark:border-zinc-700 dark:bg-zinc-950">
            <ModuleProgressStrip
              moduleSlug={moduleSlug}
              totalLessons={lessons.length}
            />
          </div>
          <ModuleLessonCardGrid
            moduleSlug={moduleSlug}
            lessons={lessons}
            lang={lang}
          />
        </>
      )}

      <div className="pt-2">
        <TrackLink
          href={`/learn${langQs}`}
          className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          ← Volver a Learn
        </TrackLink>
      </div>
    </div>
  );
}
