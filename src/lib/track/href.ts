import type { TrackId } from "@/lib/track";

/** Añade o sobrescribe `track` en la query, preservando el resto de params. */
export function hrefWithTrack(href: string, track: TrackId): string {
  const [path, query] = href.split("?");
  const params = new URLSearchParams(query ?? "");
  params.set("track", track);
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}
