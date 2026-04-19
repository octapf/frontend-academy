import Link from "next/link";
import { redirect } from "next/navigation";

import { TrackLink } from "@/components/track/TrackLink";
import { getSession } from "@/lib/auth/session";

export default async function HomePage() {
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
            Lecciones, práctica y progreso
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            Contenido por módulos (React, TypeScript, estilos, testing, arquitectura),
            referencia y ejercicios con validación en servidor. Iniciá sesión para
            guardar tu avance.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <TrackLink
            href="/login"
            className="inline-flex justify-center rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white outline-none transition-colors hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:focus-visible:ring-zinc-500"
          >
            Ingresar
          </TrackLink>
          <TrackLink
            href="/register"
            className="inline-flex justify-center rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 outline-none transition-colors hover:bg-zinc-900/5 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-100/10 dark:focus-visible:ring-zinc-500"
          >
            Crear cuenta
          </TrackLink>
        </div>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          ¿Ya tenés sesión en otra pestaña?{" "}
          <Link
            href="/dashboard"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline dark:text-zinc-200"
          >
            Ir al dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
