import type { TsExercise } from "@/exercises/types";

export const tsBackoffExercise: TsExercise = {
  id: "ts-backoff",
  kind: "typescript",
  title: {
    es: "Backoff exponencial",
    en: "Exponential backoff",
  },
  description: {
    es: "Implementá `backoffDelays(baseMs, factor, attempts)` que devuelve delays en ms.",
    en: "Implement `backoffDelays(baseMs, factor, attempts)` returning delays in ms.",
  },
  hints: [
    {
      es: "Si `attempts` es 0, devolvé `[]`.",
      en: "If `attempts` is 0, return `[]`.",
    },
    {
      es: "Delay i: `baseMs * factor^i` para i desde 0..attempts-1.",
      en: "Delay i: `baseMs * factor^i` for i from 0..attempts-1.",
    },
  ],
  starter: `function backoffDelays(baseMs: number, factor: number, attempts: number): number[] {
  return [];
}
`,
};

