"use client";

import { useEffect } from "react";

import { useLearnLangStore } from "@/stores/useLearnLangStore";

/** Rehidrata preferencia de idioma Learn persistida (evita mismatch SSR/cliente). */
export function LearnLangStoreRehydrate() {
  useEffect(() => {
    void useLearnLangStore.persist.rehydrate();
  }, []);
  return null;
}
