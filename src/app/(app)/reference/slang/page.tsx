import { LearnEntryLink } from "@/components/learn/LearnEntryLink";
import { SlangPracticeCard } from "@/components/reference/SlangPracticeCard";

export default function SlangPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Slang (ES/EN)</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Jerga de equipos + práctica rápida (matching ES↔EN). Filtrado por
          track.
        </p>
      </div>

      <SlangPracticeCard />

      <div>
        <LearnEntryLink
          href="/learn"
          className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          Volver a Learn
        </LearnEntryLink>
      </div>
    </div>
  );
}

