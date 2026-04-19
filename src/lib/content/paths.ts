import path from "node:path";

export const CONTENT_LESSONS_DIR = path.join(
  process.cwd(),
  "content",
  "lessons"
);

export function lessonFilePath(
  moduleSlug: string,
  lessonSlug: string,
  lang: "es" | "en"
): string {
  return path.join(CONTENT_LESSONS_DIR, moduleSlug, lessonSlug, `${lang}.mdx`);
}
