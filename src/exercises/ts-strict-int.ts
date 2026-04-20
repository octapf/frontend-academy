import type { TsExercise } from "@/exercises/types";

export const tsStrictIntExercise: TsExercise = {
  id: "ts-strict-int",
  kind: "typescript",
  title: {
    es: "Entero estricto desde string",
    en: "Strict integer from string",
  },
  description: {
    es: "Implementá `parseStrictInt(value)`: si el string (tras `trim`) es un entero decimal con signo opcional (`-?\\d+`), devolvé el número; si hay decimales u otra basura, devolvé `null`.",
    en: "Implement `parseStrictInt(value)`: if the string (after `trim`) is a signed decimal integer (`-?\\d+`), return the number; if there are decimals or junk, return `null`.",
  },
  hints: [
    {
      es: "Prohibí puntos y notación científica: solo dígitos con `-` opcional al inicio.",
      en: "Disallow dots and scientific notation: only digits with an optional leading `-`.",
    },
    {
      es: "Podés validar con `^...$` y luego `Number(...)` o parseInt con chequeo extra.",
      en: "You can validate with `^...$` then `Number(...)`, or `parseInt` with extra checks.",
    },
  ],
  starter: `function parseStrictInt(value: string): number | null {
  return null;
}
`,
};
