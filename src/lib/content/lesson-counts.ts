import { listLessonsForModule } from "@/lib/content/get-lesson";
import { LEARN_MODULES } from "@/lib/learn/modules";

/** Cantidad de lecciones por slug de módulo (solo módulos en `LEARN_MODULES`). */
export async function getLessonCountsByModule(): Promise<
  Record<string, number>
> {
  const pairs = await Promise.all(
    LEARN_MODULES.map(async (m) => {
      const lessons = await listLessonsForModule(m.slug);
      return [m.slug, lessons.length] as const;
    })
  );
  return Object.fromEntries(pairs);
}
