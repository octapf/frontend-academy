import { runTsToTitleCase } from "@/lib/exercises/run-ts-to-title-case";

describe("runTsToTitleCase", () => {
  it("passes for a correct implementation", () => {
    const code = `function toTitleCase(input: string): string {
  return input
    .trim()
    .split(/\\s+/)
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}`;
    const res = runTsToTitleCase(code);
    expect(res.ok).toBe(true);
  });
});

