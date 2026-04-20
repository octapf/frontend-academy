import { runTsSafeJsonParse } from "@/lib/exercises/run-ts-safe-json-parse";

describe("runTsSafeJsonParse", () => {
  it("passes for a correct implementation", () => {
    const code = `function safeJsonParse(input: string): unknown | null {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}`;
    const res = runTsSafeJsonParse(code);
    expect(res.ok).toBe(true);
  });
});

