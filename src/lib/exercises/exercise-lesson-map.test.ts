import {
  exerciseIdForLesson,
  exerciseIdsInModule,
} from "@/lib/exercises/exercise-lesson-map";

describe("exerciseIdsInModule", () => {
  it("lists exercises hosted in the module", () => {
    expect(exerciseIdsInModule("react").sort()).toEqual([
      "ts-assert-never",
      "ts-clamp",
      "ts-parse-number",
      "ts-shallow-equal",
      "ts-sum",
      "ts-unique",
    ]);
    expect(exerciseIdsInModule("typescript").sort()).toEqual([
      "ts-greeting",
      "ts-group-by",
      "ts-parse-query",
      "ts-pick-keys",
      "ts-positive",
      "ts-safe-json-parse",
      "ts-shape-area",
      "ts-strict-int",
      "ts-user-label",
    ]);
    expect(exerciseIdsInModule("styles").sort()).toEqual([
      "ts-classnames",
      "ts-parse-pixel",
      "ts-to-title-case",
    ]);
    expect(exerciseIdsInModule("testing").sort()).toEqual([
      "ts-backoff",
      "ts-invariant",
    ]);
    expect(exerciseIdsInModule("architecture").sort()).toEqual([
      "ts-error-message",
      "ts-resolve-flag",
    ]);
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
    expect(exerciseIdForLesson("styles", "flex-basics")).toBeUndefined();
  });
});
