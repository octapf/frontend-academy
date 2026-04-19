export const TRACKS = ["junior", "mid", "senior", "all"] as const;
export type TrackId = (typeof TRACKS)[number];

export function parseTrackParam(
  value: string | null | undefined
): TrackId | null {
  if (!value) return null;
  return (TRACKS as readonly string[]).includes(value)
    ? (value as TrackId)
    : null;
}

export function trackLabel(track: TrackId): string {
  switch (track) {
    case "junior":
      return "Junior";
    case "mid":
      return "Mid";
    case "senior":
      return "Senior";
    case "all":
      return "All";
  }
}

