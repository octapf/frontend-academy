import * as ts from "typescript";

export type RunTsToTitleCaseResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{ input: string; expected: string }> = [
  { input: "", expected: "" },
  { input: "hola mundo", expected: "Hola Mundo" },
  { input: "  hola   mundo  ", expected: "Hola Mundo" },
  { input: "FEA academy", expected: "Fea Academy" },
];

export function runTsToTitleCase(code: string): RunTsToTitleCaseResult {
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

  let toTitleCase: ((input: string) => string) | undefined;
  try {
    toTitleCase = new Function(`${transpiled.outputText}\nreturn toTitleCase;`)() as typeof toTitleCase;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof toTitleCase !== "function") return { ok: false, error: "`toTitleCase` is not a function" };

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = toTitleCase(t.input);
      if (out !== t.expected) {
        return {
          ok: false,
          error: `Expected toTitleCase(${JSON.stringify(t.input)}) === ${JSON.stringify(t.expected)}, got ${JSON.stringify(out)}`,
        };
      }
      passed += 1;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Test threw" };
    }
  }
  return { ok: true, passed, total: CASES.length };
}

