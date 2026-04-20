import type { TsExercise } from "@/exercises/types";

export const tsClampExercise: TsExercise = {
  id: "ts-clamp",
  kind: "typescript",
  title: {
    es: "Clamp de números",
    en: "Clamp numbers",
  },
  description: {
    es: "Implementá `clamp(n, min, max)` para acotar un número al rango.",
    en: "Implement `clamp(n, min, max)` to clamp a number to a range.",
  },
  hints: [
    {
      es: "Caso simple: si `n < min` devolvé `min`, si `n > max` devolvé `max`.",
      en: "Simple case: if `n < min` return `min`, if `n > max` return `max`.",
    },
    {
      es: "Tip: podés usar `Math.min(max, Math.max(min, n))`.",
      en: "Tip: `Math.min(max, Math.max(min, n))` works well.",
    },
  ],
  starter: `function clamp(n: number, min: number, max: number): number {
  return 0;
}
`,
};

