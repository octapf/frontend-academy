/** Fisher–Yates shuffle in-place, returns same array reference. */
export function shuffleInPlace<T>(items: T[], random: () => number = Math.random): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function samplePracticePairs<T>(all: T[], size: number, random: () => number = Math.random): T[] {
  if (all.length <= size) {
    return shuffleInPlace([...all], random);
  }
  const copy = [...all];
  shuffleInPlace(copy, random);
  return copy.slice(0, size);
}

/**
 * Sample up to `size` items with distinct values of `keyFn(item)` (e.g. slang EN),
 * so matching exercises stay unambiguous when the key string repeats across rows.
 */
export function sampleDistinctBy<T>(
  all: T[],
  size: number,
  keyFn: (item: T) => string,
  random: () => number = Math.random
): T[] {
  const shuffled = shuffleInPlace([...all], random);
  const out: T[] = [];
  const seen = new Set<string>();
  for (const item of shuffled) {
    const k = keyFn(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
    if (out.length >= size) break;
  }
  return out;
}
