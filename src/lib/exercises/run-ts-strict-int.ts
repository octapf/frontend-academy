import * as ts from "typescript";

export type RunTsStrictIntResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

type Fn = (value: string) => number | null;

export function runTsStrictInt(code: string): RunTsStrictIntResult {
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

  let parseStrictInt: Fn | undefined;
  try {
    parseStrictInt = new Function(`${transpiled.outputText}\nreturn parseStrictInt;`)() as Fn;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof parseStrictInt !== "function") {
    return { ok: false, error: "`parseStrictInt` is not a function" };
  }

  const cases: Array<[string, number | null]> = [
    ["42", 42],
    ["  -3 ", -3],
    ["0", 0],
    ["007", 7],
    ["3.5", null],
    ["", null],
    ["  ", null],
    ["1a", null],
    ["--1", null],
    ["12e3", null],
    ["NaN", null],
  ];

  let passed = 0;
  const total = cases.length;
  for (const [input, expected] of cases) {
    let got: number | null;
    try {
      got = parseStrictInt(input);
    } catch (e) {
      return {
        ok: false,
        error: `Threw for ${JSON.stringify(input)}: ${
          e instanceof Error ? e.message : String(e)
        }`,
      };
    }
    if (got !== expected) {
      return {
        ok: false,
        error: `For ${JSON.stringify(input)}: expected ${expected}, got ${got}`,
      };
    }
    passed += 1;
  }

  return { ok: true, passed, total };
}
