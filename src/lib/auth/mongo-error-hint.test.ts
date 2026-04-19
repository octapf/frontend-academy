import { publicMongoErrorHint } from "@/lib/auth/mongo-error-hint";

describe("publicMongoErrorHint", () => {
  it("detects bad auth", () => {
    expect(publicMongoErrorHint(new Error("bad auth Authentication failed"))).toBeTruthy();
  });
  it("detects timeout", () => {
    expect(publicMongoErrorHint(new Error("Server selection timed out"))).toBeTruthy();
  });
  it("detects missing URI", () => {
    expect(publicMongoErrorHint(new Error("MONGODB_URI is not set"))).toBeTruthy();
  });
  it("returns undefined for unknown", () => {
    expect(publicMongoErrorHint(new Error("something else"))).toBeUndefined();
  });
});
