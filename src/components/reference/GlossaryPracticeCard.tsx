"use client";

import { useMemo, useState } from "react";

import { useTrackStore } from "@/stores/useTrackStore";

type MinTrack = "junior" | "mid" | "senior";
type Pair = { term: string; definition: string; minTrack: MinTrack };

const PAIRS: Pair[] = [
  {
    term: "Closure",
    definition: "Función que recuerda variables de su scope de creación.",
    minTrack: "junior",
  },
  {
    term: "Specificity",
    definition: "Peso de un selector CSS para resolver conflictos.",
    minTrack: "junior",
  },
  {
    term: "Hydration",
    definition: "Adjuntar handlers al HTML renderizado en el server.",
    minTrack: "mid",
  },
  {
    term: "RSC",
    definition: "React Server Component: se renderiza en server, no en cliente.",
    minTrack: "senior",
  },
];

function trackAllows(track: string, min: MinTrack) {
  if (track === "all") return true;
  if (min === "junior") return true;
  if (min === "mid") return track === "mid" || track === "senior";
  return track === "senior";
}

export function GlossaryPracticeCard() {
  const track = useTrackStore((s) => s.track);
  const pairs = useMemo(
    () => PAIRS.filter((p) => trackAllows(track, p.minTrack)),
    [track]
  );

  const [selected, setSelected] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});

  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-zinc-950">
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
                className={[
                  "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  selected === p.term
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-black/10 bg-white hover:bg-black/5 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/10",
                ].join(" ")}
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
                  className="rounded-lg border border-dashed border-black/20 bg-zinc-50 px-3 py-2 text-left text-sm text-zinc-800 hover:bg-black/5 dark:border-white/20 dark:bg-black/40 dark:text-zinc-100 dark:hover:bg-white/10"
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
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            setMatches({});
          }}
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm hover:bg-black/5 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/10"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => {
            // placeholder: scoring real + tracking en backend
            alert("Placeholder: scoring + tracking");
          }}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          Comprobar
        </button>
      </div>
    </div>
  );
}

