import {
  exerciseIdForLesson,
  exerciseIdsInModule,
} from "@/lib/exercises/exercise-lesson-map";

describe("exerciseIdsInModule", () => {
  it("lists exercises hosted in the module", () => {
    expect(exerciseIdsInModule("react").sort()).toEqual([
      "ts-assert-never",
      "ts-clamp",
      "ts-classnames",
      "ts-error-message",
      "ts-group-by",
      "ts-invariant",
      "ts-parse-number",
      "ts-parse-pixel",
      "ts-positive",
      "ts-shallow-equal",
      "ts-sum",
      "ts-unique",
    ]);
    expect(exerciseIdsInModule("typescript").sort()).toEqual([
      "ts-assert-never",
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
      "ts-clamp",
      "ts-classnames",
      "ts-parse-pixel",
      "ts-to-title-case",
    ]);
    expect(exerciseIdsInModule("testing").sort()).toEqual([
      "ts-backoff",
      "ts-classnames",
      "ts-group-by",
      "ts-invariant",
      "ts-parse-pixel",
      "ts-shape-area",
      "ts-unique",
    ]);
    expect(exerciseIdsInModule("architecture").sort()).toEqual([
      "ts-backoff",
      "ts-error-message",
      "ts-resolve-flag",
      "ts-safe-json-parse",
    ]);
    expect(exerciseIdsInModule("vocab").sort()).toEqual(["ts-greeting"]);
  });
});

describe("exerciseIdForLesson", () => {
  it("maps known lessons", () => {
    expect(exerciseIdForLesson("react", "hooks-basics")).toBe("ts-sum");
    expect(exerciseIdForLesson("typescript", "narrowing")).toBe("ts-positive");
    expect(exerciseIdForLesson("typescript", "string-templates")).toBe(
      "ts-greeting",
    );
    expect(exerciseIdForLesson("typescript", "utility-types")).toBe(
      "ts-user-label",
    );
    expect(exerciseIdForLesson("typescript", "exhaustiveness-checking")).toBe(
      "ts-assert-never",
    );
    expect(exerciseIdForLesson("vocab", "estimation-terms-en-es")).toBe(
      "ts-greeting",
    );
  });

  it("returns undefined when no exercise", () => {
    expect(exerciseIdForLesson("styles", "flex-basics")).toBeUndefined();
  });
});
