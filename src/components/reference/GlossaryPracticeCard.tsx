"use client";

import { useMemo, useState } from "react";

import { useTrackStore } from "@/stores/useTrackStore";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { GLOSSARY_ENTRIES, type MinTrack } from "@/lib/reference/glossary";

function trackAllows(track: string, min: MinTrack) {
  if (track === "all") return true;
  if (min === "junior") return true;
  if (min === "mid") return track === "mid" || track === "senior";
  return track === "senior";
}

export function GlossaryPracticeCard() {
  const track = useTrackStore((s) => s.track);
  const pairs = useMemo(
    () => GLOSSARY_ENTRIES.filter((p) => trackAllows(track, p.minTrack)),
    [track]
  );

  const [selected, setSelected] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Practice · Matching</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Ejercicio rápido de Conocimiento: unir término ↔ definición (mock).
          </p>
        </div>
        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          Track: <span className="font-medium">{track}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Términos (click)
          </div>
          <div className="mt-2 grid gap-2">
            {pairs.map((p) => (
              <button
                key={p.term}
                type="button"
                onClick={() => setSelected(p.term)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  selected === p.term
                    ? "border-brand bg-brand text-zinc-900"
                    : "border-zinc-200 bg-zinc-100 hover:bg-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-100/10"
                )}
              >
                {p.term}
                {matches[p.term] && (
                  <span className="ml-2 text-xs opacity-75">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Definiciones (click para asignar)
          </div>
          <div className="mt-2 grid gap-2">
            {pairs.map((p) => {
              const assignedTo = Object.entries(matches).find(
                ([, def]) => def === p.definition
              )?.[0];
              return (
                <button
                  key={p.definition}
                  type="button"
                  onClick={() => {
                    if (!selected) return;
                    setMatches((m) => ({ ...m, [selected]: p.definition }));
                    setSelected(null);
                  }}
                  className="rounded-lg border border-dashed border-zinc-300 bg-zinc-200 px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-900/5 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-100/10"
                >
                  <div>{p.definition}</div>
                  {assignedTo && (
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Asignada a: {assignedTo}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={() => {
            setSelected(null);
            setMatches({});
          }}
          variant="secondary"
          size="sm"
        >
          Reset
        </Button>
        <Button
          type="button"
          onClick={() => {
            // placeholder: scoring real + tracking en backend
            alert("Placeholder: scoring + tracking");
          }}
          variant="primary"
          size="sm"
        >
          Comprobar
        </Button>
      </div>
    </div>
  );
}

