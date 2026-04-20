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
            "rounded-md px-2.5 py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100 dark:focus-visible:ring-brand/50 dark:focus-visible:ring-offset-zinc-950",
            track === id
              ? "bg-brand text-zinc-900"
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

