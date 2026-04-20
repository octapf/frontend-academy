import * as ts from "typescript";

export type RunTsShapeAreaResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{ shape: unknown; expected: number }> = [
  { shape: { kind: "circle", r: 2 }, expected: Math.PI * 4 },
  { shape: { kind: "rect", w: 3, h: 5 }, expected: 15 },
];

export function runTsShapeArea(code: string): RunTsShapeAreaResult {
  const trimmed = code.trim();
  if (!trimmed) return { ok: false, error: "Empty code" };

  const transpiled = ts.transpileModule(trimmed, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None,
      strict: true,
    },
  });

  const diags = transpiled.diagnostics?.map((d) =>
    ts.flattenDiagnosticMessageText(d.messageText, "\n")
  );
  if (diags?.length) return { ok: false, error: "TypeScript diagnostics", diagnostics: diags };

  let area: ((shape: unknown) => number) | undefined;
  try {
    area = new Function(`${transpiled.outputText}\nreturn area;`)() as (
      shape: unknown
    ) => number;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof area !== "function") return { ok: false, error: "`area` is not a function" };

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = area(t.shape);
      if (typeof out !== "number" || Number.isNaN(out)) {
        return { ok: false, error: `Expected a number, got ${String(out)}` };
      }
      const close = Math.abs(out - t.expected) < 1e-6;
      if (!close) {
        return {
          ok: false,
          error: `Expected area(${JSON.stringify(t.shape)}) ≈ ${String(t.expected)}, got ${String(out)}`,
        };
      }
      passed += 1;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Test threw" };
    }
  }
  return { ok: true, passed, total: CASES.length };
}

