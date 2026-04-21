import { redirect } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { TrackSelector } from "@/components/app-shell/TrackSelector";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LearnLanguageNav } from "@/components/app-shell/LearnLanguageNav";
import { PasswordChangeForm } from "@/components/auth/PasswordChangeForm";
import { getSession } from "@/lib/auth/session";
import { parseLearnLang } from "@/lib/i18n/learn-lang";
import { t } from "@/lib/i18n/ui";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const lang = parseLearnLang(sp.lang);
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/settings");
  }
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t(lang, { es: "Ajustes", en: "Settings" })}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {t(lang, {
            es: "Preferencias rápidas de la app.",
            en: "Quick app preferences.",
          })}
        </p>
      </div>

      <section className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-sm font-medium">{t(lang, { es: "Tema", en: "Theme" })}</div>
        <div className="mt-2 flex items-center gap-3">
          <ThemeToggle />
          <span className="text-sm text-zinc-600 dark:text-zinc-300">
            {t(lang, { es: "Cambiá entre claro/oscuro.", en: "Toggle light/dark." })}
          </span>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-sm font-medium">{t(lang, { es: "Track", en: "Track" })}</div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {t(lang, {
            es: "Define el nivel para filtrar contenido.",
            en: "Choose a level to filter content.",
          })}
        </p>
        <div className="mt-3">
          <TrackSelector />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-sm font-medium">{t(lang, { es: "Idioma", en: "Language" })}</div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {t(lang, {
            es: "Podés alternar ES/EN para el contenido y la UI.",
            en: "You can switch ES/EN for content and UI.",
          })}
        </p>
        <div className="mt-3">
          <LearnLanguageNav />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-sm font-medium">{t(lang, { es: "Contraseña", en: "Password" })}</div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {t(lang, {
            es: "Cambiá la contraseña de tu cuenta (sesión iniciada). No incluye recuperación por email.",
            en: "Change your account password (signed-in). No password recovery email yet.",
          })}
        </p>
        <div className="mt-3 max-w-md">
          <PasswordChangeForm />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-sm font-medium">{t(lang, { es: "Sesión", en: "Session" })}</div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {t(lang, {
            es: "Cerrá sesión si estás usando un dispositivo compartido.",
            en: "Sign out if you are using a shared device.",
          })}
        </p>
        <form action="/api/auth/logout" method="post" className="mt-3">
          <Button variant="secondary" size="sm" type="submit">
            {t(lang, { es: "Salir", en: "Logout" })}
          </Button>
        </form>
      </section>
    </div>
  );
}

