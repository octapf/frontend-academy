import type { TsExercise } from "@/exercises/types";

export const tsParseQueryExercise: TsExercise = {
  id: "ts-parse-query",
  kind: "typescript",
  title: {
    es: "Parsear query string",
    en: "Parse query string",
  },
  description: {
    es: "Implementá `parseQuery` para convertir `a=1&b=hola` en un objeto `{ a: \"1\", b: \"hola\" }`.",
    en: 'Implement `parseQuery` to turn `a=1&b=hello` into `{ a: "1", b: "hello" }`.',
  },
  hints: [
    {
      es: "Podés usar `new URLSearchParams(qs)`.",
      en: "You can use `new URLSearchParams(qs)`.",
    },
    {
      es: "Si hay keys repetidas, quedate con la última.",
      en: "If a key repeats, keep the last value.",
    },
  ],
  starter: `function parseQuery(qs: string): Record<string, string> {
  return {};
}
`,
};

