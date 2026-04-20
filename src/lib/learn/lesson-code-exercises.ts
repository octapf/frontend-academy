import type { LessonLang } from "@/lib/content/get-lesson";
import type { ExerciseId } from "@/exercises/ids";

export type LessonCodeExerciseMeta = {
  moduleSlug: string;
  lessonSlug: string;
  /** Segmento de URL bajo `/exercise/[exerciseId]`. */
  exerciseId: string;
  title: Record<LessonLang, string>;
  description: Record<LessonLang, string>;
  cta: Record<LessonLang, string>;
};

/** Segundo lote de lecciones: mismo ejercicio puede anclar varias lecciones temáticas. */
const BATCH2_CODE_HOSTS: ReadonlyArray<{
  moduleSlug: string;
  lessonSlug: string;
  exerciseId: ExerciseId;
}> = [
  { moduleSlug: "react", lessonSlug: "aria-live-regions", exerciseId: "ts-error-message" },
  { moduleSlug: "react", lessonSlug: "native-lazy-images", exerciseId: "ts-parse-pixel" },
  { moduleSlug: "react", lessonSlug: "svg-sprites-accessibility", exerciseId: "ts-classnames" },
  { moduleSlug: "react", lessonSlug: "micro-interactions-css", exerciseId: "ts-clamp" },
  { moduleSlug: "react", lessonSlug: "drag-drop-a11y-basics", exerciseId: "ts-unique" },
  { moduleSlug: "react", lessonSlug: "focus-management-routing", exerciseId: "ts-parse-number" },
  { moduleSlug: "react", lessonSlug: "loading-skeleton-patterns", exerciseId: "ts-clamp" },
  { moduleSlug: "react", lessonSlug: "empty-states-ux", exerciseId: "ts-error-message" },
  { moduleSlug: "react", lessonSlug: "toast-patterns-a11y", exerciseId: "ts-invariant" },
  { moduleSlug: "react", lessonSlug: "breadcrumb-a11y", exerciseId: "ts-classnames" },
  { moduleSlug: "react", lessonSlug: "pagination-a11y", exerciseId: "ts-parse-number" },
  { moduleSlug: "react", lessonSlug: "infinite-scroll-tradeoffs", exerciseId: "ts-group-by" },
  { moduleSlug: "react", lessonSlug: "memo-event-handlers", exerciseId: "ts-shallow-equal" },
  { moduleSlug: "react", lessonSlug: "tabs-pattern-controlled", exerciseId: "ts-unique" },
  { moduleSlug: "react", lessonSlug: "radio-group-a11y", exerciseId: "ts-positive" },
  { moduleSlug: "typescript", lessonSlug: "exhaustiveness-checking", exerciseId: "ts-assert-never" },
  { moduleSlug: "typescript", lessonSlug: "type-predicates-vs-assertions", exerciseId: "ts-positive" },
  { moduleSlug: "typescript", lessonSlug: "tuple-rest-parameters", exerciseId: "ts-pick-keys" },
  { moduleSlug: "typescript", lessonSlug: "jsdoc-public-api", exerciseId: "ts-user-label" },
  { moduleSlug: "typescript", lessonSlug: "void-vs-undefined-returns", exerciseId: "ts-strict-int" },
  { moduleSlug: "typescript", lessonSlug: "const-assertion-literal-inference", exerciseId: "ts-pick-keys" },
  { moduleSlug: "typescript", lessonSlug: "non-null-assertion-caution", exerciseId: "ts-positive" },
  { moduleSlug: "typescript", lessonSlug: "double-assertion-caution", exerciseId: "ts-safe-json-parse" },
  { moduleSlug: "typescript", lessonSlug: "module-augmentation-intro", exerciseId: "ts-user-label" },
  { moduleSlug: "typescript", lessonSlug: "esm-cjs-interop", exerciseId: "ts-safe-json-parse" },
  { moduleSlug: "typescript", lessonSlug: "zod-runtime-validation-intro", exerciseId: "ts-safe-json-parse" },
  { moduleSlug: "typescript", lessonSlug: "opaque-branded-strings", exerciseId: "ts-user-label" },
  { moduleSlug: "testing", lessonSlug: "bdd-gherkin-skeptic", exerciseId: "ts-invariant" },
  { moduleSlug: "testing", lessonSlug: "filesystem-test-isolation", exerciseId: "ts-unique" },
  { moduleSlug: "testing", lessonSlug: "mutation-testing-intro", exerciseId: "ts-invariant" },
  { moduleSlug: "testing", lessonSlug: "approval-testing-intro", exerciseId: "ts-shape-area" },
  { moduleSlug: "testing", lessonSlug: "test-tags-ci-splits", exerciseId: "ts-group-by" },
  { moduleSlug: "testing", lessonSlug: "shrinking-flaky-suite", exerciseId: "ts-backoff" },
  { moduleSlug: "testing", lessonSlug: "storybook-contract-intro", exerciseId: "ts-classnames" },
  { moduleSlug: "testing", lessonSlug: "perf-budget-ci-intro", exerciseId: "ts-parse-pixel" },
  { moduleSlug: "styles", lessonSlug: "subgrid-basics", exerciseId: "ts-parse-pixel" },
  { moduleSlug: "styles", lessonSlug: "anchor-positioning-intro", exerciseId: "ts-parse-pixel" },
  { moduleSlug: "styles", lessonSlug: "isolation-stacking-context", exerciseId: "ts-parse-pixel" },
  { moduleSlug: "styles", lessonSlug: "scrollbar-styling-basics", exerciseId: "ts-classnames" },
  { moduleSlug: "styles", lessonSlug: "font-display-strategies", exerciseId: "ts-to-title-case" },
  { moduleSlug: "styles", lessonSlug: "image-set-responsive", exerciseId: "ts-parse-pixel" },
  { moduleSlug: "styles", lessonSlug: "aspect-ratio-layouts", exerciseId: "ts-clamp" },
  { moduleSlug: "styles", lessonSlug: "safe-area-insets", exerciseId: "ts-parse-pixel" },
  { moduleSlug: "architecture", lessonSlug: "sticky-sessions-load-balancing", exerciseId: "ts-resolve-flag" },
  { moduleSlug: "architecture", lessonSlug: "rate-limiting-from-frontend-view", exerciseId: "ts-backoff" },
  { moduleSlug: "architecture", lessonSlug: "secrets-env-frontend", exerciseId: "ts-error-message" },
  { moduleSlug: "architecture", lessonSlug: "blue-green-deployments", exerciseId: "ts-resolve-flag" },
  { moduleSlug: "architecture", lessonSlug: "db-migrations-frontend-impact", exerciseId: "ts-safe-json-parse" },
  { moduleSlug: "vocab", lessonSlug: "estimation-terms-en-es", exerciseId: "ts-greeting" },
  { moduleSlug: "vocab", lessonSlug: "retro-meeting-phrases", exerciseId: "ts-greeting" },
];

