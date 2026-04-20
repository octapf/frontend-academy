import type { TsExercise } from "@/exercises/types";

export const tsShallowEqualExercise: TsExercise = {
  id: "ts-shallow-equal",
  kind: "typescript",
  title: {
    es: "Shallow equal",
    en: "Shallow equal",
  },
  description: {
    es: "Implementá `shallowEqual(a, b)` para comparar objetos planos (mismas keys y valores).",
    en: "Implement `shallowEqual(a, b)` for flat objects (same keys and values).",
  },
  hints: [
    {
      es: "Si son el mismo objeto (`a === b`), es true.",
      en: "If they are the same reference (`a === b`), return true.",
    },
    {
      es: "Compará `Object.keys` y luego cada valor por `===`.",
      en: "Compare `Object.keys` and then each value with `===`.",
    },
  ],
  starter: `function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  return false;
}
`,
};

