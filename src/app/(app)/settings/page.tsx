import { redirect } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { TrackSelector } from "@/components/app-shell/TrackSelector";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LearnLanguageNav } from "@/components/app-shell/LearnLanguageNav";
import { getSession } from "@/lib/auth/session";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/settings");
  }
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Preferencias rápidas de la app.
        </p>
      </div>

      <section className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-sm font-medium">Theme</div>
        <div className="mt-2 flex items-center gap-3">
          <ThemeToggle />
          <span className="text-sm text-zinc-600 dark:text-zinc-300">
            Cambiá entre claro/oscuro.
          </span>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-sm font-medium">Track</div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Define el nivel para filtrar contenido.
        </p>
        <div className="mt-3">
          <TrackSelector />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-sm font-medium">Learn language</div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          En páginas de Learn podés alternar ES/EN.
        </p>
        <div className="mt-3">
          <LearnLanguageNav />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-300 bg-zinc-100 p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-sm font-medium">Session</div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Cerrá sesión si estás usando un dispositivo compartido.
        </p>
        <form action="/api/auth/logout" method="post" className="mt-3">
          <Button variant="secondary" size="sm" type="submit">
            Logout
          </Button>
        </form>
      </section>
    </div>
  );
}

