import * as ts from "typescript";

export type RunTsResolveFlagResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

type Fn = (flag: unknown, defaultValue: boolean) => boolean;

export function runTsResolveFlag(code: string): RunTsResolveFlagResult {
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

  let resolveFeatureEnabled: Fn | undefined;
  try {
    resolveFeatureEnabled = new Function(
      `${transpiled.outputText}\nreturn resolveFeatureEnabled;`
    )() as Fn;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof resolveFeatureEnabled !== "function") {
    return { ok: false, error: "`resolveFeatureEnabled` is not a function" };
  }

  const cases: Array<[unknown, boolean, boolean]> = [
    [undefined, true, true],
    [undefined, false, false],
    [null, true, true],
    [true, false, true],
    [false, true, false],
    ["TRUE", false, true],
    ["  yes ", false, true],
    ["on", false, true],
    ["1", false, true],
    ["FALSE", true, false],
    ["off", true, false],
    ["0", true, false],
    ["no", true, false],
    ["maybe", true, true],
    ["maybe", false, false],
    [42, true, true],
    [42, false, false],
    [{}, true, true],
  ];

  let passed = 0;
  const total = cases.length;
  for (const [flag, def, expected] of cases) {
    let got: boolean;
    try {
      got = resolveFeatureEnabled(flag, def);
    } catch (e) {
      return {
        ok: false,
        error: `Threw for ${JSON.stringify(flag)} / default ${def}: ${
          e instanceof Error ? e.message : String(e)
        }`,
      };
    }
    if (got !== expected) {
      return {
        ok: false,
        error: `For flag=${JSON.stringify(flag)} default=${def}: expected ${expected}, got ${got}`,
      };
    }
    passed += 1;
  }

  return { ok: true, passed, total };
}
