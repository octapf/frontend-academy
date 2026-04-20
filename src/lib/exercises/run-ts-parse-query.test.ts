import { runTsParseQuery } from "@/lib/exercises/run-ts-parse-query";

describe("runTsParseQuery", () => {
  it("passes for a correct implementation", () => {
    const code = `function parseQuery(qs: string): Record<string, string> {
  const out: Record<string, string> = {};
  const p = new URLSearchParams(qs);
  for (const [k, v] of p.entries()) out[k] = v;
  return out;
}`;
    const res = runTsParseQuery(code);
    expect(res.ok).toBe(true);
  });
});

