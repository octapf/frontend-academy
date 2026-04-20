import { runTsShallowEqual } from "@/lib/exercises/run-ts-shallow-equal";

describe("runTsShallowEqual", () => {
  it("passes for a correct implementation", () => {
    const code = `function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  if (a === b) return true;
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) {
    if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
    if (a[k] !== (b as any)[k]) return false;
  }
  return true;
}`;
    const res = runTsShallowEqual(code);
    expect(res.ok).toBe(true);
  });
});

