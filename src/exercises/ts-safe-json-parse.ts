import type { TsExercise } from "@/exercises/types";

export const tsSafeJsonParseExercise: TsExercise = {
  id: "ts-safe-json-parse",
  kind: "typescript",
  title: {
    es: "JSON.parse seguro",
    en: "Safe JSON.parse",
  },
  description: {
    es: "Implementá `safeJsonParse` que devuelve `null` si no se puede parsear JSON.",
    en: "Implement `safeJsonParse` that returns `null` when JSON is invalid.",
  },
  hints: [
    {
      es: "Usá try/catch alrededor de `JSON.parse`.",
      en: "Wrap `JSON.parse` in try/catch.",
    },
    {
      es: "Si el valor parseado no es objeto, igual devolvelo (si es válido).",
      en: "If parsing succeeds, return the value even if it’s not an object.",
    },
  ],
  starter: `function safeJsonParse(input: string): unknown | null {
  return null;
}
`,
};

