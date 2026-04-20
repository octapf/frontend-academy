import { runTsUnique } from "@/lib/exercises/run-ts-unique";

describe("runTsUnique", () => {
  it("passes for a correct implementation", () => {
    const code = `function uniqueBy<T>(items: T[], key: (item: T) => string | number): T[] {
  const seen = new Set<string | number>();
  const out: T[] = [];
  for (const item of items) {
    const k = key(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}`;
    const res = runTsUnique(code);
    expect(res.ok).toBe(true);
  });
});

