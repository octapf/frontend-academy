import { LearnModuleGrid } from "@/components/learn/LearnModuleGrid";
import { getLessonCountsByModule } from "@/lib/content/lesson-counts";

export default async function LearnPage() {
  const lessonCounts = await getLessonCountsByModule();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Learn</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Módulos: lecciones y ejercicios viven juntos.
        </p>
      </div>

      <LearnModuleGrid lessonCounts={lessonCounts} />
    </div>
  );
}
