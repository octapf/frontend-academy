import { runTsClamp } from "@/lib/exercises/run-ts-clamp";

describe("runTsClamp", () => {
  it("passes for a correct implementation", () => {
    const code = `function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}`;
    const res = runTsClamp(code);
    expect(res.ok).toBe(true);
  });
});

