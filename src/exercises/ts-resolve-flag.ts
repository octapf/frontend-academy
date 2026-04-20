import type { TsExercise } from "@/exercises/types";

export const tsResolveFlagExercise: TsExercise = {
  id: "ts-resolve-flag",
  kind: "typescript",
  title: {
    es: "Flags: unknown → boolean",
    en: "Flags: unknown to boolean",
  },
  description: {
    es: "Implementá `resolveFeatureEnabled(flag, defaultValue)` para leer valores típicos de config (boolean, strings comunes) y caer al default cuando no aplica.",
    en: "Implement `resolveFeatureEnabled(flag, defaultValue)` to read typical config values (boolean, common strings) and fall back to the default when unknown.",
  },
  hints: [
    {
      es: "Si `flag` es `null` o `undefined`, devolvé `defaultValue`.",
      en: "If `flag` is `null` or `undefined`, return `defaultValue`.",
    },
    {
      es: "Para strings, normalizá con `trim()` + `toLowerCase()` y tratá `true`, `1`, `yes`, `on` como verdadero; `false`, `0`, `no`, `off` como falso.",
      en: "For strings, normalize with `trim()` + `toLowerCase()` and treat `true`, `1`, `yes`, `on` as true; `false`, `0`, `no`, `off` as false.",
    },
    {
      es: "Cualquier otro tipo o string no reconocido → `defaultValue`.",
      en: "Any other type or unrecognized string → `defaultValue`.",
    },
  ],
  starter: `function resolveFeatureEnabled(flag: unknown, defaultValue: boolean): boolean {
  return defaultValue;
}
`,
};
