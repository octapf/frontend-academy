import {
  applyLearnLangToSearchParams,
  learnLangSearchSuffix,
  parseLearnLang,
  withLearnLang,
} from "@/lib/i18n/learn-lang";
import { hrefWithTrack } from "@/lib/track/href";

describe("parseLearnLang", () => {
  it("defaults to Spanish", () => {
    expect(parseLearnLang(undefined)).toBe("es");
    expect(parseLearnLang("")).toBe("es");
    expect(parseLearnLang(["x"])).toBe("es");
  });

  it("detects English", () => {
    expect(parseLearnLang("en")).toBe("en");
    expect(parseLearnLang(["en"])).toBe("en");
  });
});

describe("learnLangSearchSuffix", () => {
  it("adds query only for English", () => {
    expect(learnLangSearchSuffix("es")).toBe("");
    expect(learnLangSearchSuffix("en")).toBe("?lang=en");
  });
});

describe("applyLearnLangToSearchParams", () => {
  it("sets or removes lang", () => {
    const a = new URLSearchParams("track=junior");
    applyLearnLangToSearchParams(a, "en");
    expect(a.get("lang")).toBe("en");
    expect(a.get("track")).toBe("junior");

    applyLearnLangToSearchParams(a, "es");
    expect(a.get("lang")).toBeNull();
  });
});

describe("withLearnLang", () => {
  it("leaves path unchanged for Spanish", () => {
    expect(withLearnLang("/learn/react", "es")).toBe("/learn/react");
  });

  it("appends lang=en without existing query", () => {
    expect(withLearnLang("/learn", "en")).toBe("/learn?lang=en");
  });

  it("merges with existing query", () => {
    const merged = withLearnLang("/learn/react?track=mid", "en");
    expect(merged).toMatch(/lang=en/);
    expect(merged).toMatch(/track=mid/);
  });
});

describe("hrefWithTrack + withLearnLang", () => {
  it("preserves lang when adding track", () => {
    const href = hrefWithTrack(withLearnLang("/learn/a/b", "en"), "junior");
    expect(href).toMatch(/lang=en/);
    expect(href).toMatch(/track=junior/);
  });
});
