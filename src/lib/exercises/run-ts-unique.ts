import * as ts from "typescript";

export type RunTsUniqueResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

type Row = { id: number; team: string };
const CASES: Array<{ items: Row[]; expectedIds: number[] }> = [
  { items: [{ id: 1, team: "a" }, { id: 2, team: "a" }, { id: 3, team: "b" }], expectedIds: [1, 3] },
  { items: [], expectedIds: [] },
  { items: [{ id: 1, team: "a" }, { id: 2, team: "b" }], expectedIds: [1, 2] },
];

export function runTsUnique(code: string): RunTsUniqueResult {
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

  let uniqueBy: (<T>(items: T[], key: (item: T) => string | number) => T[]) | undefined;
  try {
    uniqueBy = new Function(`${transpiled.outputText}\nreturn uniqueBy;`)() as typeof uniqueBy;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof uniqueBy !== "function") return { ok: false, error: "`uniqueBy` is not a function" };

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = uniqueBy(t.items, (x: Row) => x.team) as Row[];
      const ids = out.map((x) => x.id);
      if (JSON.stringify(ids) !== JSON.stringify(t.expectedIds)) {
        return {
          ok: false,
          error: `Expected ids ${JSON.stringify(t.expectedIds)}, got ${JSON.stringify(ids)}`,
        };
      }
      passed += 1;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Test threw" };
    }
  }
  return { ok: true, passed, total: CASES.length };
}

