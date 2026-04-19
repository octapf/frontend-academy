import {
  exerciseIdForLesson,
  exerciseIdsInModule,
} from "@/lib/exercises/exercise-lesson-map";

describe("exerciseIdsInModule", () => {
  it("lists exercises hosted in the module", () => {
    expect(exerciseIdsInModule("react")).toEqual(["ts-sum"]);
    expect(exerciseIdsInModule("typescript").sort()).toEqual([
      "ts-greeting",
      "ts-positive",
      "ts-user-label",
    ]);
    expect(exerciseIdsInModule("styles")).toEqual([]);
  });
});

describe("exerciseIdForLesson", () => {
  it("maps known lessons", () => {
    expect(exerciseIdForLesson("react", "hooks-basics")).toBe("ts-sum");
    expect(exerciseIdForLesson("typescript", "narrowing")).toBe("ts-positive");
    expect(exerciseIdForLesson("typescript", "string-templates")).toBe(
      "ts-greeting"
    );
    expect(exerciseIdForLesson("typescript", "utility-types")).toBe(
      "ts-user-label"
    );
  });

  it("returns undefined when no exercise", () => {
    expect(exerciseIdForLesson("styles", "box-model")).toBeUndefined();
  });
});
