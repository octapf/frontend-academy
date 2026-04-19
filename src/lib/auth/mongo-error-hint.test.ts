import {
  getMongoDriverCode,
  publicFileStoreErrorHint,
  publicMongoErrorHint,
} from "@/lib/auth/mongo-error-hint";

describe("publicMongoErrorHint", () => {
  it("detects bad auth by code 18", () => {
    const err = Object.assign(new Error("x"), { code: 18 });
    expect(publicMongoErrorHint(err)).toBeTruthy();
    expect(getMongoDriverCode(err)).toBe(18);
  });
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

describe("publicFileStoreErrorHint", () => {
  it("detects read-only fs", () => {
    expect(publicFileStoreErrorHint(new Error("EROFS: read-only file system"))).toBeTruthy();
  });
});
