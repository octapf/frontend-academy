import { runTsStrictInt } from "@/lib/exercises/run-ts-strict-int";

const solution = `
function parseStrictInt(value: string): number | null {
  const s = value.trim();
  if (!/^-?\\d+$/.test(s)) return null;
  return Number(s);
}
`;

describe("runTsStrictInt", () => {
  it("accepts reference solution", () => {
    const r = runTsStrictInt(solution);
    expect(r).toEqual({ ok: true, passed: 11, total: 11 });
  });
});
