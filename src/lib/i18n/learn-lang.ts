import type { LessonLang } from "@/lib/content/get-lesson";

export function parseLearnLang(
  value: string | string[] | null | undefined,
): LessonLang {
  if (value === "en") return "en";
  return "es";
}

/** Ajusta `lang` en query; en español se elimina el param para URLs más limpias. */
export function applyLearnLangToSearchParams(
  params: URLSearchParams,
  lang: LessonLang,
) {
  if (lang === "en") params.set("lang", "en");
  else params.delete("lang");
}

/** Sufijo para concatenar a un path sin query, p.ej. `?lang=en` o ``. */
export function learnLangSearchSuffix(lang: LessonLang): string {
  return lang === "en" ? "?lang=en" : "";
}
