"use client";

import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { useQueryClient } from "@tanstack/react-query";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";

import type { TsExercise } from "@/exercises/types";
import { Button } from "@/components/ui/Button";
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
  const storageKey = `fea.exercise.output.${exercise.id}.${lang}`;
  const [output, setOutput] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  });
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

  type RunOk = { ok: true; passed: number; total: number };
  type RunErr = { ok: false; error: string; diagnostics?: string[] };

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
        <Button
          onClick={() => setCode(exercise.starter)}
          variant="secondary"
          size="sm"
        >
          {lang === "en" ? "Reset" : "Reiniciar"}
        </Button>
        <Button
          type="button"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            setOutput(null);
            try {
              window.localStorage.removeItem(storageKey);
            } catch {
              /* ignore */
            }
            try {
              const res = await fetch("/api/exercises/run", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ exerciseId: exercise.id, code }),
              });
              if (res.status === 401) {
                const msg =
                  lang === "en"
                    ? "Session expired. Sign in again."
                    : "Sesión vencida. Volvé a iniciar sesión.";
                setOutput(msg);
                try {
                  window.localStorage.setItem(storageKey, msg);
                } catch {
                  /* ignore */
                }
                return;
              }
              let data: RunOk | RunErr | null = null;
              try {
                data = (await res.json()) as RunOk | RunErr;
              } catch {
                const msg =
                  lang === "en"
                    ? `Server returned ${res.status} without JSON. Check Vercel logs (/api/exercises/run).`
                    : `El servidor respondió ${res.status} sin JSON. Revisá logs en Vercel (/api/exercises/run).`;
                setOutput(msg);
                try {
                  window.localStorage.setItem(storageKey, msg);
                } catch {
                  /* ignore */
                }
                return;
              }
              if (!data) {
                const msg =
                  lang === "en"
                    ? "Unexpected empty response from server."
                    : "Respuesta vacía inesperada del servidor.";
                setOutput(msg);
                try {
                  window.localStorage.setItem(storageKey, msg);
                } catch {
                  /* ignore */
                }
                return;
              }
              if (data.ok) {
                const msg =
                  lang === "en"
                    ? `Passed ${data.passed}/${data.total}`
                    : `Pasó ${data.passed}/${data.total}`
                setOutput(msg);
                try {
                  window.localStorage.setItem(storageKey, msg);
                } catch {
                  /* ignore */
                }
                void queryClient.invalidateQueries({ queryKey: progressQueryKey });
              } else {
                const extra = data.diagnostics?.length
                  ? `\n${data.diagnostics.join("\n")}`
                  : "";
                const msg = `${data.error}${extra}`;
                setOutput(msg);
                try {
                  window.localStorage.setItem(storageKey, msg);
                } catch {
                  /* ignore */
                }
              }
            } catch {
              const msg =
                lang === "en"
                  ? "Request failed (network or server error)."
                  : "Falló la petición (red o error del servidor).";
              setOutput(msg);
              try {
                window.localStorage.setItem(storageKey, msg);
              } catch {
                /* ignore */
              }
            } finally {
              setLoading(false);
            }
          }}
          variant="primary"
          size="sm"
        >
          {lang === "en" ? "Run tests" : "Ejecutar tests"}
        </Button>
      </div>

      {output ? (
        <pre className="whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-200 p-4 font-mono text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
          {output}
        </pre>
      ) : null}
    </div>
  );
}
