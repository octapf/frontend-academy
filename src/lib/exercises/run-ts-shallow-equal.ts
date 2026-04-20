import * as ts from "typescript";

export type RunTsShallowEqualResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{
  a: Record<string, unknown>;
  b: Record<string, unknown>;
  expected: boolean;
}> = [
  { a: { a: 1 }, b: { a: 1 }, expected: true },
  { a: { a: 1 }, b: { a: 2 }, expected: false },
  { a: { a: 1 }, b: { a: 1, b: 2 }, expected: false },
  { a: {}, b: {}, expected: true },
];

export function runTsShallowEqual(code: string): RunTsShallowEqualResult {
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

  let shallowEqual:
    | ((a: Record<string, unknown>, b: Record<string, unknown>) => boolean)
    | undefined;
  try {
    shallowEqual = new Function(`${transpiled.outputText}\nreturn shallowEqual;`)() as typeof shallowEqual;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof shallowEqual !== "function") {
    return { ok: false, error: "`shallowEqual` is not a function" };
  }

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = shallowEqual(t.a, t.b);
      if (out !== t.expected) {
        return {
          ok: false,
          error: `Expected shallowEqual(${JSON.stringify(t.a)}, ${JSON.stringify(t.b)}) === ${String(t.expected)}, got ${String(out)}`,
        };
      }
      passed += 1;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Test threw" };
    }
  }
  return { ok: true, passed, total: CASES.length };
}

