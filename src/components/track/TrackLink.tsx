"use client";

import type { ReactNode } from "react";
import Link, { type LinkProps } from "next/link";

import { hrefWithTrack } from "@/lib/track/href";
import { useTrackStore } from "@/stores/useTrackStore";

type TrackLinkProps = Omit<LinkProps, "href"> & {
  href: string;
  children: ReactNode;
  className?: string;
};

/** `Link` que preserva / añade `?track=` según el store. */
export function TrackLink({ href, ...rest }: TrackLinkProps) {
  const track = useTrackStore((s) => s.track);
  return <Link href={hrefWithTrack(href, track)} {...rest} />;
}
