"use client";

import { useQuery } from "@tanstack/react-query";

import {
  isProgressApiPayload,
  type ProgressApiPayload,
} from "@/lib/progress/api-payload";

export const progressQueryKey = ["progress"] as const;

export function useProgressQuery() {
  return useQuery({
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
}
