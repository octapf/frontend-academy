import { runTsSum } from "@/lib/exercises/run-ts-sum";

describe("runTsSum", () => {
  it("passes when sum is correct", () => {
    const code = `function sum(a: number, b: number): number {
  return a + b;
}`;
    expect(runTsSum(code)).toEqual({ ok: true, passed: 3, total: 3 });
  });

  it("fails when sum is wrong", () => {
    const code = `function sum(a: number, b: number): number {
  return a - b;
}`;
    const r = runTsSum(code);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toContain("Expected");
    }
  });

  it("fails on empty code", () => {
    expect(runTsSum("   ")).toEqual({ ok: false, error: "Empty code" });
  });
});
