import type { TsExercise } from "@/exercises/types";

export const tsErrorMessageExercise: TsExercise = {
  id: "ts-error-message",
  kind: "typescript",
  title: {
    es: "Normalizar error a mensaje",
    en: "Normalize error to message",
  },
  description: {
    es: "Implementá `errorMessage(e)` para transformar `unknown` en string segura.",
    en: "Implement `errorMessage(e)` to turn `unknown` into a safe string.",
  },
  hints: [
    {
      es: "Si `e` es `Error`, usá `e.message`.",
      en: "If `e` is an `Error`, use `e.message`.",
    },
    {
      es: "Si `e` es string, devolvela.",
      en: "If `e` is a string, return it.",
    },
    {
      es: "Si no, devolvé un fallback como \"Unknown error\".",
      en: "Otherwise return a fallback like \"Unknown error\".",
    },
  ],
  starter: `function errorMessage(e: unknown): string {
  return "Unknown error";
}
`,
};

