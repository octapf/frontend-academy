"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { parseLearnLang } from "@/lib/i18n/learn-lang";
import { hrefWithTrack } from "@/lib/track/href";
import { useLearnLangStore } from "@/stores/useLearnLangStore";
import { useTrackStore } from "@/stores/useTrackStore";

function baseHref(pathname: string, queryString: string) {
  return queryString ? `${pathname}?${queryString}` : pathname;
}

/**
 * Si la preferencia guardada es EN y la URL de Learn no trae `lang=en`, normaliza la query
 * (preserva `track` y demás) sin scroll, tras rehidratar la store.
 */
export function LearnLangUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pushingRef = useRef(false);

  useEffect(() => {
    const run = () => {
      if (!useLearnLangStore.persist.hasHydrated()) return;
      if (!pathname.startsWith("/learn")) return;

      if (pushingRef.current) {
        pushingRef.current = false;
        return;
      }

      const pref = useLearnLangStore.getState().lang;
      if (pref !== "en") return;

      const fromUrl = parseLearnLang(searchParams.get("lang"));
      if (fromUrl === "en") return;

      const params = new URLSearchParams(searchParams.toString());
      params.set("lang", "en");
      const q = params.toString();
      const base = baseHref(pathname, q);
      pushingRef.current = true;
      router.replace(hrefWithTrack(base, useTrackStore.getState().track), {
        scroll: false,
      });
    };

    if (useLearnLangStore.persist.hasHydrated()) {
      run();
      return;
    }

    return useLearnLangStore.persist.onFinishHydration(run);
  }, [pathname, router, searchParams]);

  return null;
}
