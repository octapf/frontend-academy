import * as ts from "typescript";

export type RunTsParseQueryResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{ qs: string; expected: Record<string, string> }> = [
  { qs: "", expected: {} },
  { qs: "a=1&b=hola", expected: { a: "1", b: "hola" } },
  { qs: "a=1&a=2", expected: { a: "2" } },
  { qs: "q=hello%20world", expected: { q: "hello world" } },
];

export function runTsParseQuery(code: string): RunTsParseQueryResult {
  const trimmed = code.trim();
  if (!trimmed) return { ok: false, error: "Empty code" };

  const transpiled = ts.transpileModule(trimmed, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None,
      strict: true,
      lib: ["es2020", "dom"],
    },
  });

  const diags = transpiled.diagnostics?.map((d) =>
    ts.flattenDiagnosticMessageText(d.messageText, "\n")
  );
  if (diags?.length) return { ok: false, error: "TypeScript diagnostics", diagnostics: diags };

  let parseQuery: ((qs: string) => Record<string, string>) | undefined;
  try {
    parseQuery = new Function(`${transpiled.outputText}\nreturn parseQuery;`)() as typeof parseQuery;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof parseQuery !== "function") return { ok: false, error: "`parseQuery` is not a function" };

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = parseQuery(t.qs);
      const outJson = JSON.stringify(out);
      const expJson = JSON.stringify(t.expected);
      if (outJson !== expJson) {
        return {
          ok: false,
          error: `Expected parseQuery(${JSON.stringify(t.qs)}) === ${expJson}, got ${outJson}`,
        };
      }
      passed += 1;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Test threw" };
    }
  }
  return { ok: true, passed, total: CASES.length };
}

