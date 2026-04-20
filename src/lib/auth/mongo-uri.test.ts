import { isMongoEnvConfigured, mongoUriScheme, normalizeMongoUri } from "@/lib/auth/mongo-uri";

describe("normalizeMongoUri", () => {
  it("strips wrapping double quotes", () => {
    expect(normalizeMongoUri('"mongodb+srv://u:p@h/db"')).toBe("mongodb+srv://u:p@h/db");
  });
  it("strips newlines", () => {
    expect(normalizeMongoUri("mongodb+srv://x\n")).toBe("mongodb+srv://x");
  });
  it("strips leading env assignment", () => {
    expect(normalizeMongoUri("MONGODB_URI=mongodb+srv://x")).toBe("mongodb+srv://x");
  });
  it("detects scheme", () => {
    expect(mongoUriScheme("mongodb://x")).toBe("mongodb://");
    expect(mongoUriScheme("mongodb+srv://x")).toBe("mongodb+srv://");
    expect(mongoUriScheme("xxx")).toBeNull();
  });
});

describe("isMongoEnvConfigured", () => {
  const prev = process.env.MONGODB_URI;

  afterEach(() => {
    process.env.MONGODB_URI = prev;
  });

  it("is false when unset", () => {
    delete process.env.MONGODB_URI;
    expect(isMongoEnvConfigured()).toBe(false);
  });

  it("is true with trimmed quoted uri", () => {
    process.env.MONGODB_URI = '"mongodb+srv://cluster.example/db"';
    expect(isMongoEnvConfigured()).toBe(true);
  });
});
