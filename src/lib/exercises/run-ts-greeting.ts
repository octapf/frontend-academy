import * as ts from "typescript";

export type RunTsGreetingResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{ name: string; expected: string }> = [
  { name: "Ada", expected: "Hello, Ada!" },
  { name: "World", expected: "Hello, World!" },
  { name: "FEA", expected: "Hello, FEA!" },
];

export function runTsGreeting(code: string): RunTsGreetingResult {
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

  let greeting: ((name: string) => string) | undefined;
  try {
    greeting = new Function(
      `${transpiled.outputText}\nreturn greeting;`
    )() as (name: string) => string;
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Runtime error",
    };
  }

  if (typeof greeting !== "function") {
    return { ok: false, error: "`greeting` is not a function" };
  }

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = greeting(t.name);
      if (out !== t.expected) {
        return {
          ok: false,
          error: `Expected greeting(${JSON.stringify(t.name)}) === ${JSON.stringify(t.expected)}, got ${JSON.stringify(out)}`,
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

  return { ok: true, passed, total: CASES.length };
}
