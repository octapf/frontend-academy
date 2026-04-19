import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("password", () => {
  it("round-trips hash and verify", () => {
    const hash = hashPassword("hunter2-secret");
    expect(verifyPassword("hunter2-secret", hash)).toBe(true);
    expect(verifyPassword("wrong", hash)).toBe(false);
  });
});
