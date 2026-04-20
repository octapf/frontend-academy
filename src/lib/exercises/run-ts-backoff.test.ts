import { runTsBackoff } from "@/lib/exercises/run-ts-backoff";

describe("runTsBackoff", () => {
  it("passes for a correct implementation", () => {
    const code = `function backoffDelays(baseMs: number, factor: number, attempts: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < attempts; i += 1) out.push(baseMs * Math.pow(factor, i));
  return out;
}`;
    const res = runTsBackoff(code);
    expect(res.ok).toBe(true);
  });
});

