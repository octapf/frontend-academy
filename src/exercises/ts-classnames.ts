import type { TsExercise } from "@/exercises/types";

export const tsClassnamesExercise: TsExercise = {
  id: "ts-classnames",
  kind: "typescript",
  title: {
    es: "classnames (join condicional)",
    en: "classnames (conditional join)",
  },
  description: {
    es: "Implementá `cn(...values)` que une strings ignorando falsy (similar a la util de la app).",
    en: "Implement `cn(...values)` to join strings ignoring falsy values.",
  },
  hints: [
    {
      es: "Tip: `values.filter(Boolean).join(' ')`.",
      en: "Tip: `values.filter(Boolean).join(' ')`.",
    },
  ],
  starter: `function cn(...values: Array<string | false | null | undefined>): string {
  return "";
}
`,
};

