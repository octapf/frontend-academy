import * as ts from "typescript";

export type RunTsUserLabelResult =
  | { ok: true; passed: number; total: number }
  | { ok: false; error: string; diagnostics?: string[] };

const CASES: Array<{ user: { name: string; email: string }; expected: string }> =
  [
    {
      user: { name: "Ada", email: "ada@example.com" },
      expected: "Ada <ada@example.com>",
    },
    {
      user: { name: "Bob", email: "bob@test.dev" },
      expected: "Bob <bob@test.dev>",
    },
    {
      user: { name: "FEA", email: "fea+tag@local" },
      expected: "FEA <fea+tag@local>",
    },
  ];

export function runTsUserLabel(code: string): RunTsUserLabelResult {
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

  let userLabel:
    | ((user: { name: string; email: string }) => string)
    | undefined;
  try {
    userLabel = new Function(
      `${transpiled.outputText}\nreturn userLabel;`
    )() as (user: { name: string; email: string }) => string;
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Runtime error",
    };
  }

  if (typeof userLabel !== "function") {
    return { ok: false, error: "`userLabel` is not a function" };
  }

  let passed = 0;
  for (const t of CASES) {
    try {
      const out = userLabel(t.user);
      if (out !== t.expected) {
        return {
          ok: false,
          error: `Expected userLabel(${JSON.stringify(t.user)}) === ${JSON.stringify(t.expected)}, got ${JSON.stringify(out)}`,
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
