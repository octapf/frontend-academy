"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { TrackId } from "@/lib/track";

type TrackState = {
  track: TrackId;
  setTrack: (track: TrackId) => void;
};

export const useTrackStore = create<TrackState>()(
  persist(
    (set) => ({
      track: "junior",
      setTrack: (track) => set({ track }),
    }),
    {
      name: "frontend-academy.track",
      partialize: (state) => ({ track: state.track }),
      /** Evita mismatch SSR/cliente; rehidratamos en `TrackStoreRehydrate`. */
      skipHydration: true,
    }
  )
);

