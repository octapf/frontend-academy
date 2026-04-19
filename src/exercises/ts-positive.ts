import type { TsExercise } from "@/exercises/types";

export const tsPositiveExercise: TsExercise = {
  id: "ts-positive",
  kind: "typescript",
  title: {
    es: "Type predicate: números positivos",
    en: "Type predicate: positive numbers",
  },
  description: {
    es: "Implementá `isPositive` como type predicate (`n is number`) que devuelve `true` solo para números > 0.",
    en: "Implement `isPositive` as a type predicate (`n is number`) that returns `true` only for numbers > 0.",
  },
  starter: `function isPositive(n: unknown): n is number {
  return false;
}`,
};
