import * as ts from "typescript";

export type RunTsParseNumberResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{ input: string; expected: number | null }> = [
  { input: "", expected: null },
  { input: "   ", expected: null },
  { input: "0", expected: 0 },
  { input: "10", expected: 10 },
  { input: "  3.5 ", expected: 3.5 },
  { input: "nope", expected: null },
  { input: "Infinity", expected: null },
];

export function runTsParseNumber(code: string): RunTsParseNumberResult {
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

  let parseNumber: ((input: string) => number | null) | undefined;
  try {
    parseNumber = new Function(`${transpiled.outputText}\nreturn parseNumber;`)() as typeof parseNumber;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof parseNumber !== "function") {
    return { ok: false, error: "`parseNumber` is not a function" };
  }

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = parseNumber(t.input);
      if (out !== t.expected) {
        return {
          ok: false,
          error: `Expected parseNumber(${JSON.stringify(t.input)}) === ${String(t.expected)}, got ${String(out)}`,
        };
      }
      passed += 1;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Test threw" };
    }
  }
  return { ok: true, passed, total: CASES.length };
}

