import * as ts from "typescript";

export type RunTsErrorMessageResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{ value: unknown; expected: string }> = [
  { value: new Error("boom"), expected: "boom" },
  { value: "x", expected: "x" },
  { value: 123, expected: "Unknown error" },
  { value: null, expected: "Unknown error" },
];

export function runTsErrorMessage(code: string): RunTsErrorMessageResult {
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

  let errorMessage: ((e: unknown) => string) | undefined;
  try {
    errorMessage = new Function(`${transpiled.outputText}\nreturn errorMessage;`)() as typeof errorMessage;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof errorMessage !== "function") {
    return { ok: false, error: "`errorMessage` is not a function" };
  }

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = errorMessage(t.value);
      if (out !== t.expected) {
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

