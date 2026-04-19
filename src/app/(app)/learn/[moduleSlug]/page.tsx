import { ModuleLessonList } from "@/components/learn/ModuleLessonList";
import { ModuleProgressStrip } from "@/components/learn/ModuleProgressStrip";
import { TrackLink } from "@/components/track/TrackLink";
import { listLessonsForModule } from "@/lib/content/get-lesson";

type Params = { moduleSlug: string };

export default async function ModulePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { moduleSlug } = await params;
  const lessons = await listLessonsForModule(moduleSlug);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Module · {moduleSlug}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Lecciones (ES/EN) y ejercicios asociados al módulo.
        </p>
      </div>

      {lessons.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Todavía no hay lecciones en este módulo.
        </p>
      ) : (
        <>
          <ModuleProgressStrip
            moduleSlug={moduleSlug}
            totalLessons={lessons.length}
          />
          <ModuleLessonList moduleSlug={moduleSlug} lessons={lessons} />
        </>
      )}

      <div className="pt-2">
        <TrackLink
          href="/learn"
          className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          ← Volver a Learn
        </TrackLink>
      </div>
    </div>
  );
}
