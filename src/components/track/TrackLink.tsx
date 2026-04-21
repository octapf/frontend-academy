"use client";

import type { ReactNode } from "react";
import Link, { type LinkProps } from "next/link";

import { withLearnLang } from "@/lib/i18n/learn-lang";
import { hrefWithTrack } from "@/lib/track/href";
import { useLearnLangStore } from "@/stores/useLearnLangStore";
import { useTrackStore } from "@/stores/useTrackStore";

type TrackLinkProps = Omit<LinkProps, "href"> & {
  href: string;
  children: ReactNode;
  className?: string;
};

/** `Link` que preserva / añade `?track=` según el store. */
export function TrackLink({ href, ...rest }: TrackLinkProps) {
  const track = useTrackStore((s) => s.track);
  const lang = useLearnLangStore((s) => s.lang);
  const withLang = withLearnLang(href, lang);
  return <Link href={hrefWithTrack(withLang, track)} {...rest} />;
}
