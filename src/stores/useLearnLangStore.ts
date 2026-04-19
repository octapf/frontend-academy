"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { LessonLang } from "@/lib/content/get-lesson";

type LearnLangState = {
  lang: LessonLang;
  setLearnLang: (lang: LessonLang) => void;
};

export const useLearnLangStore = create<LearnLangState>()(
  persist(
    (set) => ({
      lang: "es",
      setLearnLang: (lang) => set({ lang }),
    }),
    {
      name: "frontend-academy.learn-lang",
      partialize: (state) => ({ lang: state.lang }),
      skipHydration: true,
    },
  ),
);
