import * as ts from "typescript";

export type RunTsPickKeysResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{
  obj: Record<string, unknown>;
  keys: string[];
  expected: Record<string, unknown>;
}> = [
  { obj: { a: 1, b: 2 }, keys: ["a"], expected: { a: 1 } },
  { obj: { a: 1, b: 2 }, keys: ["b", "a"], expected: { b: 2, a: 1 } },
  { obj: { name: "Ada", email: "ada@x" }, keys: ["email"], expected: { email: "ada@x" } },
];

export function runTsPickKeys(code: string): RunTsPickKeysResult {
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

  let pickKeys:
    | ((obj: Record<string, unknown>, keys: string[]) => Record<string, unknown>)
    | undefined;
  try {
    pickKeys = new Function(`${transpiled.outputText}\nreturn pickKeys;`)() as typeof pickKeys;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }

  if (typeof pickKeys !== "function") return { ok: false, error: "`pickKeys` is not a function" };

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = pickKeys(t.obj, t.keys);
      const outJson = JSON.stringify(out);
      const expJson = JSON.stringify(t.expected);
      if (outJson !== expJson) {
        return {
          ok: false,
          error: `Expected pickKeys(${JSON.stringify(t.obj)}, ${JSON.stringify(t.keys)}) === ${expJson}, got ${outJson}`,
        };
      }
      passed += 1;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Test threw" };
    }
  }
  return { ok: true, passed, total: CASES.length };
}

