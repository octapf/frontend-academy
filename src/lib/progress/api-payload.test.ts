import {
  isProgressApiPayload,
  type ProgressApiPayload,
} from "@/lib/progress/api-payload";

describe("isProgressApiPayload", () => {
  it("accepts valid GET /api/progress bodies", () => {
    const p: ProgressApiPayload = {
      ok: true,
      lessonsOpened: 1,
      exercisesPassed: 0,
      lastActivityIso: null,
      lessonKeys: ["react/intro"],
      exerciseIds: [],
    };
    expect(isProgressApiPayload(p)).toBe(true);
  });

  it("rejects invalid shapes", () => {
    expect(isProgressApiPayload(null)).toBe(false);
    expect(isProgressApiPayload({ ok: false })).toBe(false);
    expect(isProgressApiPayload({ ok: true, lessonsOpened: "1" })).toBe(false);
  });
});
