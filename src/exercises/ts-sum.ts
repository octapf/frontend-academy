import type { TsExercise } from "@/exercises/types";

export const tsSumExercise: TsExercise = {
  id: "ts-sum",
  kind: "typescript",
  title: {
    es: "Suma de dos números",
    en: "Sum two numbers",
  },
  description: {
    es: "Implementá la función `sum` que devuelve la suma de `a` y `b`.",
    en: "Implement `sum` so it returns the sum of `a` and `b`.",
  },
  starter: `function sum(a: number, b: number): number {
  return 0;
}`,
};
