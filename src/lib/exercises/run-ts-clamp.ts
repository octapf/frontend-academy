import * as ts from "typescript";

export type RunTsClampResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{ n: number; min: number; max: number; expected: number }> = [
  { n: 0, min: 0, max: 10, expected: 0 },
  { n: -1, min: 0, max: 10, expected: 0 },
  { n: 11, min: 0, max: 10, expected: 10 },
  { n: 5, min: 0, max: 10, expected: 5 },
  { n: 10, min: 10, max: 10, expected: 10 },
];

export function runTsClamp(code: string): RunTsClampResult {
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

  let clamp: ((n: number, min: number, max: number) => number) | undefined;
  try {
    clamp = new Function(`${transpiled.outputText}\nreturn clamp;`)() as typeof clamp;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof clamp !== "function") return { ok: false, error: "`clamp` is not a function" };

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = clamp(t.n, t.min, t.max);
      if (out !== t.expected) {
        return {
          ok: false,
          error: `Expected clamp(${t.n}, ${t.min}, ${t.max}) === ${t.expected}, got ${String(out)}`,
        };
      }
      passed += 1;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Test threw" };
    }
  }
  return { ok: true, passed, total: CASES.length };
}

