import type { LessonLang } from "@/lib/content/get-lesson";

export function parseLearnLang(
  value: string | string[] | null | undefined,
): LessonLang {
  const v = Array.isArray(value) ? value[0] : value;
  if (v === "en") return "en";
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

/**
 * Añade `lang=en` a la query cuando el idioma preferido es inglés.
 * Si el path ya tiene query, fusiona parámetros (Track u otros).
 */
export function withLearnLang(path: string, lang: LessonLang): string {
  if (lang === "es") return path;
  const [p, query] = path.split("?");
  const params = new URLSearchParams(query ?? "");
  params.set("lang", "en");
  return `${p}?${params.toString()}`;
}
