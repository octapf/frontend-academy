import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;

export const OG_ALT =
  "Frontend Academy — lecciones, referencia y ejercicios con tests en servidor";

/** Imagen OG/Twitter generada (1200×630), sin assets binarios. */
export function createBrandOpenGraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(145deg, #18181b 0%, #27272a 45%, #3f3f46 100%)",
          color: "#fafafa",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            borderRadius: 999,
            padding: "10px 20px",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color: "#e4e4e7",
            border: "1px solid #52525b",
            background: "rgba(63, 63, 70, 0.6)",
          }}
        >
          FEA
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            maxWidth: 980,
          }}
        >
          Frontend Academy
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            fontWeight: 400,
            lineHeight: 1.35,
            color: "#a1a1aa",
            maxWidth: 920,
          }}
        >
          Lecciones por módulos, glosario, slang y ejercicios TypeScript con validación
          en servidor.
        </div>
        <div
          style={{
            marginTop: "auto",
            paddingTop: 48,
            fontSize: 22,
            color: "#71717a",
          }}
        >
          frontend-academy
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
