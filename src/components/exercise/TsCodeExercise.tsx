"use client";

import { useQueryClient } from "@tanstack/react-query";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useMemo, useState } from "react";

import type { TsExercise } from "@/exercises/types";
import {
  progressQueryKey,
  useProgressQuery,
} from "@/hooks/use-progress-query";

type Lang = "es" | "en";

export function TsCodeExercise({
  exercise,
  lang,
  serverCompleted = false,
}: {
  exercise: TsExercise;
  lang: Lang;
  /** Estado persistido (SSR); se fusiona con React Query al hidratar. */
  serverCompleted?: boolean;
}) {
  const queryClient = useQueryClient();
  const { data: progress, isPending } = useProgressQuery();

  const completed =
    !isPending && progress
      ? progress.exerciseIds.includes(exercise.id)
      : serverCompleted;

  const [code, setCode] = useState(exercise.starter);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const title = lang === "en" ? exercise.title.en : exercise.title.es;
  const description =
    lang === "en" ? exercise.description.en : exercise.description.es;

  const extensions = useMemo(
    () => [javascript({ typescript: true, jsx: false })],
    []
  );

  return (
    <div className="space-y-4">
      {completed ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-950 dark:text-emerald-100">
          {lang === "en"
            ? "You already passed this exercise. You can keep practicing or reset the editor."
            : "Ya completaste este ejercicio. Podés seguir practicando o reiniciar el editor."}
        </div>
      ) : null}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          {description}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 font-mono dark:border-white/15">
        <CodeMirror
          value={code}
          height="220px"
          extensions={extensions}
          onChange={(v) => setCode(v)}
          className="text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCode(exercise.starter)}
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm hover:bg-black/5 dark:border-white/15 dark:bg-zinc-950 dark:hover:bg-white/10"
        >
          {lang === "en" ? "Reset" : "Reiniciar"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setOutput(null);
            try {
              const res = await fetch("/api/exercises/run", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ exerciseId: exercise.id, code }),
              });
              if (res.status === 401) {
                setOutput(
                  lang === "en"
                    ? "Session expired. Sign in again."
                    : "Sesión vencida. Volvé a iniciar sesión."
                );
                return;
              }
              const data = (await res.json()) as
                | { ok: true; passed: number; total: number }
                | { ok: false; error: string; diagnostics?: string[] };
              if (data.ok) {
                setOutput(
                  lang === "en"
                    ? `Passed ${data.passed}/${data.total}`
                    : `Pasó ${data.passed}/${data.total}`
                );
                void queryClient.invalidateQueries({ queryKey: progressQueryKey });
              } else {
                const extra = data.diagnostics?.length
                  ? `\n${data.diagnostics.join("\n")}`
                  : "";
                setOutput(`${data.error}${extra}`);
              }
            } catch {
              setOutput(lang === "en" ? "Request failed" : "Falló la petición");
            } finally {
              setLoading(false);
            }
          }}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-black/80 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          {lang === "en" ? "Run tests" : "Ejecutar tests"}
        </button>
      </div>

      {output ? (
        <pre className="whitespace-pre-wrap rounded-xl border border-black/10 bg-zinc-50 p-4 font-mono text-sm text-zinc-800 dark:border-white/15 dark:bg-black/40 dark:text-zinc-100">
          {output}
        </pre>
      ) : null}
    </div>
  );
}
