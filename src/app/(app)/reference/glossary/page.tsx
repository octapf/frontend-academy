import { GlossaryPracticeCard } from "@/components/reference/GlossaryPracticeCard";
import { TrackLink } from "@/components/track/TrackLink";

export default function GlossaryPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Glossary</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Términos + práctica rápida (matching). Filtrado por track.
        </p>
      </div>

      <GlossaryPracticeCard />

      <div>
        <TrackLink
          href="/learn"
          className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-300"
        >
          Volver a Learn
        </TrackLink>
      </div>
    </div>
  );
}

