import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { TrackLink } from "@/components/track/TrackLink";
import { getSession } from "@/lib/auth/session";
import { parseLearnLang } from "@/lib/i18n/learn-lang";
import { t } from "@/lib/i18n/ui";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const lang = parseLearnLang(sp.lang);
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-dvh bg-background px-4 py-16 text-foreground">
      <div className="mx-auto max-w-lg space-y-8">
        <div className="space-y-3 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Frontend Academy
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t(lang, { es: "Lecciones, práctica y progreso", en: "Lessons, practice, and progress" })}
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {t(lang, {
              es: "Contenido por módulos, referencia y ejercicios con validación en servidor. Iniciá sesión para guardar tu avance.",
              en: "Module-based content, reference, and server-validated exercises. Log in to save your progress.",
            })}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="primary">
            <TrackLink href="/login">{t(lang, { es: "Ingresar", en: "Login" })}</TrackLink>
          </Button>
          <Button asChild variant="secondary">
            <TrackLink href="/register">{t(lang, { es: "Crear cuenta", en: "Create account" })}</TrackLink>
          </Button>
        </div>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          {t(lang, { es: "¿Ya tenés sesión en otra pestaña?", en: "Already signed in in another tab?" })}{" "}
          <Link
            href={`/dashboard${lang === "en" ? "?lang=en" : ""}`}
            className="font-medium text-zinc-800 underline decoration-brand/50 underline-offset-4 hover:text-brand dark:text-zinc-200 dark:hover:text-brand"
          >
            {t(lang, { es: "Ir al panel", en: "Go to dashboard" })}
          </Link>
        </p>
      </div>
    </div>
  );
}
