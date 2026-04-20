import type { TsExercise } from "@/exercises/types";

export const tsInvariantExercise: TsExercise = {
  id: "ts-invariant",
  kind: "typescript",
  title: {
    es: "Invariant (assert + throw)",
    en: "Invariant (assert + throw)",
  },
  description: {
    es: "Implementá `invariant` que tira error si la condición no se cumple.",
    en: "Implement `invariant` that throws when the condition is false.",
  },
  hints: [
    {
      es: "Si `condition` es falsy, tirá `new Error(message)`.",
      en: "If `condition` is falsy, throw `new Error(message)`.",
    },
    {
      es: "En TS podés usar `asserts condition` para narrowing.",
      en: "In TS you can use `asserts condition` for narrowing.",
    },
  ],
  starter: `function invariant(condition: unknown, message: string): asserts condition {
  // TODO
}
`,
};

