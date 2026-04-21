"use client";

import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n/ui";
import { useLearnLangStore } from "@/stores/useLearnLangStore";

type ReferenceBrowseControlsProps = {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder?: string;
  page: number;
  pageSize: number;
  totalFiltered: number;
  onPageChange: (nextPage: number) => void;
};

export function ReferenceBrowseControls({
  query,
  onQueryChange,
  placeholder,
  page,
  pageSize,
  totalFiltered,
  onPageChange,
}: ReferenceBrowseControlsProps) {
  const lang = useLearnLangStore((s) => s.lang);
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = totalFiltered === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(totalFiltered, safePage * pageSize);

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <label className="block flex-1 text-sm">
        <span className="sr-only">{t(lang, { es: "Buscar", en: "Search" })}</span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder ?? t(lang, { es: "Buscar…", en: "Search…" })}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-brand/40 placeholder:text-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
        />
      </label>
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <span>
          {totalFiltered === 0
            ? t(lang, { es: "0 resultados", en: "0 results" })
            : t(lang, {
                es: `${start}–${end} de ${totalFiltered}`,
                en: `${start}–${end} of ${totalFiltered}`,
              })}
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
        >
          {t(lang, { es: "Anterior", en: "Prev" })}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
        >
          {t(lang, { es: "Siguiente", en: "Next" })}
        </Button>
      </div>
    </div>
  );
}
