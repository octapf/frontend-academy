import type { TsExercise } from "@/exercises/types";

export const tsToTitleCaseExercise: TsExercise = {
  id: "ts-to-title-case",
  kind: "typescript",
  title: {
    es: "Title Case",
    en: "Title Case",
  },
  description: {
    es: "Implementá `toTitleCase` para capitalizar palabras (manejar espacios múltiples).",
    en: "Implement `toTitleCase` to capitalize words (handle multiple spaces).",
  },
  hints: [
    {
      es: "Dividí por espacios, filtrá vacíos, capitalizá primera letra.",
      en: "Split by spaces, filter empties, capitalize first letter.",
    },
    {
      es: "Devolvé palabras separadas por un solo espacio.",
      en: "Return words separated by a single space.",
    },
  ],
  starter: `function toTitleCase(input: string): string {
  return "";
}
`,
};

