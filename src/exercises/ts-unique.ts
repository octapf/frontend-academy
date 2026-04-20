import type { TsExercise } from "@/exercises/types";

export const tsUniqueExercise: TsExercise = {
  id: "ts-unique",
  kind: "typescript",
  title: {
    es: "Unique por key",
    en: "Unique by key",
  },
  description: {
    es: "Implementá `uniqueBy(items, key)` para devolver items únicos por key (mantener el primero).",
    en: "Implement `uniqueBy(items, key)` to return unique items by key (keep the first).",
  },
  hints: [
    {
      es: "Usá un `Set` para recordar keys vistas.",
      en: "Use a `Set` to track seen keys.",
    },
    {
      es: "La firma puede ser genérica `T` y `K` puede ser `string | number`.",
      en: "`T` can be generic and `K` can be `string | number`.",
    },
  ],
  starter: `function uniqueBy<T>(items: T[], key: (item: T) => string | number): T[] {
  return [];
}
`,
};

