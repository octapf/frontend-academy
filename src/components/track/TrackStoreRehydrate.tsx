"use client";

import { useEffect } from "react";

import { useTrackStore } from "@/stores/useTrackStore";

/**
 * Con `persist({ skipHydration: true })`, el estado persistido no se aplica
 * hasta llamar a `rehydrate()` en el cliente (evita errores de hidratación).
 */
export function TrackStoreRehydrate() {
  useEffect(() => {
    void useTrackStore.persist.rehydrate();
  }, []);
  return null;
}
