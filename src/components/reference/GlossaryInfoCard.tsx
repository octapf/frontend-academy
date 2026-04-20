"use client";

import { useMemo, useState } from "react";

import { useTrackStore } from "@/stores/useTrackStore";
import { GLOSSARY_ENTRIES, type MinTrack } from "@/lib/reference/glossary";

import { ReferenceBrowseControls } from "@/components/reference/ReferenceBrowseControls";

function trackAllows(track: string, min: MinTrack) {
  if (track === "all") return true;
  if (min === "junior") return true;
  if (min === "mid") return track === "mid" || track === "senior";
  return track === "senior";
}

const PAGE_SIZE = 40;

export function GlossaryInfoCard() {
  const track = useTrackStore((s) => s.track);
  const [query, setQuery] = useState("");
  const browseKey = `${track}::${query}`;
  const [pageByBrowseKey, setPageByBrowseKey] = useState<Record<string, number>>({});

  const page = pageByBrowseKey[browseKey] ?? 1;
  const setPage = (next: number) =>
    setPageByBrowseKey((prev) => ({ ...prev, [browseKey]: next }));

  const rows = useMemo(
    () => GLOSSARY_ENTRIES.filter((p) => trackAllows(track, p.minTrack)),
    [track]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.term.toLowerCase().includes(q) ||
        r.definition.toLowerCase().includes(q) ||
        r.minTrack.toLowerCase().includes(q)
    );
  }, [rows, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paged = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  );

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Términos</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Lectura rápida. La práctica vive en Learn.
          </p>
        </div>
        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          Track: <span className="font-medium">{track}</span>
        </div>
      </div>

      <ReferenceBrowseControls
        query={query}
        onQueryChange={setQuery}
        placeholder="Buscar término o definición…"
        page={safePage}
        pageSize={PAGE_SIZE}
        totalFiltered={filtered.length}
        onPageChange={setPage}
      />

      <div className="mt-4 grid gap-2">
        {paged.map((r) => (
          <div
            key={r.term}
            className="rounded-lg border border-zinc-200 bg-zinc-200/60 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900/40"
          >
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {r.term}
            </div>
            <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
              {r.definition}
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
