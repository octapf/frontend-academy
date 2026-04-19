import { authPageHref, sanitizeNextParam } from "@/lib/auth/next-redirect";

describe("sanitizeNextParam", () => {
  it("allows internal paths", () => {
    expect(sanitizeNextParam("/learn/react")).toBe("/learn/react");
    expect(sanitizeNextParam("/dashboard")).toBe("/dashboard");
  });

  it("rejects external or invalid", () => {
    expect(sanitizeNextParam("https://evil.com")).toBeNull();
    expect(sanitizeNextParam("//evil.com")).toBeNull();
    expect(sanitizeNextParam("")).toBeNull();
    expect(sanitizeNextParam(undefined)).toBeNull();
  });
});

describe("authPageHref", () => {
  it("appends next when present", () => {
    expect(authPageHref("/login", "/learn")).toBe("/login?next=%2Flearn");
  });

  it("omits query when next missing", () => {
    expect(authPageHref("/register", null)).toBe("/register");
  });
});
