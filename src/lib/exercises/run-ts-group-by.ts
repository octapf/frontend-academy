import * as ts from "typescript";

export type RunTsGroupByResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{
  items: Array<Record<string, unknown>>;
  key: (x: Record<string, unknown>) => string;
  expected: Record<string, Array<Record<string, unknown>>>;
}> = [
  {
    items: [
      { id: 1, team: "a" },
      { id: 2, team: "b" },
      { id: 3, team: "a" },
    ],
    key: (x) => String(x.team),
    expected: {
      a: [
        { id: 1, team: "a" },
        { id: 3, team: "a" },
      ],
      b: [{ id: 2, team: "b" }],
    },
  },
  { items: [], key: () => "x", expected: {} },
];

export function runTsGroupBy(code: string): RunTsGroupByResult {
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

  let groupBy:
    | (<T>(
        items: T[],
        key: (item: T) => string
      ) => Record<string, T[]>)
    | undefined;
  try {
    groupBy = new Function(`${transpiled.outputText}\nreturn groupBy;`)() as typeof groupBy;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof groupBy !== "function") return { ok: false, error: "`groupBy` is not a function" };

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = groupBy(t.items, t.key);
      const outJson = JSON.stringify(out);
      const expJson = JSON.stringify(t.expected);
      if (outJson !== expJson) {
        return {
          ok: false,
          error: `Expected groupBy(...) === ${expJson}, got ${outJson}`,
        };
      }
      passed += 1;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Test threw" };
    }
  }
  return { ok: true, passed, total: CASES.length };
}

