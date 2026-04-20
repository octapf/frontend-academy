"use client";

import { useMemo } from "react";

import { useTrackStore } from "@/stores/useTrackStore";
import { SLANG_ENTRIES, type MinTrack } from "@/lib/reference/slang";

function trackAllows(track: string, min: MinTrack) {
  if (track === "all") return true;
  if (min === "junior") return true;
  if (min === "mid") return track === "mid" || track === "senior";
  return track === "senior";
}

export function SlangInfoCard() {
  const track = useTrackStore((s) => s.track);
  const rows = useMemo(
    () => SLANG_ENTRIES.filter((p) => trackAllows(track, p.minTrack)),
    [track]
  );

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Jerga (ES/EN)</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Referencia rápida. La práctica vive en Learn.
          </p>
        </div>
        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          Track: <span className="font-medium">{track}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {rows.map((r) => (
          <div
            key={r.en}
            className="rounded-lg border border-zinc-200 bg-zinc-200/60 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900/40"
          >
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {r.es} <span className="text-zinc-500 dark:text-zinc-400">→</span> {r.en}
            </div>
            <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
              {r.meaning}
            </div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {r.minTrack}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

