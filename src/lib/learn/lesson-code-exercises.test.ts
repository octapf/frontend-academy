import {
  LESSON_CODE_EXERCISES,
  lessonCodeExerciseFor,
} from "@/lib/learn/lesson-code-exercises";

describe("lessonCodeExerciseFor", () => {
  it("finds configured lessons", () => {
    const ex = lessonCodeExerciseFor("react", "hooks-basics");
    expect(ex?.exerciseId).toBe("ts-sum");
  });

  it("returns undefined for unknown pair", () => {
    expect(lessonCodeExerciseFor("react", "nope")).toBeUndefined();
  });

  it("lists all entries with unique module+lesson", () => {
    const keys = LESSON_CODE_EXERCISES.map(
      (e) => `${e.moduleSlug}/${e.lessonSlug}`,
    );
    expect(new Set(keys).size).toBe(keys.length);
  });
});
