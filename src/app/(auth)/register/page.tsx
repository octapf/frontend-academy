import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { authPageHref, sanitizeNextParam } from "@/lib/auth/next-redirect";
import { getSession } from "@/lib/auth/session";
import { parseLearnLang } from "@/lib/i18n/learn-lang";
import { t } from "@/lib/i18n/ui";
import { hrefWithTrack } from "@/lib/track/href";
import { parseTrackParam } from "@/lib/track";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; track?: string | string[]; lang?: string | string[] }>;
}) {
  const sp = await searchParams;
  const rawNext = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  const next = sanitizeNextParam(rawNext);
  const rawTrack = Array.isArray(sp.track) ? sp.track[0] : sp.track;
  const trackFromUrl = parseTrackParam(rawTrack);
  const lang = parseLearnLang(sp.lang);

  const session = await getSession();
  if (session) {
    redirect(next ?? "/dashboard");
  }

  const loginBase = authPageHref("/login", next);
  const loginHref = trackFromUrl
    ? hrefWithTrack(loginBase, trackFromUrl)
    : loginBase;

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-100 p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
      <h1 className="text-xl font-semibold tracking-tight">
        {t(lang, { es: "Crear cuenta", en: "Create account" })}
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        {t(lang, {
          es: "Registro abierto · sin reset de contraseña (MVP)",
          en: "Open registration · no password reset yet (MVP)",
        })}
      </p>
      <div className="mt-6">
        <Suspense
          fallback={
            <div className="h-40 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-900" />
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-300">
        {t(lang, { es: "¿Ya tenés cuenta?", en: "Already have an account?" })}{" "}
        <Link
          href={loginHref + (lang === "en" ? (loginHref.includes("?") ? "&lang=en" : "?lang=en") : "")}
          className="font-medium underline-offset-4 hover:underline"
        >
          {t(lang, { es: "Ingresar", en: "Login" })}
        </Link>
      </p>
    </div>
  );
}
