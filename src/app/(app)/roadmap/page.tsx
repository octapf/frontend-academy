import { LearningRoadmap } from "@/components/learn/LearningRoadmap";
import { getLessonCountsByModule } from "@/lib/content/lesson-counts";
import { parseLearnLang } from "@/lib/i18n/learn-lang";

export default async function RoadmapPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const lang = parseLearnLang(sp.lang);
  const lessonCounts = await getLessonCountsByModule();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Roadmap</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {lang === "en"
            ? "Your learning roadmap: recommended steps and progress."
            : "Tu roadmap de aprendizaje: pasos recomendados y progreso."}
        </p>
      </div>

      <LearningRoadmap lessonCounts={lessonCounts} lang={lang} />
    </div>
  );
}

