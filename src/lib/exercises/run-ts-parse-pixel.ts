import * as ts from "typescript";

export type RunTsParsePixelResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

type Fn = (value: string) => number | null;

export function runTsParsePixel(code: string): RunTsParsePixelResult {
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

  let parseCssPixel: Fn | undefined;
  try {
    parseCssPixel = new Function(`${transpiled.outputText}\nreturn parseCssPixel;`)() as Fn;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof parseCssPixel !== "function") {
    return { ok: false, error: "`parseCssPixel` is not a function" };
  }

  const cases: Array<[string, number | null]> = [
    ["12px", 12],
    ["  3.5px ", 3.5],
    ["0px", 0],
    ["-4px", -4],
    ["10PX", 10],
    ["12", null],
    ["px", null],
    ["12em", null],
    ["", null],
    ["12 px", null],
  ];

  let passed = 0;
  const total = cases.length;
  for (const [input, expected] of cases) {
    let got: number | null;
    try {
      got = parseCssPixel(input);
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
