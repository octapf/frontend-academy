import type { TsExercise } from "@/exercises/types";

export const tsParseNumberExercise: TsExercise = {
  id: "ts-parse-number",
  kind: "typescript",
  title: {
    es: "Parsear número (forms)",
    en: "Parse number (forms)",
  },
  description: {
    es: "Implementá `parseNumber` que devuelve `null` si el input no es un número válido.",
    en: "Implement `parseNumber` returning `null` when input is not a valid number.",
  },
  hints: [
    {
      es: "Hacé `trim()`; si queda vacío devolvé `null`.",
      en: "Use `trim()`; if empty return `null`.",
    },
    {
      es: "Usá `Number()` y chequeá `Number.isFinite`.",
      en: "Use `Number()` and check `Number.isFinite`.",
    },
  ],
  starter: `function parseNumber(input: string): number | null {
  return null;
}
`,
};

