import { runTsAssertNever } from "@/lib/exercises/run-ts-assert-never";

describe("runTsAssertNever", () => {
  it("passes for a correct implementation", () => {
    const code = `function assertNever(x: never): never {
  throw new Error("Unexpected value");
}`;
    const res = runTsAssertNever(code);
    expect(res.ok).toBe(true);
  });
});

