import { runTsGroupBy } from "@/lib/exercises/run-ts-group-by";

describe("runTsGroupBy", () => {
  it("passes for a correct implementation", () => {
    const code = `function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const item of items) {
    const k = key(item);
    (out[k] ??= []).push(item);
  }
  return out;
}`;
    const res = runTsGroupBy(code);
    expect(res.ok).toBe(true);
  });
});

