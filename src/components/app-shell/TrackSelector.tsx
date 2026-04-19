"use client";

import { TRACKS, type TrackId, trackLabel } from "@/lib/track";
import { useTrackStore } from "@/stores/useTrackStore";

export function TrackSelector() {
  const track = useTrackStore((s) => s.track);
  const setTrack = useTrackStore((s) => s.setTrack);

  return (
    <div className="inline-flex items-center rounded-lg border border-black/10 bg-white p-1 text-sm dark:border-white/15 dark:bg-zinc-950">
      {TRACKS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => setTrack(id)}
          className={[
            "rounded-md px-2.5 py-1.5 transition-colors",
            track === id
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10",
          ].join(" ")}
          aria-pressed={track === id}
        >
          {trackLabel(id as TrackId)}
        </button>
      ))}
    </div>
  );
}

