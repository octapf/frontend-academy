"use client";

import { useMemo, useState } from "react";

import { useTrackStore } from "@/stores/useTrackStore";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n/ui";
import { GLOSSARY_ENTRIES, type MinTrack } from "@/lib/reference/glossary";
import { samplePracticePairs, shuffleInPlace } from "@/lib/reference/shuffleSample";
import { useLearnLangStore } from "@/stores/useLearnLangStore";

function trackAllows(track: string, min: MinTrack) {
  if (track === "all") return true;
  if (min === "junior") return true;
  if (min === "mid") return track === "mid" || track === "senior";
  return track === "senior";
}

const BATCH_SIZE = 10;

export function GlossaryPracticeCard() {
  const track = useTrackStore((s) => s.track);
  const lang = useLearnLangStore((s) => s.lang);
  const [roundId, setRoundId] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  const pool = useMemo(
    () => GLOSSARY_ENTRIES.filter((p) => trackAllows(track, p.minTrack)),
    [track]
  );

  const practicePairs = useMemo(() => {
    void roundId;
    return samplePracticePairs(pool, BATCH_SIZE);
  }, [pool, roundId]);

  const shuffledDefinitions = useMemo(() => {
    const defs = practicePairs.map((p) => p.definition);
    return shuffleInPlace([...defs]);
  }, [practicePairs]);

  const resetBoard = () => {
    setSelected(null);
    setMatches({});
    setResult(null);
  };

  const newRound = () => {
    resetBoard();
    setRoundId((n) => n + 1);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {t(lang, { es: "Práctica · Matching", en: "Practice · Matching" })}
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {t(lang, {
              es: `Unir término ↔ definición. Cada ronda usa ${BATCH_SIZE} pares del track actual (orden mezclado).`,
              en: `Match term ↔ definition. Each round uses ${BATCH_SIZE} pairs from the current track (shuffled).`,
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <span>
            {t(lang, { es: "Track", en: "Track" })}:{" "}
            <span className="font-medium">{track}</span>
          </span>
          <span className="text-zinc-500 dark:text-zinc-400">
            {t(lang, {
              es: `· ${practicePairs.length} pares`,
              en: `· ${practicePairs.length} pairs`,
            })}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {t(lang, { es: "Términos (click)", en: "Terms (click)" })}
          </div>
          <div className="mt-2 grid gap-2">
            {practicePairs.map((p) => (
              <button
                key={p.term}
                type="button"
                onClick={() => {
                  setSelected(p.term);
                  setResult(null);
                }}
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
            {t(lang, { es: "Definiciones (click para asignar)", en: "Definitions (click to assign)" })}
          </div>
          <div className="mt-2 grid gap-2">
            {shuffledDefinitions.map((definition) => {
              const assignedTo = Object.entries(matches).find(
                ([, def]) => def === definition
              )?.[0];
              return (
                <button
                  key={definition}
                  type="button"
                  onClick={() => {
                    if (!selected) return;
                    setMatches((m) => ({ ...m, [selected]: definition }));
                    setSelected(null);
                    setResult(null);
                  }}
                  className="rounded-lg border border-dashed border-zinc-300 bg-zinc-200 px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-900/5 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-100/10"
                >
                  <div>{definition}</div>
                  {assignedTo && (
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {t(lang, { es: "Asignada a", en: "Assigned to" })}: {assignedTo}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={resetBoard} variant="secondary" size="sm">
          {t(lang, { es: "Limpiar asignaciones", en: "Clear matches" })}
        </Button>
        <Button type="button" onClick={newRound} variant="secondary" size="sm">
          {t(lang, { es: "Nuevo set", en: "New set" })}
        </Button>
        <Button
          type="button"
          onClick={() => {
            const correct = practicePairs.filter(
              (p) => matches[p.term] === p.definition
            ).length;
            setResult(
              t(lang, {
                es: `Correctas: ${correct} / ${practicePairs.length}`,
                en: `Correct: ${correct} / ${practicePairs.length}`,
              })
            );
          }}
          variant="primary"
          size="sm"
        >
          {t(lang, { es: "Comprobar", en: "Check" })}
        </Button>
      </div>
      {result && (
        <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-200">{result}</p>
      )}
    </div>
  );
}
