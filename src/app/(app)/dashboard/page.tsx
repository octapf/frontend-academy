import { DashboardModuleChips } from "@/components/dashboard/DashboardModuleChips";
import { TrackSummaryCard } from "@/components/dashboard/TrackSummaryCard";
import { getLessonCountsByModule } from "@/lib/content/lesson-counts";
import { listLessonsForModule } from "@/lib/content/get-lesson";
import { LEARN_MODULES } from "@/lib/learn/modules";
import { TrackLink } from "@/components/track/TrackLink";
import { getSession } from "@/lib/auth/session";
import { getProgressSummary } from "@/lib/progress/progress-store";
import { redirect } from "next/navigation";
import { parseLearnLang } from "@/lib/i18n/learn-lang";
import { t } from "@/lib/i18n/ui";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const lang = parseLearnLang(sp.lang);
  const lessonCounts = await getLessonCountsByModule();
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/dashboard");
  }
  const summary = session ? await getProgressSummary(session.username) : null;

  let nextHref: string | null = null;
  let nextLabel: string | null = null;
  if (summary) {
    const opened = new Set(summary.lessonKeys);
    for (const m of LEARN_MODULES) {
      const lessons = await listLessonsForModule(m.slug);
      const next = lessons.find((l) => !opened.has(`${m.slug}/${l.slug}`));
      if (next) {
        nextHref = `/learn/${m.slug}/${next.slug}${lang === "en" ? "?lang=en" : ""}`;
        nextLabel = lang === "en" ? next.titleEn : next.titleEs;
        break;
      }
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t(lang, { es: "Panel", en: "Dashboard" })}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {t(lang, {
            es: "Progreso y práctica diaria filtrados por track.",
            en: "Progress and daily practice filtered by track.",
          })}
        </p>
      </div>

      {nextHref && nextLabel ? (
        <div className="rounded-xl border border-brand/25 bg-brand/10 p-5 dark:border-brand/30 dark:bg-brand/15">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {t(lang, { es: "Siguiente lección", en: "Next lesson" })}
          </div>
          <div className="mt-1 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {nextLabel}
          </div>
          <div className="mt-3">
            <TrackLink
              href={nextHref}
              className="inline-flex rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-zinc-900 outline-none transition-colors hover:bg-brand/90 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t(lang, { es: "Continuar", en: "Continue" })}
            </TrackLink>
          </div>
        </div>
      ) : null}

      <TrackSummaryCard />
      <DashboardModuleChips lessonCounts={lessonCounts} />
    </div>
  );
}
