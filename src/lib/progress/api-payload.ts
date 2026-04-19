/** Cuerpo JSON de `GET /api/progress` cuando la sesión es válida. */
export type ProgressApiPayload = {
  ok: true;
  lessonsOpened: number;
  exercisesPassed: number;
  lastActivityIso: string | null;
  lessonKeys: string[];
  exerciseIds: string[];
};

export function isProgressApiPayload(
  value: unknown
): value is ProgressApiPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    v.ok === true &&
    typeof v.lessonsOpened === "number" &&
    typeof v.exercisesPassed === "number" &&
    Array.isArray(v.lessonKeys) &&
    Array.isArray(v.exerciseIds)
  );
}
