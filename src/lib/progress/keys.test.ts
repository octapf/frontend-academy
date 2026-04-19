import { lessonProgressKey } from "@/lib/progress/keys";

describe("lessonProgressKey", () => {
  it("joins module and lesson", () => {
    expect(lessonProgressKey("react", "intro-components")).toBe(
      "react/intro-components"
    );
  });
});
