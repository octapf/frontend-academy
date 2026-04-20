import { runTsPickKeys } from "@/lib/exercises/run-ts-pick-keys";

describe("runTsPickKeys", () => {
  it("passes for a correct implementation", () => {
    const code = `function pickKeys<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) (out as any)[k] = obj[k];
  return out;
}`;
    const res = runTsPickKeys(code);
    expect(res.ok).toBe(true);
  });
});

