import type { LessonLang } from "@/lib/content/get-lesson";

export type LessonCodeExerciseMeta = {
  moduleSlug: string;
  lessonSlug: string;
  /** Segmento de URL bajo `/exercise/[exerciseId]`. */
  exerciseId: string;
  title: Record<LessonLang, string>;
  description: Record<LessonLang, string>;
  cta: Record<LessonLang, string>;
};

export const LESSON_CODE_EXERCISES: LessonCodeExerciseMeta[] = [
  {
    moduleSlug: "react",
    lessonSlug: "hooks-basics",
    exerciseId: "ts-sum",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Practicá TypeScript con validación en servidor.",
      en: "Practice TypeScript with server-side validation.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "typescript",
    lessonSlug: "narrowing",
    exerciseId: "ts-positive",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Implementá un type predicate con validación en servidor.",
      en: "Implement a type predicate with server-side validation.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "typescript",
    lessonSlug: "string-templates",
    exerciseId: "ts-greeting",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Template strings: formato exacto con tests en servidor.",
      en: "Template strings: exact format with server tests.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "typescript",
    lessonSlug: "utility-types",
    exerciseId: "ts-user-label",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "`Pick` en el parámetro: formato de etiqueta exacto con tests en servidor.",
      en: "`Pick` on a parameter: exact label format with server tests.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "typescript",
    lessonSlug: "generics-pick",
    exerciseId: "ts-pick-keys",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Genéricos: quedate con keys específicas sin perder tipos.",
      en: "Generics: keep selected keys without losing types.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "typescript",
    lessonSlug: "discriminated-unions",
    exerciseId: "ts-shape-area",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Discriminated unions: switch exhaustivo con tests.",
      en: "Discriminated unions: exhaustive switch with tests.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "typescript",
    lessonSlug: "url-search-params",
    exerciseId: "ts-parse-query",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Parseo de query string con reglas simples.",
      en: "Parse a query string with simple rules.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "typescript",
    lessonSlug: "array-reduce",
    exerciseId: "ts-group-by",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Agrupación por key usando reduce/loops.",
      en: "Group by key using reduce/loops.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "typescript",
    lessonSlug: "json-parse",
    exerciseId: "ts-safe-json-parse",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Manejo de errores: parseo seguro de JSON.",
      en: "Error handling: safe JSON parsing.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
];

export function lessonCodeExerciseFor(
  moduleSlug: string,
  lessonSlug: string,
): LessonCodeExerciseMeta | undefined {
  return LESSON_CODE_EXERCISES.find(
    (e) => e.moduleSlug === moduleSlug && e.lessonSlug === lessonSlug,
  );
}
