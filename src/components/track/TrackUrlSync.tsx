"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { parseTrackParam } from "@/lib/track";
import { hrefWithTrack } from "@/lib/track/href";
import { useTrackStore } from "@/stores/useTrackStore";

function baseHref(pathname: string, queryString: string) {
  return queryString ? `${pathname}?${queryString}` : pathname;
}

/**
 * Tras la rehidratación de Zustand: completa `?track=` si falta y aplica URL → store.
 * Cuando cambia el store (p. ej. selector), actualiza la query.
 */
export function TrackUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const storeTrack = useTrackStore((s) => s.track);
  const setTrack = useTrackStore((s) => s.setTrack);
  const pushingRef = useRef(false);

  // URL → store + asegurar que exista `track` en la query
  useEffect(() => {
    const syncFromUrl = () => {
      if (!useTrackStore.persist.hasHydrated()) return;

      if (pushingRef.current) {
        pushingRef.current = false;
        return;
      }

      const urlTrack = parseTrackParam(searchParams.get("track"));
      const base = baseHref(pathname, queryString);

      if (!urlTrack) {
        pushingRef.current = true;
        router.replace(hrefWithTrack(base, useTrackStore.getState().track), {
          scroll: false,
        });
        return;
      }

      if (urlTrack !== useTrackStore.getState().track) {
        setTrack(urlTrack);
      }
    };

    if (useTrackStore.persist.hasHydrated()) {
      syncFromUrl();
      return;
    }

    return useTrackStore.persist.onFinishHydration(syncFromUrl);
  }, [pathname, queryString, router, searchParams, setTrack]);

  // store → URL
  useEffect(() => {
    if (!useTrackStore.persist.hasHydrated()) return;

    const urlTrack = parseTrackParam(searchParams.get("track"));
    if (!urlTrack) return;
    if (urlTrack === storeTrack) return;

    pushingRef.current = true;
    router.replace(hrefWithTrack(baseHref(pathname, queryString), storeTrack), {
      scroll: false,
    });
  }, [storeTrack, pathname, queryString, router, searchParams]);

  return null;
}
