import { runTsResolveFlag } from "@/lib/exercises/run-ts-resolve-flag";

const solution = `
function resolveFeatureEnabled(flag: unknown, defaultValue: boolean): boolean {
  if (flag === null || flag === undefined) return defaultValue;
  if (typeof flag === "boolean") return flag;
  if (typeof flag === "string") {
    const s = flag.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(s)) return true;
    if (["false", "0", "no", "off"].includes(s)) return false;
  }
  return defaultValue;
}
`;

describe("runTsResolveFlag", () => {
  it("accepts reference solution", () => {
    const r = runTsResolveFlag(solution);
    expect(r).toEqual({ ok: true, passed: 18, total: 18 });
  });

  it("rejects empty", () => {
    expect(runTsResolveFlag("")).toMatchObject({ ok: false });
  });
});
