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
import { cn } from "@/lib/cn";

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
  type OutputKind = "success" | "error" | "info";
  type OutputState = {
    kind: OutputKind;
    title: string;
    message?: string;
    details?: string[];
  };

  function readStoredOutput(): OutputState | null {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return null;
      // Back-compat: previously we stored a plain string.
      if (!raw.trim().startsWith("{")) {
        return {
          kind: "info",
          title: lang === "en" ? "Output" : "Salida",
          message: raw,
        };
      }
      return JSON.parse(raw) as OutputState;
    } catch {
      return null;
    }
  }

  function writeStoredOutput(next: OutputState | null) {
    try {
      if (!next) window.localStorage.removeItem(storageKey);
      else window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  const [output, setOutput] = useState<OutputState | null>(() => {
    if (typeof window === "undefined") return null;
    return readStoredOutput();
  });
  const [loading, setLoading] = useState(false);

  const title = lang === "en" ? exercise.title.en : exercise.title.es;
  const description =
    lang === "en" ? exercise.description.en : exercise.description.es;
  const hints = exercise.hints ?? [];
  const [showHints, setShowHints] = useState(false);
  const [hintCount, setHintCount] = useState(1);

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

      {hints.length ? (
        <div className="rounded-xl border border-zinc-300 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-medium">
              {lang === "en" ? "Hints" : "Pistas"}
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowHints((v) => !v)}
            >
              {showHints ? (lang === "en" ? "Hide" : "Ocultar") : lang === "en" ? "Show" : "Ver"}
            </Button>
          </div>
          {showHints ? (
            <>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
                {hints.slice(0, Math.min(hintCount, hints.length)).map((h, i) => (
                  <li key={i}>{lang === "en" ? h.en : h.es}</li>
                ))}
              </ol>
              {hintCount < hints.length ? (
                <div className="mt-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setHintCount((n) => Math.min(n + 1, hints.length))}
                  >
                    {lang === "en" ? "Reveal next hint" : "Mostrar otra pista"}
                  </Button>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}

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
            writeStoredOutput(null);
            try {
              const res = await fetch("/api/exercises/run", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ exerciseId: exercise.id, code }),
              });
              if (res.status === 401) {
                const next: OutputState = {
                  kind: "info",
                  title: lang === "en" ? "Session" : "Sesión",
                  message:
                    lang === "en"
                      ? "Session expired. Sign in again."
                      : "Sesión vencida. Volvé a iniciar sesión.",
                };
                setOutput(next);
                writeStoredOutput(next);
                return;
              }
              let data: RunOk | RunErr | null = null;
              try {
                data = (await res.json()) as RunOk | RunErr;
              } catch {
                const next: OutputState = {
                  kind: "error",
                  title: lang === "en" ? "Server error" : "Error del servidor",
                  message:
                    lang === "en"
                      ? `Server returned ${res.status} without JSON. Check Vercel logs (/api/exercises/run).`
                      : `El servidor respondió ${res.status} sin JSON. Revisá logs en Vercel (/api/exercises/run).`,
                };
                setOutput(next);
                writeStoredOutput(next);
                return;
              }
              if (!data) {
                const next: OutputState = {
                  kind: "error",
                  title: lang === "en" ? "Server error" : "Error del servidor",
                  message:
                    lang === "en"
                      ? "Unexpected empty response from server."
                      : "Respuesta vacía inesperada del servidor.",
                };
                setOutput(next);
                writeStoredOutput(next);
                return;
              }
              if (data.ok) {
                const next: OutputState = {
                  kind: "success",
                  title: lang === "en" ? "Tests passed" : "Tests OK",
                  message:
                    lang === "en"
                      ? `Passed ${data.passed}/${data.total}`
                      : `Pasó ${data.passed}/${data.total}`,
                };
                setOutput(next);
                writeStoredOutput(next);
                void queryClient.invalidateQueries({ queryKey: progressQueryKey });
              } else {
                const next: OutputState = {
                  kind: "error",
                  title: lang === "en" ? "Tests failed" : "Falló",
                  message: data.error,
                  details: data.diagnostics,
                };
                setOutput(next);
                writeStoredOutput(next);
              }
            } catch {
              const next: OutputState = {
                kind: "error",
                title: lang === "en" ? "Request failed" : "Falló la petición",
                message:
                  lang === "en"
                    ? "Network or server error."
                    : "Error de red o del servidor.",
              };
              setOutput(next);
              writeStoredOutput(next);
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
        <div
          className={cn(
            "rounded-xl border p-4 text-sm",
            output.kind === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
              : output.kind === "error"
                ? "border-rose-500/30 bg-rose-500/10 text-rose-950 dark:text-rose-100"
                : "border-brand/25 bg-brand/10 text-zinc-900 dark:text-zinc-100"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="font-semibold">{output.title}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOutput(null);
                writeStoredOutput(null);
              }}
            >
              {lang === "en" ? "Clear" : "Limpiar"}
            </Button>
          </div>
          {output.message ? (
            <div className="mt-2 whitespace-pre-wrap font-mono text-xs opacity-90">
              {output.message}
            </div>
          ) : null}
          {output.details?.length ? (
            <details className="mt-3">
              <summary className="cursor-pointer select-none text-xs font-medium underline-offset-4 hover:underline">
                {lang === "en" ? "Details" : "Detalles"}
              </summary>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-black/5 p-3 font-mono text-xs text-zinc-900 dark:bg-white/10 dark:text-zinc-100">
                {output.details.join("\n")}
              </pre>
            </details>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
