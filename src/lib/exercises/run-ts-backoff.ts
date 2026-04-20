import * as ts from "typescript";

export type RunTsBackoffResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{
  baseMs: number;
  factor: number;
  attempts: number;
  expected: number[];
}> = [
  { baseMs: 100, factor: 2, attempts: 0, expected: [] },
  { baseMs: 100, factor: 2, attempts: 1, expected: [100] },
  { baseMs: 100, factor: 2, attempts: 3, expected: [100, 200, 400] },
  { baseMs: 50, factor: 3, attempts: 2, expected: [50, 150] },
];

export function runTsBackoff(code: string): RunTsBackoffResult {
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

  let backoffDelays: ((baseMs: number, factor: number, attempts: number) => number[]) | undefined;
  try {
    backoffDelays = new Function(`${transpiled.outputText}\nreturn backoffDelays;`)() as typeof backoffDelays;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof backoffDelays !== "function") {
    return { ok: false, error: "`backoffDelays` is not a function" };
  }

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = backoffDelays(t.baseMs, t.factor, t.attempts);
      if (JSON.stringify(out) !== JSON.stringify(t.expected)) {
        return {
          ok: false,
          error: `Expected ${JSON.stringify(t.expected)}, got ${JSON.stringify(out)}`,
        };
      }
      passed += 1;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Test threw" };
    }
  }
  return { ok: true, passed, total: CASES.length };
}

