import { runTsUserLabel } from "@/lib/exercises/run-ts-user-label";

describe("runTsUserLabel", () => {
  it("passes with name and angle brackets", () => {
    const code = `type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};

function userLabel(user: Pick<User, "name" | "email">): string {
  return \`\${user.name} <\${user.email}>\`;
}`;
    expect(runTsUserLabel(code)).toEqual({ ok: true, passed: 3, total: 3 });
  });

  it("fails on wrong format", () => {
    const code = `type User = { id: number; name: string; email: string; role: "admin" | "user" };
function userLabel(user: Pick<User, "name" | "email">): string {
  return user.name + " — " + user.email;
}`;
    const r = runTsUserLabel(code);
    expect(r.ok).toBe(false);
  });
});
