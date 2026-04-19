import * as ts from "typescript";

export type RunTsPositiveResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{ value: unknown; expected: boolean }> = [
  { value: 3, expected: true },
  { value: 0.5, expected: true },
  { value: 0, expected: false },
  { value: -2, expected: false },
  { value: "5", expected: false },
  { value: null, expected: false },
];

export function runTsPositive(code: string): RunTsPositiveResult {
  const trimmed = code.trim();
  if (!trimmed) {
    return { ok: false, error: "Empty code" };
  }

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
  if (diags?.length) {
    return { ok: false, error: "TypeScript diagnostics", diagnostics: diags };
  }

  let isPositive: ((n: unknown) => n is number) | undefined;
  try {
    isPositive = new Function(
      `${transpiled.outputText}\nreturn isPositive;`
    )() as (n: unknown) => n is number;
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Runtime error",
    };
  }

  if (typeof isPositive !== "function") {
    return { ok: false, error: "`isPositive` is not a function" };
  }

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = isPositive(t.value);
      if (out !== t.expected) {
        return {
          ok: false,
          error: `Expected isPositive(${JSON.stringify(t.value)}) === ${String(t.expected)}, got ${String(out)}`,
        };
      }
      passed += 1;
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Test threw",
      };
    }
  }

  return { ok: true, passed, total: CASES.length };
}
