import { runTsParseNumber } from "@/lib/exercises/run-ts-parse-number";

describe("runTsParseNumber", () => {
  it("passes for a correct implementation", () => {
    const code = `function parseNumber(input: string): number | null {
  const s = input.trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}`;
    const res = runTsParseNumber(code);
    expect(res.ok).toBe(true);
  });
});

