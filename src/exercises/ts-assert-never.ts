import type { TsExercise } from "@/exercises/types";

export const tsAssertNeverExercise: TsExercise = {
  id: "ts-assert-never",
  kind: "typescript",
  title: {
    es: "assertNever (exhaustividad)",
    en: "assertNever (exhaustiveness)",
  },
  description: {
    es: "Implementá `assertNever(x)` para forzar exhaustividad en switches.",
    en: "Implement `assertNever(x)` to enforce exhaustiveness in switches.",
  },
  hints: [
    {
      es: "La firma típica: `(x: never): never` y tirar un Error.",
      en: "Typical signature: `(x: never): never` and throw an Error.",
    },
  ],
  starter: `function assertNever(x: never): never {
  throw new Error("Unexpected value");
}
`,
};

