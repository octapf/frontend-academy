import { LearnEntryLink } from "@/components/learn/LearnEntryLink";
import { GlossaryInfoCard } from "@/components/reference/GlossaryInfoCard";

export default function GlossaryPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Glossary</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Términos y definiciones. Filtrado por track.
        </p>
      </div>

      <GlossaryInfoCard />

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

