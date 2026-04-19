"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { progressQueryKey } from "@/hooks/use-progress-query";

/** Registra una visita a la lección (idempotente por sesión de página). */
export function LessonProgressBeacon({
  moduleSlug,
  lessonSlug,
}: {
  moduleSlug: string;
  lessonSlug: string;
}) {
  const sent = useRef(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    void (async () => {
      try {
        const res = await fetch("/api/progress", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "lesson_view",
            moduleSlug,
            lessonSlug,
          }),
        });
        if (res.ok) {
          await queryClient.invalidateQueries({ queryKey: progressQueryKey });
        }
      } catch {
        /* ignore */
      }
    })();
  }, [moduleSlug, lessonSlug, queryClient]);

  return null;
}
