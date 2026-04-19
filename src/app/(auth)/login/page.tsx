import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { authPageHref, sanitizeNextParam } from "@/lib/auth/next-redirect";
import { getSession } from "@/lib/auth/session";
import { hrefWithTrack } from "@/lib/track/href";
import { parseTrackParam } from "@/lib/track";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; track?: string | string[] }>;
}) {
  const sp = await searchParams;
  const rawNext = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  const next = sanitizeNextParam(rawNext);
  const rawTrack = Array.isArray(sp.track) ? sp.track[0] : sp.track;
  const trackFromUrl = parseTrackParam(rawTrack);

  const session = await getSession();
  if (session) {
    redirect(next ?? "/dashboard");
  }

  const registerBase = authPageHref("/register", next);
  const registerHref = trackFromUrl
    ? hrefWithTrack(registerBase, trackFromUrl)
    : registerBase;

  return (
    <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-zinc-950">
      <h1 className="text-xl font-semibold tracking-tight">Ingresar</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        Frontend Academy · usuario y contraseña
      </p>
      <div className="mt-6">
        <Suspense
          fallback={
            <div className="h-40 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
          }
        >
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-300">
        ¿No tenés cuenta?{" "}
        <Link
          href={registerHref}
          className="font-medium underline-offset-4 hover:underline"
        >
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}
