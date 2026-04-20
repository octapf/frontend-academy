import { runTsClassnames } from "@/lib/exercises/run-ts-classnames";

describe("runTsClassnames", () => {
  it("passes for a correct implementation", () => {
    const code = `function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}`;
    const res = runTsClassnames(code);
    expect(res.ok).toBe(true);
  });
});

