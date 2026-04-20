import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/Button";
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
          <Button asChild variant="primary">
            <TrackLink href="/login">Ingresar</TrackLink>
          </Button>
          <Button asChild variant="secondary">
            <TrackLink href="/register">Crear cuenta</TrackLink>
          </Button>
        </div>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          ¿Ya tenés sesión en otra pestaña?{" "}
          <Link
            href="/dashboard"
            className="font-medium text-zinc-800 underline decoration-brand/50 underline-offset-4 hover:text-brand dark:text-zinc-200 dark:hover:text-brand"
          >
            Ir al dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
