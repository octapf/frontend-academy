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
  {
    moduleSlug: "react",
    lessonSlug: "state-and-props",
    exerciseId: "ts-clamp",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Función pura: clamp con tests en servidor.",
      en: "Pure function: clamp with server tests.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "react",
    lessonSlug: "lists-and-keys",
    exerciseId: "ts-unique",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Colecciones: uniqueBy con Set.",
      en: "Collections: uniqueBy with Set.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "styles",
    lessonSlug: "utility-classes",
    exerciseId: "ts-classnames",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Helpers: unir clases condicionales sin ruido.",
      en: "Helpers: join conditional classes cleanly.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "styles",
    lessonSlug: "typography-basics",
    exerciseId: "ts-to-title-case",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Strings: title case con reglas simples.",
      en: "Strings: title case with simple rules.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "testing",
    lessonSlug: "arrange-act-assert",
    exerciseId: "ts-invariant",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Assertion helper: invariant con tests en servidor.",
      en: "Assertion helper: invariant with server tests.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "testing",
    lessonSlug: "retry-backoff",
    exerciseId: "ts-backoff",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Backoff exponencial: delays determinísticos.",
      en: "Exponential backoff: deterministic delays.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "architecture",
    lessonSlug: "error-handling",
    exerciseId: "ts-error-message",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Normalizá unknown a string segura (observabilidad).",
      en: "Normalize unknown to a safe string (observability).",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "react",
    lessonSlug: "performance-memo",
    exerciseId: "ts-shallow-equal",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Memoización: comparador shallowEqual para props.",
      en: "Memoization: shallowEqual comparator for props.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "react",
    lessonSlug: "context-basics",
    exerciseId: "ts-assert-never",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Exhaustividad: helper assertNever.",
      en: "Exhaustiveness: assertNever helper.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "react",
    lessonSlug: "forms-and-validation",
    exerciseId: "ts-parse-number",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Forms: parseo seguro de números (inputs).",
      en: "Forms: safe number parsing (inputs).",
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
