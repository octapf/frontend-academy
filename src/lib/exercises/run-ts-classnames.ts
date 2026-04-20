import * as ts from "typescript";

export type RunTsClassnamesResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{ input: Array<string | false | null | undefined>; expected: string }> = [
  { input: ["a", "b"], expected: "a b" },
  { input: ["a", false, "b", null, undefined], expected: "a b" },
  { input: [], expected: "" },
  { input: ["a", ""], expected: "a" },
];

export function runTsClassnames(code: string): RunTsClassnamesResult {
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

  let cn: ((...values: Array<string | false | null | undefined>) => string) | undefined;
  try {
    cn = new Function(`${transpiled.outputText}\nreturn cn;`)() as typeof cn;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof cn !== "function") return { ok: false, error: "`cn` is not a function" };

  let passed = 0;
  for (const t of CASES) {
    try {
      // Spread array into variadic function
      const out = cn(...t.input);
      if (out !== t.expected) {
        return {
          ok: false,
          error: `Expected cn(${JSON.stringify(t.input)}) === ${JSON.stringify(t.expected)}, got ${JSON.stringify(out)}`,
        };
      }
      passed += 1;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Test threw" };
    }
  }
  return { ok: true, passed, total: CASES.length };
}

