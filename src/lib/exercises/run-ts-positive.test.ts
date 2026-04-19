import { runTsPositive } from "@/lib/exercises/run-ts-positive";

describe("runTsPositive", () => {
  it("passes when predicate is correct", () => {
    const code = `function isPositive(n: unknown): n is number {
  return typeof n === "number" && n > 0;
}`;
    expect(runTsPositive(code)).toEqual({ ok: true, passed: 6, total: 6 });
  });

  it("fails when predicate is wrong", () => {
    const code = `function isPositive(n: unknown): n is number {
  return typeof n === "number";
}`;
    const r = runTsPositive(code);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toContain("Expected");
    }
  });

  it("fails on empty code", () => {
    expect(runTsPositive("   ")).toEqual({ ok: false, error: "Empty code" });
  });
});
