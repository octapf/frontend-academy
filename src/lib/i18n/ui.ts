import type { LessonLang } from "@/lib/content/get-lesson";

export type UiLang = LessonLang;

export function t<T>(lang: UiLang, msg: { es: T; en: T }): T {
  return lang === "en" ? msg.en : msg.es;
}