const batch2LessonCodeMeta = (): LessonCodeExerciseMeta[] =>
  BATCH2_CODE_HOSTS.map((h) => ({
    moduleSlug: h.moduleSlug,
    lessonSlug: h.lessonSlug,
    exerciseId: h.exerciseId,
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Practicá TypeScript con validación en servidor.",
      en: "Practice TypeScript with server-side validation.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  }));

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
  {
    moduleSlug: "architecture",
    lessonSlug: "feature-flags",
    exerciseId: "ts-resolve-flag",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Leé `unknown` como flag booleano con default seguro.",
      en: "Read `unknown` as a boolean flag with a safe default.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "styles",
    lessonSlug: "box-model",
    exerciseId: "ts-parse-pixel",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Strings: validar y extraer valores `px` para layout.",
      en: "Strings: validate and extract `px` values for layout.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  {
    moduleSlug: "typescript",
    lessonSlug: "intro-types",
    exerciseId: "ts-strict-int",
    title: { es: "Ejercicio de código", en: "Code exercise" },
    description: {
      es: "Tipos y strings: entero estricto o `null`.",
      en: "Types and strings: strict integer or `null`.",
    },
    cta: { es: "Ir al ejercicio", en: "Open exercise" },
  },
  ...batch2LessonCodeMeta(),
];

export function lessonCodeExerciseFor(
  moduleSlug: string,
  lessonSlug: string,
): LessonCodeExerciseMeta | undefined {
  return LESSON_CODE_EXERCISES.find(
    (e) => e.moduleSlug === moduleSlug && e.lessonSlug === lessonSlug,
  );
}
