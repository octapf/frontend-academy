import { runTsErrorMessage } from "@/lib/exercises/run-ts-error-message";

describe("runTsErrorMessage", () => {
  it("passes for a correct implementation", () => {
    const code = `function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "Unknown error";
}`;
    const res = runTsErrorMessage(code);
    expect(res.ok).toBe(true);
  });
});

