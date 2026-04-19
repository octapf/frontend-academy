"use client";

import type { ReactNode } from "react";

import { TrackLink } from "@/components/track/TrackLink";
import { withLearnLang } from "@/lib/i18n/learn-lang";
import { useLearnLangStore } from "@/stores/useLearnLangStore";

/**
 * Enlace a rutas Learn con `?lang=en` según preferencia persistida (sidebar, referencia, etc.).
 */
export function LearnEntryLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const lang = useLearnLangStore((s) => s.lang);
  return (
    <TrackLink href={withLearnLang(href, lang)} className={className}>
      {children}
    </TrackLink>
  );
}
