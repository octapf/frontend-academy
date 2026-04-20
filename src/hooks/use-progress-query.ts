"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  isProgressApiPayload,
  type ProgressApiPayload,
} from "@/lib/progress/api-payload";

export const progressQueryKey = ["progress"] as const;

export function useProgressQuery() {
  const q = useQuery({
    queryKey: progressQueryKey,
    queryFn: async (): Promise<ProgressApiPayload> => {
      const res = await fetch("/api/progress");
      const json: unknown = await res.json();
      if (!res.ok || !isProgressApiPayload(json)) {
        throw new Error("progress");
      }
      return json;
    },
    retry: 1,
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });

  // One-time migration hook: if an older build stored progress locally, merge it.
  useEffect(() => {
    if (!q.data) return;
    try {
      const raw = window.localStorage.getItem("fea.progress.export.v1");
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        lessonKeys?: unknown;
        exerciseIds?: unknown;
      };
      const lessonKeys = Array.isArray(parsed.lessonKeys)
        ? parsed.lessonKeys.filter((x): x is string => typeof x === "string")
        : [];
      const exerciseIds = Array.isArray(parsed.exerciseIds)
        ? parsed.exerciseIds.filter((x): x is string => typeof x === "string")
        : [];
      if (!lessonKeys.length && !exerciseIds.length) return;

      void fetch("/api/progress", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "merge", lessonKeys, exerciseIds }),
      }).finally(() => {
        window.localStorage.removeItem("fea.progress.export.v1");
      });
    } catch {
      // ignore
    }
  }, [q.data]);

  return q;
}
