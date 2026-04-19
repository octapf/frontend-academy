import { DashboardModuleChips } from "@/components/dashboard/DashboardModuleChips";
import { TrackSummaryCard } from "@/components/dashboard/TrackSummaryCard";
import { getLessonCountsByModule } from "@/lib/content/lesson-counts";

export default async function DashboardPage() {
  const lessonCounts = await getLessonCountsByModule();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Progreso y práctica diaria filtrados por track.
        </p>
      </div>

      <TrackSummaryCard />
      <DashboardModuleChips lessonCounts={lessonCounts} />
    </div>
  );
}
