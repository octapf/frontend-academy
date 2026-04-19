import { runTsGreeting } from "@/lib/exercises/run-ts-greeting";

describe("runTsGreeting", () => {
  it("passes when greeting uses template string", () => {
    const code = `function greeting(name: string): string {
  return \`Hello, \${name}!\`;
}`;
    expect(runTsGreeting(code)).toEqual({ ok: true, passed: 3, total: 3 });
  });

  it("fails on wrong format", () => {
    const code = `function greeting(name: string): string {
  return "Hi " + name;
}`;
    const r = runTsGreeting(code);
    expect(r.ok).toBe(false);
  });
});
