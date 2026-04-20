"use client";

import { useMemo, useState } from "react";

import { useTrackStore } from "@/stores/useTrackStore";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { SLANG_ENTRIES, type MinTrack } from "@/lib/reference/slang";
import { sampleDistinctBy, shuffleInPlace } from "@/lib/reference/shuffleSample";

function trackAllows(track: string, min: MinTrack) {
  if (track === "all") return true;
  if (min === "junior") return true;
  if (min === "mid") return track === "mid" || track === "senior";
  return track === "senior";
}

const BATCH_SIZE = 10;

type SlangPair = (typeof SLANG_ENTRIES)[number];

export function SlangPracticeCard() {
  const track = useTrackStore((s) => s.track);
  const [roundId, setRoundId] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  const pool = useMemo(
    () => SLANG_ENTRIES.filter((p) => trackAllows(track, p.minTrack)),
    [track]
  );

  const practicePairs = useMemo(() => {
    void roundId;
    return sampleDistinctBy(pool, BATCH_SIZE, (p) => p.en);
  }, [pool, roundId]);

  const shuffledRight = useMemo(() => {
    const copy: SlangPair[] = [...practicePairs];
    return shuffleInPlace(copy);
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
          <h2 className="text-lg font-semibold">Practice · Matching ES↔EN</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Unir ES con EN. Cada ronda: {BATCH_SIZE} pares del track (columna EN
            mezclada).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <span>
            Track: <span className="font-medium">{track}</span>
          </span>
          <span className="text-zinc-500 dark:text-zinc-400">
            · {practicePairs.length} pares
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            ES (click)
          </div>
          <div className="mt-2 grid gap-2">
            {practicePairs.map((p) => (
              <button
                key={`${p.es}|||${p.en}`}
                type="button"
                onClick={() => {
                  setSelected(p.es);
                  setResult(null);
                }}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  selected === p.es
                    ? "border-brand bg-brand text-zinc-900"
                    : "border-zinc-200 bg-zinc-100 hover:bg-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-100/10"
                )}
              >
                {p.es}
                {matches[p.es] && <span className="ml-2 text-xs opacity-75">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            EN (click para asignar)
          </div>
          <div className="mt-2 grid gap-2">
            {shuffledRight.map((p) => {
              const assignedTo = Object.entries(matches).find(
                ([, en]) => en === p.en
              )?.[0];
              const rowKey = `${p.es}|||${p.en}`;
              return (
                <button
                  key={rowKey}
                  type="button"
                  onClick={() => {
                    if (!selected) return;
                    setMatches((m) => ({ ...m, [selected]: p.en }));
                    setSelected(null);
                    setResult(null);
                  }}
                  className="rounded-lg border border-dashed border-zinc-300 bg-zinc-200 px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-900/5 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-100/10"
                >
                  <div className="font-medium">{p.en}</div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {p.meaning}
                  </div>
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
        <Button onClick={resetBoard} variant="secondary" size="sm">
          Limpiar asignaciones
        </Button>
        <Button type="button" onClick={newRound} variant="secondary" size="sm">
          Nuevo set
        </Button>
        <Button
          type="button"
          onClick={() => {
            const correct = practicePairs.filter((p) => matches[p.es] === p.en).length;
            setResult(`Correctas: ${correct} / ${practicePairs.length}`);
          }}
          variant="primary"
          size="sm"
        >
          Comprobar
        </Button>
      </div>
      {result && (
        <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-200">{result}</p>
      )}
    </div>
  );
}
