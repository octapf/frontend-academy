import * as ts from "typescript";

export type RunTsAssertNeverResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

export function runTsAssertNever(code: string): RunTsAssertNeverResult {
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

  let assertNever: ((x: never) => never) | undefined;
  try {
    assertNever = new Function(`${transpiled.outputText}\nreturn assertNever;`)() as typeof assertNever;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof assertNever !== "function") {
    return { ok: false, error: "`assertNever` is not a function" };
  }

  // Runtime check: should always throw for any value passed.
  let passed = 0;
  const total = 2;
  try {
    assertNever("x" as never);
    return { ok: false, error: "Expected assertNever to throw" };
  } catch {
    passed += 1;
  }
  try {
    assertNever(123 as never);
    return { ok: false, error: "Expected assertNever to throw" };
  } catch {
    passed += 1;
  }
  return { ok: true, passed, total };
}

