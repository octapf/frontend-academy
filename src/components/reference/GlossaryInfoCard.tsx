"use client";

import { useMemo, useState } from "react";

import { useTrackStore } from "@/stores/useTrackStore";
import { GLOSSARY_ENTRIES, type MinTrack } from "@/lib/reference/glossary";
import { t } from "@/lib/i18n/ui";
import { useLearnLangStore } from "@/stores/useLearnLangStore";

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
  const lang = useLearnLangStore((s) => s.lang);
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
  const missingEnCount = useMemo(
    () => rows.filter((r) => !r.definitionEn || r.definitionEn.trim().length === 0).length,
    [rows]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.term.toLowerCase().includes(q) ||
        r.definition.toLowerCase().includes(q) ||
        (r.definitionEn?.toLowerCase().includes(q) ?? false) ||
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
          <h2 className="text-lg font-semibold">{t(lang, { es: "Términos", en: "Terms" })}</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {t(lang, {
              es: "Lectura rápida. La práctica vive en Learn.",
              en: "Quick reference. Practice lives in Learn.",
            })}
          </p>
          {lang === "en" && missingEnCount > 0 ? (
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
              {`Note: ${missingEnCount} definitions are still Spanish-only. We’ll translate them.`}
            </p>
          ) : null}
        </div>
        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          {t(lang, { es: "Track", en: "Track" })}:{" "}
          <span className="font-medium">{track}</span>
        </div>
      </div>

      <ReferenceBrowseControls
        query={query}
        onQueryChange={setQuery}
        placeholder={t(lang, { es: "Buscar término o definición…", en: "Search term or definition…" })}
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
              {lang === "en" ? (r.definitionEn ?? r.definition) : r.definition}
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
