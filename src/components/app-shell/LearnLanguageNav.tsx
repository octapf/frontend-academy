"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import type { LessonLang } from "@/lib/content/get-lesson";
import {
  applyLearnLangToSearchParams,
  parseLearnLang,
} from "@/lib/i18n/learn-lang";
import type { TrackId } from "@/lib/track";
import { hrefWithTrack } from "@/lib/track/href";
import { useTrackStore } from "@/stores/useTrackStore";

function hrefForLang(
  pathname: string,
  searchParams: URLSearchParams,
  track: TrackId,
  lang: LessonLang,
) {
  const p = new URLSearchParams(searchParams.toString());
  applyLearnLangToSearchParams(p, lang);
  const q = p.toString();
  return hrefWithTrack(q ? `${pathname}?${q}` : pathname, track);
}

function LearnLanguageNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const track = useTrackStore((s) => s.track);

  if (!pathname.startsWith("/learn")) return null;

  const current = parseLearnLang(searchParams.get("lang"));

  return (
    <div
      className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100 p-1 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-950"
      role="group"
      aria-label="Idioma del contenido Learn"
    >
      <Link
        href={hrefForLang(pathname, searchParams, track, "es")}
        className={`rounded-md px-2.5 py-1.5 ${current === "es" ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900" : "text-zinc-600 hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:bg-zinc-100/10"}`}
      >
        ES
      </Link>
      <Link
        href={hrefForLang(pathname, searchParams, track, "en")}
        className={`rounded-md px-2.5 py-1.5 ${current === "en" ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900" : "text-zinc-600 hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:bg-zinc-100/10"}`}
      >
        EN
      </Link>
    </div>
  );
}

export function LearnLanguageNav() {
  return (
    <Suspense fallback={null}>
      <LearnLanguageNavInner />
    </Suspense>
  );
}
