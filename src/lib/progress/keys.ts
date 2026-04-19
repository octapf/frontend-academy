/** Clave estable para una lección en el store de progreso. */
export function lessonProgressKey(
  moduleSlug: string,
  lessonSlug: string
): string {
  return `${moduleSlug}/${lessonSlug}`;
}
