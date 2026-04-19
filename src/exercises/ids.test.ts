import { zExerciseId } from "@/exercises/ids";

describe("zExerciseId", () => {
  it("accepts known ids", () => {
    expect(zExerciseId.safeParse("ts-sum").success).toBe(true);
    expect(zExerciseId.safeParse("ts-user-label").success).toBe(true);
  });

  it("rejects unknown ids", () => {
    expect(zExerciseId.safeParse("ts-unknown").success).toBe(false);
    expect(zExerciseId.safeParse("").success).toBe(false);
  });
});
