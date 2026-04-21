"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import type { LessonLang } from "@/lib/content/get-lesson";
import {
  applyLearnLangToSearchParams,
  parseLearnLang,
} from "@/lib/i18n/learn-lang";
import type { TrackId } from "@/lib/track";
import { hrefWithTrack } from "@/lib/track/href";
import { useLearnLangStore } from "@/stores/useLearnLangStore";
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
  const setLearnLang = useLearnLangStore((s) => s.setLearnLang);

  useEffect(() => {
    setLearnLang(searchParams.get("lang") === "en" ? "en" : "es");
  }, [searchParams, setLearnLang]);

  const current = parseLearnLang(searchParams.get("lang"));

  return (
    <div
      className="inline-flex rounded-lg border border-zinc-300 bg-zinc-100 p-1 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-950"
      role="group"
      aria-label="Idioma / Language"
    >
      <Link
        href={hrefForLang(pathname, searchParams, track, "es")}
        onClick={() => setLearnLang("es")}
        className={`rounded-md px-2.5 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100 dark:focus-visible:ring-brand/50 dark:focus-visible:ring-offset-zinc-950 ${current === "es" ? "bg-brand text-zinc-900" : "text-zinc-600 hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:bg-zinc-100/10"}`}
      >
        ES
      </Link>
      <Link
        href={hrefForLang(pathname, searchParams, track, "en")}
        onClick={() => setLearnLang("en")}
        className={`rounded-md px-2.5 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100 dark:focus-visible:ring-brand/50 dark:focus-visible:ring-offset-zinc-950 ${current === "en" ? "bg-brand text-zinc-900" : "text-zinc-600 hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:bg-zinc-100/10"}`}
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
