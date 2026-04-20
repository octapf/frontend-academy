import * as ts from "typescript";

export type RunTsInvariantResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

export function runTsInvariant(code: string): RunTsInvariantResult {
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

  let invariant: ((condition: unknown, message: string) => void) | undefined;
  try {
    invariant = new Function(`${transpiled.outputText}\nreturn invariant;`)() as typeof invariant;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Runtime error" };
  }
  if (typeof invariant !== "function") return { ok: false, error: "`invariant` is not a function" };

  let passed = 0;
  const total = 3;
  try {
    invariant(true, "nope");
    passed += 1;
  } catch {
    return { ok: false, error: "Expected invariant(true) to not throw" };
  }
  try {
    invariant(1, "nope");
    passed += 1;
  } catch {
    return { ok: false, error: "Expected invariant(1) to not throw" };
  }
  try {
    invariant(false, "boom");
    return { ok: false, error: "Expected invariant(false) to throw" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg !== "boom") {
      return { ok: false, error: `Expected error message "boom", got ${JSON.stringify(msg)}` };
    }
    passed += 1;
  }

  return { ok: true, passed, total };
}

