import type { TsExercise } from "@/exercises/types";

export const tsGroupByExercise: TsExercise = {
  id: "ts-group-by",
  kind: "typescript",
  title: {
    es: "GroupBy (reduce)",
    en: "GroupBy (reduce)",
  },
  description: {
    es: "Implementá `groupBy` para agrupar items por una key calculada.",
    en: "Implement `groupBy` to group items by a computed key.",
  },
  hints: [
    {
      es: "Un `Record<string, T[]>` alcanza para el output.",
      en: "A `Record<string, T[]>` is enough for the output.",
    },
    {
      es: "Usá `out[k] ??= []` y pusheá.",
      en: "Use `out[k] ??= []` and push.",
    },
  ],
  starter: `function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return {};
}
`,
};

