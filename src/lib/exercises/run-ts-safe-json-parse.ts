import * as ts from "typescript";

export type RunTsSafeJsonParseResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{ input: string; expected: unknown | null }> = [
  { input: "null", expected: null },
  { input: "123", expected: 123 },
  { input: "\"hi\"", expected: "hi" },
  { input: "{\"a\":1}", expected: { a: 1 } },
  { input: "{", expected: null },
];

export function runTsSafeJsonParse(code: string): RunTsSafeJsonParseResult {
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

  let safeJsonParse: ((input: string) => unknown | null) | undefined;
  try {
    safeJsonParse = new Function(`${transpiled.outputText}\nreturn safeJsonParse;`)() as typeof safeJsonParse;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof safeJsonParse !== "function") {
    return { ok: false, error: "`safeJsonParse` is not a function" };
  }

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = safeJsonParse(t.input);
      const outJson = JSON.stringify(out);
      const expJson = JSON.stringify(t.expected);
      if (outJson !== expJson) {
        return {
          ok: false,
          error: `Expected safeJsonParse(${JSON.stringify(t.input)}) === ${expJson}, got ${outJson}`,
        };
      }
      passed += 1;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Test threw" };
    }
  }
  return { ok: true, passed, total: CASES.length };
}

