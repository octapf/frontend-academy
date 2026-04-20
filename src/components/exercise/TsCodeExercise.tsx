"use client";

import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { useQueryClient } from "@tanstack/react-query";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";

import type { TsExercise } from "@/exercises/types";
import {
  progressQueryKey,
  useProgressQuery,
} from "@/hooks/use-progress-query";

type Lang = "es" | "en";

/** Fondo gris (no blanco) para modo claro; alineado con `--background` (~zinc-300). */
const editorLightZinc = EditorView.theme(
  {
    "&": { backgroundColor: "#d4d4d8" },
    ".cm-scroller": { backgroundColor: "#d4d4d8" },
    ".cm-content": { color: "#18181b" },
    ".cm-gutters": {
      backgroundColor: "#c4c4cc",
      color: "#71717a",
      borderRight: "1px solid #b4b4bc",
    },
    ".cm-activeLine": { backgroundColor: "rgba(24, 24, 27, 0.06)" },
    ".cm-activeLineGutter": { backgroundColor: "rgba(24, 24, 27, 0.06)" },
  },
  { dark: false },
);

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

  const { resolvedTheme } = useTheme();
  const [code, setCode] = useState(exercise.starter);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const title = lang === "en" ? exercise.title.en : exercise.title.es;
  const description =
    lang === "en" ? exercise.description.en : exercise.description.es;

  const extensions = useMemo(
    () => [
      javascript({ typescript: true, jsx: false }),
      resolvedTheme === "dark" ? oneDark : editorLightZinc,
    ],
    [resolvedTheme],
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

      <div className="overflow-hidden rounded-xl border border-zinc-200 font-mono dark:border-zinc-700">
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
          className="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm hover:bg-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-100/10"
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
          className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-zinc-900 outline-none transition-colors hover:bg-brand/90 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100 disabled:opacity-60 dark:focus-visible:ring-offset-zinc-950"
        >
          {lang === "en" ? "Run tests" : "Ejecutar tests"}
        </button>
      </div>

      {output ? (
        <pre className="whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-200 p-4 font-mono text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
          {output}
        </pre>
      ) : null}
    </div>
  );
}
