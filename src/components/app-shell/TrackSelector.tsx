"use client";

import { TRACKS, type TrackId, trackLabel } from "@/lib/track";
import { useTrackStore } from "@/stores/useTrackStore";

export function TrackSelector() {
  const track = useTrackStore((s) => s.track);
  const setTrack = useTrackStore((s) => s.setTrack);

  return (
    <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-100 p-1 text-sm dark:border-zinc-700 dark:bg-zinc-950">
      {TRACKS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => setTrack(id)}
          className={[
            "rounded-md px-2.5 py-1.5 transition-colors",
            track === id
              ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
              : "text-zinc-700 hover:bg-zinc-900/5 dark:text-zinc-200 dark:hover:bg-zinc-100/10",
          ].join(" ")}
          aria-pressed={track === id}
        >
          {trackLabel(id as TrackId)}
        </button>
      ))}
    </div>
  );
}

