import { runTsInvariant } from "@/lib/exercises/run-ts-invariant";

describe("runTsInvariant", () => {
  it("passes for a correct implementation", () => {
    const code = `function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}`;
    const res = runTsInvariant(code);
    expect(res.ok).toBe(true);
  });
});

