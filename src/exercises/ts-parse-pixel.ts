import type { TsExercise } from "@/exercises/types";

export const tsParsePixelExercise: TsExercise = {
  id: "ts-parse-pixel",
  kind: "typescript",
  title: {
    es: "Parsear longitudes CSS `px`",
    en: "Parse CSS `px` lengths",
  },
  description: {
    es: "Implementá `parseCssPixel(value)` que devuelve el número si el string es `<número>px` (opcional signo, decimales permitidos) o `null` si no matchea.",
    en: "Implement `parseCssPixel(value)` returning the number if the string matches `<number>px` (optional sign, decimals allowed), otherwise `null`.",
  },
  hints: [
    {
      es: "Podés usar una regex tipo `^-?\\d+(\\.\\d+)?px$` (case-insensitive para `px`).",
      en: "You can use a regex like `^-?\\d+(\\.\\d+)?px$` (case-insensitive for `px`).",
    },
    {
      es: "Recordá `trim()` y convertir el grupo numérico con `Number(...)`.",
      en: "Remember `trim()` and convert the numeric capture with `Number(...)`.",
    },
  ],
  starter: `function parseCssPixel(value: string): number | null {
  return null;
}
`,
};
