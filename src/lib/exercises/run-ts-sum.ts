import * as ts from "typescript";

export type RunTsSumResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const TESTS: Array<{ a: number; b: number; expected: number }> = [
  { a: 0, b: 0, expected: 0 },
  { a: 1, b: 2, expected: 3 },
  { a: -4, b: 7, expected: 3 },
];

export function runTsSum(code: string): RunTsSumResult {
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

  let sumFn: ((a: number, b: number) => number) | undefined;
  try {
    sumFn = new Function(`${transpiled.outputText}\nreturn sum;`)() as (
      a: number,
      b: number
    ) => number;
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Runtime error",
    };
  }

  if (typeof sumFn !== "function") {
    return { ok: false, error: "`sum` is not a function" };
  }

  let passed = 0;
  for (const t of TESTS) {
    try {
      const out = sumFn(t.a, t.b);
      if (out !== t.expected) {
        return {
          ok: false,
          error: `Expected sum(${t.a}, ${t.b}) === ${t.expected}, got ${String(out)}`,
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

  return { ok: true, passed, total: TESTS.length };
}
