import { parseTrackParam, trackLabel } from "@/lib/track";

describe("parseTrackParam", () => {
  it("parses valid ids", () => {
    expect(parseTrackParam("junior")).toBe("junior");
    expect(parseTrackParam("mid")).toBe("mid");
    expect(parseTrackParam("senior")).toBe("senior");
    expect(parseTrackParam("all")).toBe("all");
  });

  it("rejects invalid or empty", () => {
    expect(parseTrackParam("")).toBeNull();
    expect(parseTrackParam(null)).toBeNull();
    expect(parseTrackParam("nope")).toBeNull();
  });
});

describe("trackLabel", () => {
  it("maps ids to labels", () => {
    expect(trackLabel("junior")).toBe("Junior");
    expect(trackLabel("mid")).toBe("Mid");
    expect(trackLabel("senior")).toBe("Senior");
    expect(trackLabel("all")).toBe("All");
  });
});
