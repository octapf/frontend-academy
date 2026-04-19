"use client";

import Link from "next/link";

import type { TrackId } from "@/lib/track";
import { hrefWithTrack } from "@/lib/track/href";
import { useTrackStore } from "@/stores/useTrackStore";

type Props = {
  moduleSlug: string;
  lessonSlug: string;
  current: "es" | "en";
};

function lessonHref(
  moduleSlug: string,
  lessonSlug: string,
  lang: "es" | "en",
  track: TrackId
) {
  const params = new URLSearchParams();
  params.set("lang", lang);
  const path = `/learn/${moduleSlug}/${lessonSlug}?${params.toString()}`;
  return hrefWithTrack(path, track);
}

export function LessonLanguageSwitcher({
  moduleSlug,
  lessonSlug,
  current,
}: Props) {
  const track = useTrackStore((s) => s.track);

  return (
    <div className="inline-flex rounded-lg border border-black/10 bg-white p-1 text-sm dark:border-white/15 dark:bg-zinc-950">
      <Link
        href={lessonHref(moduleSlug, lessonSlug, "es", track)}
        className={`rounded-md px-3 py-1.5 ${current === "es" ? "bg-black text-white dark:bg-white dark:text-black" : "text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"}`}
      >
        ES
      </Link>
      <Link
        href={lessonHref(moduleSlug, lessonSlug, "en", track)}
        className={`rounded-md px-3 py-1.5 ${current === "en" ? "bg-black text-white dark:bg-white dark:text-black" : "text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"}`}
      >
        EN
      </Link>
    </div>
  );
}
