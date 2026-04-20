import { runTsParsePixel } from "@/lib/exercises/run-ts-parse-pixel";

const solution = `
function parseCssPixel(value: string): number | null {
  const s = value.trim();
  const m = s.match(/^(-?\\d+(?:\\.\\d+)?)px$/i);
  if (!m) return null;
  return Number(m[1]);
}
`;

describe("runTsParsePixel", () => {
  it("accepts reference solution", () => {
    const r = runTsParsePixel(solution);
    expect(r).toEqual({ ok: true, passed: 10, total: 10 });
  });
});
