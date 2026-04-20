#!/usr/bin/env node
/**
 * Contenido alineado con prep (qida): nuevos módulos + refuerzos en módulos existentes.
 * Uso: node scripts/seed-qida-lessons.mjs [--force]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lessonsDir = path.join(__dirname, "..", "content", "lessons");
const force = process.argv.includes("--force");

const SECTION = {
  es: {
    goal: "Qué vas a entender",
    detail: "Detalle",
    practice: "Práctica recomendada",
    pitfalls: "Errores comunes",
    resources: "Recursos",
  },
  en: {
    goal: "What you’ll take away",
    detail: "Details",
    practice: "Recommended practice",
    pitfalls: "Common pitfalls",
    resources: "Resources",
  },
};

const DEF_PIT = {
  es: "Copiar el snippet sin adaptar convenciones del equipo (nombres, capas, tests, accesibilidad).",
  en: "Copying snippets without adapting team conventions (names, layers, tests, accessibility).",
};

const DEF_RES = {
  es: `- [MDN Web Docs](https://developer.mozilla.org/es/)\n- Documentación oficial del stack que estés usando.`,
  en: `- [MDN Web Docs](https://developer.mozilla.org/en-US/)\n- Official docs for the stack you use.`,
};

const NEXT_RES = {
  es: `- [Next.js — Docs](https://nextjs.org/docs)\n- [MDN Web Docs](https://developer.mozilla.org/es/)`,
  en: `- [Next.js — Docs](https://nextjs.org/docs)\n- [MDN Web Docs](https://developer.mozilla.org/en-US/)`,
};

function fm({ title, description, level, order }) {
  return `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
level: ${level}
order: ${order}
---

`;
}

function body(title, paras, lang, pit, resMd) {
  const s = SECTION[lang];
  const [first, second] = paras;
  const practiceBullets =
    lang === "es"
      ? `- Anotá **un caso real** de tu repo donde este tema apareció (o debería haber aparecido).\n- Si aplica, usá **DevTools** (red, consola, performance, layout) para conectar el concepto con lo observable.`
      : `- Write down **one real case** from your repo where this topic showed up (or should have).\n- When relevant, use **DevTools** (network, console, performance, layout) to connect the idea to what you can observe.`;
  const pitfall = pit?.[lang] ?? DEF_PIT[lang];
  const res = resMd?.[lang] ?? DEF_RES[lang];

  return `# ${title}

## ${s.goal}

${first}

## ${s.detail}

${second}

## ${s.practice}

${practiceBullets}

## ${s.pitfalls}

- ${pitfall}

## ${s.resources}

${res}
`;
}

/** Campos: module, slug, order, level, titleEs, titleEn, descEs, descEn, pEs[2], pEn[2], pitfallEs?, pitfallEn?, resourcesEs?, resourcesEn? */
const LESSONS = [
  {
    module: "javascript",
    slug: "event-loop-and-tasks",
    order: 2,
    level: "junior",
    titleEs: "Event loop: macrotareas y microtareas",
    titleEn: "Event loop: macrotasks and microtasks",
    descEs: "Por qué `setTimeout` y `Promise.then` no compiten en la misma cola.",
    descEn: "Why `setTimeout` and `Promise.then` do not race on the same queue.",
    pEs: [
      "El hilo principal ejecuta tu JS y luego vacía microtareas antes del siguiente render o pintura; entender eso explica muchos bugs de “orden raro”.",
      "En entrevistas suele aparecer el patrón log → microtarea → log: sin memorizar, podés razonar con una línea de tiempo.",
    ],
    pEn: [
      "The main thread runs your JS, then drains microtasks before the next paint; that explains many “weird order” bugs.",
      "Interview puzzles often mix logs and microtasks: you can reason with a timeline instead of memorizing tables.",
    ],
    pitfallEs:
      "Mezclar `await` con `setTimeout(0)` y esperar un orden fijo sin mirar si hubo microtareas intermedias.",
    pitfallEn:
      "Mixing `await` with `setTimeout(0)` and assuming a fixed order without checking intermediate microtasks.",
    resourcesEs:
      "- [MDN — Event loop](https://developer.mozilla.org/es/docs/Web/JavaScript/Event_loop)\n- [MDN — queueMicrotask](https://developer.mozilla.org/es/docs/Web/API/queueMicrotask)",
    resourcesEn:
      "- [MDN — Event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)\n- [MDN — queueMicrotask](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)",
  },
  {
    module: "javascript",
    slug: "promises-async-await",
    order: 3,
    level: "junior",
    titleEs: "Promises y async/await en UI",
    titleEn: "Promises and async/await in UI",
    descEs: "Errores, cancelación y estados de carga sin fugas.",
    descEn: "Errors, cancellation, and loading states without leaks.",
    pEs: [
      "`async` siempre devuelve una Promise; olvidar `try/catch` o `.catch` deja rechazos silenciosos en handlers de eventos.",
      "Para requests en vuelo, pensá en **AbortController** o en ignorar respuestas viejas comparando un id de request.",
    ],
    pEn: [
      "`async` always returns a Promise; forgetting `try/catch` or `.catch` leaves silent rejections in event handlers.",
      "For in-flight requests, consider **AbortController** or ignoring stale responses with a request id.",
    ],
    pitfallEs: "Encadenar `.then` sin retornar la Promise interna y perder el flujo de errores.",
    pitfallEn: "Chaining `.then` without returning the inner Promise and losing error propagation.",
  },
  {
    module: "javascript",
    slug: "es-modules-and-scope",
    order: 4,
    level: "junior",
    titleEs: "Módulos ES: import, export y scope de archivo",
    titleEn: "ES modules: import, export, and file scope",
    descEs: "Cómo el bundler y el runtime resuelven dependencias circulares y tree-shaking.",
    descEn: "How bundler and runtime handle cycles and tree-shaking.",
    pEs: [
      "`import` vive en el scope superior del módulo: no podés condicionarlo como un `require` clásico sin extraer a otro módulo.",
      "Los imports estáticos ayudan al análisis estático; los dinámicos `import()` habilitan code splitting explícito.",
    ],
    pEn: [
      "`import` is hoisted to module top level: you cannot condition it like legacy `require` without splitting modules.",
      "Static imports help static analysis; dynamic `import()` enables explicit code splitting.",
    ],
    resourcesEs:
      "- [MDN — JavaScript modules](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules)",
    resourcesEn:
      "- [MDN — JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)",
  },
  {
    module: "html-css",
    slug: "forms-native-and-labels",
    order: 2,
    level: "junior",
    titleEs: "Formularios nativos y etiquetas",
    titleEn: "Native forms and labels",
    descEs: "Asociar cada control con su `<label>` y mensajes de error accesibles.",
    descEn: "Associate each control with its `<label>` and accessible error messages.",
    pEs: [
      "El atributo `for` del label debe coincidir con el `id` del input; en listas dinámicas usá ids estables o `aria-labelledby`.",
      "Los mensajes de validación conviene enlazarlos con `aria-describedby` para que el lector anuncie contexto.",
    ],
    pEn: [
      "The label `for` must match the input `id`; in dynamic lists use stable ids or `aria-labelledby`.",
      "Tie validation messages with `aria-describedby` so assistive tech reads context.",
    ],
    pitfallEs: "Simular un checkbox con `div` y `onClick` sin rol ni teclado.",
    pitfallEn: "Simulating a checkbox with `div` and `onClick` without role or keyboard support.",
  },
  {
    module: "html-css",
    slug: "viewport-media-and-responsive-images",
    order: 3,
    level: "junior",
    titleEs: "Viewport, media queries e imágenes responsivas",
    titleEn: "Viewport, media queries, and responsive images",
    descEs: "Mobile-first y `srcset`/`sizes` sin inflar bytes.",
    descEn: "Mobile-first and `srcset`/`sizes` without shipping extra bytes.",
    pEs: [
      "La meta viewport evita que el móvil mienta el ancho; sin ella los breakpoints parecen “no funcionar”.",
      "`srcset` describe candidatos de densidad o ancho; `sizes` dice cuál regla aplica al layout actual.",
    ],
    pEn: [
      "The viewport meta tag stops mobile from lying about width; without it breakpoints look “broken”.",
      "`srcset` lists candidate widths/densities; `sizes` tells the browser which slot applies to the current layout.",
    ],
    resourcesEs:
      "- [MDN — Responsive images](https://developer.mozilla.org/es/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)",
    resourcesEn:
      "- [MDN — Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)",
  },
  {
    module: "nextjs",
    slug: "app-router-segments",
    order: 2,
    level: "mid",
    titleEs: "App Router: segmentos y rutas dinámicas",
    titleEn: "App Router: segments and dynamic routes",
    descEs: "Cómo `app/` se traduce en URLs y `params` en el servidor.",
    descEn: "How `app/` maps to URLs and `params` on the server.",
    pEs: [
      "Cada carpeta bajo `app/` es un segmento; `page.tsx` responde con UI y convive con `layout.tsx` en el mismo árbol.",
      "Los segmentos `[slug]` exponen `params`; en versiones recientes pueden llegar como `Promise` y requieren `await`.",
    ],
    pEn: [
      "Each folder under `app/` is a segment; `page.tsx` returns UI and coexists with `layout.tsx` in the same tree.",
      "`[slug]` segments expose `params`; on recent Next versions they may be a `Promise` and need `await`.",
    ],
    pitfallEs: "Duplicar la misma ruta mezclando `pages/` y `app/` sin migración clara.",
    pitfallEn: "Duplicating routes by mixing `pages/` and `app/` without a clear migration path.",
    resourcesEs: NEXT_RES.es,
    resourcesEn: NEXT_RES.en,
  },
  {
    module: "nextjs",
    slug: "layouts-and-templates",
    order: 3,
    level: "mid",
    titleEs: "Layouts anidados y `template.tsx`",
    titleEn: "Nested layouts and `template.tsx`",
    descEs: "Qué persiste al navegar y qué se remonta en cada cambio de ruta.",
    descEn: "What persists across navigations vs what remounts on each route change.",
    pEs: [
      "`layout.tsx` envuelve hijos y mantiene estado entre rutas; útil para shell, providers y navegación lateral.",
      "`template.tsx` remonta como una página nueva: sirve para animaciones de entrada o reset de estado local por ruta.",
    ],
    pEn: [
      "`layout.tsx` wraps children and keeps state across routes; great for shells, providers, and side nav.",
      "`template.tsx` remounts like a fresh page: useful for enter animations or per-route local resets.",
    ],
    resourcesEs: NEXT_RES.es,
    resourcesEn: NEXT_RES.en,
  },
  {
    module: "nextjs",
    slug: "server-and-client-boundaries",
    order: 4,
    level: "mid",
    titleEs: "Límite servidor/cliente (`'use client'`)",
    titleEn: "Server/client boundary (`'use client'`)",
    descEs: "Dónde poner interactividad sin inflar el bundle.",
    descEn: "Where to place interactivity without bloating the client bundle.",
    pEs: [
      "Por defecto los componentes bajo `app/` son Server Components: podés leer env secretos y hacer `fetch` cercano a datos.",
      "Marcá `'use client'` en hojas pequeñas (inputs, drag, animaciones) e importalas desde el servidor.",
    ],
    pEn: [
      "By default `app/` components are Server Components: you can read server secrets and colocate `fetch` with data.",
      "Put `'use client'` on small leaves (inputs, drag, animations) and import them from server parents.",
    ],
    pitfallEs: "Marcar `'use client'` en el layout raíz y convertir todo el árbol en bundle de cliente.",
    pitfallEn: "Adding `'use client'` at the root layout and turning the whole tree into client JS.",
    resourcesEs: NEXT_RES.es,
    resourcesEn: NEXT_RES.en,
  },
  {
    module: "nextjs",
    slug: "fetch-cache-and-revalidate",
    order: 5,
    level: "mid",
    titleEs: "`fetch`, caché y revalidación",
    titleEn: "`fetch`, cache, and revalidation",
    descEs: "`no-store`, `revalidate` y cuándo forzar dinámico.",
    descEn: "`no-store`, `revalidate`, and when to force dynamic rendering.",
    pEs: [
      "En el servidor, `fetch` entiende opciones de Next: `cache: 'no-store'` para datos por request o usuario.",
      "`next: { revalidate: N }` modela ISR: caché con caducidad; combiná con tags si tu versión lo soporta.",
    ],
    pEn: [
      "On the server, `fetch` understands Next options: `cache: 'no-store'` for per-request or per-user data.",
      "`next: { revalidate: N }` models ISR: time-based freshness; combine with tags when your version supports it.",
    ],
    resourcesEs: NEXT_RES.es,
    resourcesEn: NEXT_RES.en,
  },
  {
    module: "nextjs",
    slug: "static-dynamic-and-cookies",
    order: 6,
    level: "mid",
    titleEs: "Estático vs dinámico: `cookies`, `headers` y segment config",
    titleEn: "Static vs dynamic: `cookies`, `headers`, and segment config",
    descEs: "Qué señales hacen que una ruta deje de prerenderizarse.",
    descEn: "Signals that stop a route from being prerendered.",
    pEs: [
      "Leer `cookies()` o `headers()` suele marcar el segmento como dinámico porque varía por request.",
      "`export const dynamic = 'force-static'` o `revalidate` son palancas explícitas cuando el análisis no alcanza.",
    ],
    pEn: [
      "Reading `cookies()` or `headers()` usually makes the segment dynamic because it varies per request.",
      "`export const dynamic = 'force-static'` or `revalidate` are explicit levers when static inference is not enough.",
    ],
    resourcesEs: NEXT_RES.es,
    resourcesEn: NEXT_RES.en,
  },
  {
    module: "nextjs",
    slug: "metadata-and-open-graph",
    order: 7,
    level: "mid",
    titleEs: "Metadata, Open Graph y `generateMetadata`",
    titleEn: "Metadata, Open Graph, and `generateMetadata`",
    descEs: "SEO sin duplicar `<head>` a mano.",
    descEn: "SEO without hand-maintaining `<head>`.",
    pEs: [
      "Exportá `metadata` estática en layouts compartidos para defaults de título y descripción.",
      "`generateMetadata` async permite títulos por `params` o datos remotos con caché coherente al segmento.",
    ],
    pEn: [
      "Export static `metadata` on shared layouts for default titles and descriptions.",
      "Async `generateMetadata` can build titles from `params` or remote data with the segment cache model.",
    ],
    resourcesEs: NEXT_RES.es,
    resourcesEn: NEXT_RES.en,
  },
  {
    module: "nextjs",
    slug: "next-image-and-link",
    order: 8,
    level: "junior",
    titleEs: "`next/image` y `next/link`",
    titleEn: "`next/image` and `next/link`",
    descEs: "Rendimiento visual y navegación con prefetch.",
    descEn: "Visual performance and navigation with prefetch.",
    pEs: [
      "`Image` optimiza formatos y tamaños; definí `width`/`height` o `fill` para evitar CLS.",
      "`Link` prefetch de rutas internas cuando el enlace entra en viewport; útil para UX de SPA.",
    ],
    pEn: [
      "`Image` optimizes formats and sizes; set `width`/`height` or `fill` to avoid CLS.",
      "`Link` prefetches internal routes when links enter the viewport; great SPA-style UX.",
    ],
    pitfallEs: "Olvidar `images.remotePatterns` y romper builds con dominios externos.",
    pitfallEn: "Forgetting `images.remotePatterns` and breaking builds for external hosts.",
    resourcesEs: NEXT_RES.es,
    resourcesEn: NEXT_RES.en,
  },
  {
    module: "nextjs",
    slug: "loading-streaming-and-errors",
    order: 9,
    level: "mid",
    titleEs: "`loading.tsx`, streaming y `error.tsx`",
    titleEn: "`loading.tsx`, streaming, and `error.tsx`",
    descEs: "Suspense integrado y límites de error con reset.",
    descEn: "Built-in Suspense and error boundaries with reset.",
    pEs: [
      "`loading.tsx` provee fallback mientras el segmento suspende; comunica espera sin bloquear el shell.",
      "`error.tsx` debe ser cliente y expone `reset()` para reintentar sin recargar toda la app.",
    ],
    pEn: [
      "`loading.tsx` provides a fallback while the segment suspends; shows wait without blocking the shell.",
      "`error.tsx` must be a client component and exposes `reset()` to retry without full reload.",
    ],
    resourcesEs: NEXT_RES.es,
    resourcesEn: NEXT_RES.en,
  },
  {
    module: "nextjs",
    slug: "route-handlers-http",
    order: 10,
    level: "mid",
    titleEs: "Route Handlers: GET/POST y `NextResponse`",
    titleEn: "Route Handlers: GET/POST and `NextResponse`",
    descEs: "APIs en `app/api/.../route.ts` sin Express aparte.",
    descEn: "APIs in `app/api/.../route.ts` without a separate Express server.",
    pEs: [
      "Exportá funciones nombradas por verbo HTTP; recibís `Request` estándar y devolvés `NextResponse.json`.",
      "Son ideales para BFF, webhooks y secretos de servidor que no deben filtrarse al bundle.",
    ],
    pEn: [
      "Export functions named after HTTP verbs; you receive a standard `Request` and return `NextResponse.json`.",
      "Great for BFF endpoints, webhooks, and server secrets that must not ship to the client bundle.",
    ],
    pitfallEs: "Poner `page.tsx` y `route.ts` en el mismo segmento esperando dos respuestas para una URL.",
    pitfallEn: "Placing `page.tsx` and `route.ts` in the same segment expecting two responses for one URL.",
    resourcesEs: NEXT_RES.es,
    resourcesEn: NEXT_RES.en,
  },
  {
    module: "nextjs",
    slug: "middleware-basics",
    order: 11,
    level: "mid",
    titleEs: "Middleware: matcher, headers y redirects",
    titleEn: "Middleware: matcher, headers, and redirects",
    descEs: "Código que corre antes del render del segmento.",
    descEn: "Code that runs before the segment render.",
    pEs: [
      "`middleware.ts` en la raíz puede reescribir, redirigir o setear headers para auth e i18n.",
      "Restringí con `config.matcher` para no ejecutar en assets estáticos ni en healthchecks innecesarios.",
    ],
    pEn: [
      "Root `middleware.ts` can rewrite, redirect, or set headers for auth and i18n.",
      "Scope with `config.matcher` so you do not run on static assets or noisy health checks.",
    ],
    resourcesEs: NEXT_RES.es,
    resourcesEn: NEXT_RES.en,
  },
  {
    module: "nextjs",
    slug: "next-config-and-env",
    order: 12,
    level: "junior",
    titleEs: "`next.config` y variables de entorno",
    titleEn: "`next.config` and environment variables",
    descEs: "Secretos vs `NEXT_PUBLIC_` y ajustes de imágenes.",
    descEn: "Secrets vs `NEXT_PUBLIC_` and image settings.",
    pEs: [
      "Solo variables con prefijo `NEXT_PUBLIC_` llegan al navegador; el resto queda en servidor y build.",
      "`images.remotePatterns`, redirects y flags experimentales viven en `next.config`; reiniciá dev al cambiar.",
    ],
    pEn: [
      "Only `NEXT_PUBLIC_` variables reach the browser; others stay on the server/build.",
      "`images.remotePatterns`, redirects, and experimental flags live in `next.config`; restart dev after edits.",
    ],
    pitfallEs: "Publicar claves privadas con prefijo público por comodidad.",
    pitfallEn: "Publishing private keys with the public prefix for convenience.",
    resourcesEs: NEXT_RES.es,
    resourcesEn: NEXT_RES.en,
  },
  {
    module: "redux",
    slug: "slice-store-and-actions",
    order: 2,
    level: "mid",
    titleEs: "`createSlice`: estado, reducers y acciones",
    titleEn: "`createSlice`: state, reducers, and actions",
    descEs: "Menos boilerplate que Redux clásico.",
    descEn: "Less boilerplate than hand-written Redux.",
    pEs: [
      "Un slice agrupa estado inicial, reducers y action creators tipados con Immer bajo el capó.",
      "Registrá slices en `configureStore` y usá `TypedUseSelectorHook` para hooks tipados en TypeScript.",
    ],
    pEn: [
      "A slice bundles initial state, reducers, and action creators with Immer under the hood.",
      "Register slices in `configureStore` and wire `TypedUseSelectorHook` for typed hooks in TypeScript.",
    ],
    resourcesEs:
      "- [Redux Toolkit — createSlice](https://redux-toolkit.js.org/api/createSlice)\n- [Redux — Style guide](https://redux.js.org/style-guide/)",
    resourcesEn:
      "- [Redux Toolkit — createSlice](https://redux-toolkit.js.org/api/createSlice)\n- [Redux — Style guide](https://redux.js.org/style-guide/)",
  },
  {
    module: "redux",
    slug: "selectors-and-normalization",
    order: 3,
    level: "mid",
    titleEs: "Selectores y normalización de entidades",
    titleEn: "Selectors and normalized entities",
    descEs: "Evitar duplicar datos y renders innecesarios.",
    descEn: "Avoid duplicated data and unnecessary renders.",
    pEs: [
      "Normalizá por id (`entities`, `ids`) para lecturas O(1) y merges predecibles.",
      "Memoizá selectores con `reselect` cuando derivás listas filtradas o totales sobre colecciones grandes.",
    ],
    pEn: [
      "Normalize by id (`entities`, `ids`) for predictable merges and O(1) reads.",
      "Memoize selectors with `reselect` when deriving filtered lists or totals over large collections.",
    ],
    pitfallEs: "Guardar el mismo usuario en tres ramas distintas del árbol sin fuente única.",
    pitfallEn: "Storing the same user in three branches without a single source of truth.",
    resourcesEs: "- [Redux Toolkit — createEntityAdapter](https://redux-toolkit.js.org/api/createEntityAdapter)",
    resourcesEn: "- [Redux Toolkit — createEntityAdapter](https://redux-toolkit.js.org/api/createEntityAdapter)",
  },
  {
    module: "zustand",
    slug: "subscriptions-and-shallow",
    order: 2,
    level: "mid",
    titleEs: "Suscripciones y comparación shallow",
    titleEn: "Subscriptions and shallow comparison",
    descEs: "Re-renders solo cuando cambia lo que consume el componente.",
    descEn: "Re-render only when the consumed slice actually changes.",
    pEs: [
      "`useStore(selector)` dispara render cuando el resultado del selector cambia por referencia.",
      "Para objetos parciales usá `shallow` o selectores que devuelvan primitivos estables.",
    ],
    pEn: [
      "`useStore(selector)` triggers renders when the selector result changes by reference.",
      "For partial objects use `shallow` or selectors that return stable primitives.",
    ],
    pitfallEs: "Selector que devuelve objeto literal nuevo en cada llamada y fuerza render infinito.",
    pitfallEn: "Selector returning a fresh object literal each call and forcing constant re-renders.",
    resourcesEs: "- [Zustand — Guides](https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions)",
    resourcesEn: "- [Zustand — Guides](https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions)",
  },
  {
    module: "tanstack-query",
    slug: "query-keys-staletime-invalidation",
    order: 2,
    level: "mid",
    titleEs: "Query keys, `staleTime` e invalidación",
    titleEn: "Query keys, `staleTime`, and invalidation",
    descEs: "Contrato explícito entre UI y datos remotos.",
    descEn: "An explicit contract between UI and remote data.",
    pEs: [
      "Las keys deben incluir todo lo que define el resultado: usuario, filtros, locale.",
      "`staleTime` evita refetch agresivo; `invalidateQueries` alinea mutaciones con lecturas.",
    ],
    pEn: [
      "Keys must include everything that defines the result: user, filters, locale.",
      "`staleTime` avoids aggressive refetch; `invalidateQueries` aligns writes with reads.",
    ],
    resourcesEs: "- [TanStack Query — Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)",
    resourcesEn: "- [TanStack Query — Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)",
  },
  {
    module: "tanstack-query",
    slug: "mutations-and-rollback",
    order: 3,
    level: "mid",
    titleEs: "Mutaciones, optimistic UI y rollback",
    titleEn: "Mutations, optimistic UI, and rollback",
    descEs: "Mejorar UX sin mentirle al usuario al fallar.",
    descEn: "Improve UX without lying to users when failures happen.",
    pEs: [
      "`onMutate` puede aplicar cambio optimista y guardar snapshot para `onError` que revierte.",
      "Combiná con toasts y estados de reintento; documentá qué pasa si el usuario navega durante la mutación.",
    ],
    pEn: [
      "`onMutate` can apply optimistic updates and stash a snapshot for `onError` rollback.",
      "Pair with toasts and retry states; document behavior if the user navigates mid-mutation.",
    ],
    pitfallEs: "Optimismo sin manejo de carrera: respuesta vieja pisa estado nuevo.",
    pitfallEn: "Optimism without race handling: stale responses overwrite newer state.",
    resourcesEs: "- [TanStack Query — Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)",
    resourcesEn: "- [TanStack Query — Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)",
  },
  {
    module: "git",
    slug: "rebase-merge-and-linear-history",
    order: 2,
    level: "junior",
    titleEs: "Rebase vs merge: historia legible",
    titleEn: "Rebase vs merge: readable history",
    descEs: "Cuándo reescribir commits y cuándo preservar merges reales.",
    descEn: "When to rewrite commits vs preserve real merges.",
    pEs: [
      "Rebase interactivo limpia commits ruidosos antes del PR; requiere coordinación si la rama es compartida.",
      "Merge conserva el contexto de integración; útil cuando varios equipos tocaron la misma base.",
    ],
    pEn: [
      "Interactive rebase cleans noisy commits before a PR; needs coordination on shared branches.",
      "Merge preserves integration context; useful when multiple teams touched the same base.",
    ],
    pitfallEs: "Rebasear sobre main sin actualizar local y generar conflictos masivos a último momento.",
    pitfallEn: "Rebasing onto main without updating first and creating huge last-minute conflicts.",
    resourcesEs: "- [Git book — Rebasing](https://git-scm.com/book/es/v2/Git-Branching-Rebasing)",
    resourcesEn: "- [Git book — Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)",
  },
  {
    module: "git",
    slug: "conflict-resolution-workflow",
    order: 3,
    level: "junior",
    titleEs: "Conflictos de merge: flujo seguro",
    titleEn: "Merge conflicts: a safe workflow",
    descEs: "Leer el diff, entender ambas versiones y probar antes de pushear.",
    descEn: "Read the diff, understand both sides, and test before pushing.",
    pEs: [
      "Marcadores `<<<<<<<` muestran base, entrante y actual: resolvé intención, no solo sintaxis.",
      "Corré tests y la app tras resolver; si dudás, pedí segunda opinión antes de `--force`.",
    ],
    pEn: [
      "Conflict markers show ours, theirs, and base: resolve intent, not only syntax.",
      "Run tests and the app after resolving; if unsure, get a second opinion before `--force`.",
    ],
  },
  {
    module: "agile",
    slug: "acceptance-criteria-and-dod",
    order: 2,
    level: "junior",
    titleEs: "Criterios de aceptación y Definition of Done",
    titleEn: "Acceptance criteria and Definition of Done",
    descEs: "De historias vagas a verificaciones binarias.",
    descEn: "From vague stories to binary checks.",
    pEs: [
      "Un criterio aceptable es observable: “usuario ve error X cuando falla Y”, no “queda lindo”.",
      "La DoD incluye calidad transversal: tests mínimos, telemetría, accesibilidad según convención del equipo.",
    ],
    pEn: [
      "Good acceptance criteria are observable: “user sees error X when Y fails”, not “make it pretty”.",
      "DoD includes cross-cutting quality: minimum tests, telemetry, accessibility per team norms.",
    ],
    pitfallEs: "Confundir estimación puntual con compromiso sin riesgos explícitos.",
    pitfallEn: "Treating a point estimate as a promise without explicit risk callouts.",
  },
  {
    module: "typescript",
    slug: "zod-schemas-at-boundaries",
    order: 38,
    level: "mid",
    titleEs: "Zod en el borde: parsear lo desconocido",
    titleEn: "Zod at the boundary: parse the unknown",
    descEs: "APIs, `fetch` y `JSON.parse` no garantizan tipos en runtime.",
    descEn: "APIs, `fetch`, and `JSON.parse` do not guarantee types at runtime.",
    pEs: [
      "Definí schemas para payloads externos y fallá temprano con mensajes claros para logs y UI.",
      "Derivá tipos TypeScript desde el schema (`z.infer`) para una sola fuente de verdad.",
    ],
    pEn: [
      "Define schemas for external payloads and fail fast with clear messages for logs and UI.",
      "Derive TS types from the schema (`z.infer`) for a single source of truth.",
    ],
    pitfallEs: "Parsear en cada render sin memoizar el schema o sin cachear el resultado.",
    pitfallEn: "Parsing on every render without memoizing the schema or caching the result.",
    resourcesEs: "- [Zod](https://zod.dev/)\n- [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)",
    resourcesEn: "- [Zod](https://zod.dev/)\n- [TypeScript handbook — narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)",
  },
  {
    module: "react",
    slug: "suspense-lazy-and-splitting",
    order: 46,
    level: "mid",
    titleEs: "Suspense, `lazy` y code splitting",
    titleEn: "Suspense, `lazy`, and code splitting",
    descEs: "Cargar rutas o widgets pesados sin bloquear el shell.",
    descEn: "Load heavy routes or widgets without blocking the shell.",
    pEs: [
      "`React.lazy` + `Suspense` difieren el parse/eval del bundle hasta que el árbol lo necesita.",
      "Definí fallbacks accesibles y estados de error: el usuario debe entender qué está cargando.",
    ],
    pEn: [
      "`React.lazy` + `Suspense` defer parsing/eval until the tree needs the chunk.",
      "Provide accessible fallbacks and errors: users should understand what is loading.",
    ],
    resourcesEs:
      "- [React — lazy](https://react.dev/reference/react/lazy)\n- [React — Suspense](https://react.dev/reference/react/Suspense)",
    resourcesEn:
      "- [React — lazy](https://react.dev/reference/react/lazy)\n- [React — Suspense](https://react.dev/reference/react/Suspense)",
  },
  {
    module: "react",
    slug: "error-boundary-vs-query-errors",
    order: 47,
    level: "mid",
    titleEs: "Error Boundary vs errores async (Query)",
    titleEn: "Error Boundary vs async errors (Query)",
    descEs: "Qué atrapa React y qué debés manejar vos en data fetching.",
    descEn: "What React catches vs what you must handle in data fetching.",
    pEs: [
      "Los Error Boundaries no capturan event handlers ni promesas no observadas: los errores de `useQuery` se modelan con estado `error`.",
      "Componé: boundary para render tree, `onError`/`throwOnError` según librería para datos remotos.",
    ],
    pEn: [
      "Error boundaries do not catch event handlers or unhandled promises: `useQuery` errors surface as `error` state.",
      "Compose: boundary for render tree, `onError` / `throwOnError` per library for remote data.",
    ],
    pitfallEs: "Esperar que un boundary salve un `fetch` mal manejado dentro de un effect sin `await`/`catch`.",
    pitfallEn: "Expecting a boundary to save a badly handled `fetch` inside an effect without `await`/`catch`.",
    resourcesEs:
      "- [React — error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)\n- [TanStack Query — errors](https://tanstack.com/query/latest/docs/framework/react/guides/query-retries)",
    resourcesEn:
      "- [React — error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)\n- [TanStack Query — errors](https://tanstack.com/query/latest/docs/framework/react/guides/query-retries)",
  },
  {
    module: "architecture",
    slug: "csp-and-xss-mindset",
    order: 21,
    level: "mid",
    titleEs: "CSP y mentalidad anti-XSS",
    titleEn: "CSP and an anti-XSS mindset",
    descEs: "Capas de defensa cuando renderizás HTML de terceros o usuarios.",
    descEn: "Defense layers when rendering third-party or user HTML.",
    pEs: [
      "Content-Security-Policy reduce daño si alguien inyecta script: empezá restrictivo y aflojá con allowlist.",
      "Sanitizá HTML rico en servidor o con librerías probadas; nunca `dangerouslySetInnerHTML` sin política clara.",
    ],
    pEn: [
      "Content-Security-Policy limits damage if script is injected: start strict and loosen with allowlists.",
      "Sanitize rich HTML on the server or with proven libs; never `dangerouslySetInnerHTML` without policy.",
    ],
    resourcesEs:
      "- [MDN — CSP](https://developer.mozilla.org/es/docs/Web/HTTP/CSP)\n- [OWASP — XSS](https://owasp.org/www-community/attacks/xss/)",
    resourcesEn:
      "- [MDN — CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)\n- [OWASP — XSS](https://owasp.org/www-community/attacks/xss/)",
  },
  {
    module: "architecture",
    slug: "oauth-tokens-and-bff-pattern",
    order: 22,
    level: "mid",
    titleEs: "OAuth, tokens y patrón BFF en frontend",
    titleEn: "OAuth, tokens, and the BFF pattern from the frontend",
    descEs: "Dónde guardar sesión y cómo evitar filtrar secretos.",
    descEn: "Where to keep session state and how to avoid leaking secrets.",
    pEs: [
      "Los tokens de acceso no deberían vivir en storage accesible a XSS si podés usar cookies HttpOnly vía BFF.",
      "Un BFF (Route Handler o API interna) traduce cookies de sesión a llamadas a APIs upstream con credenciales server-side.",
    ],
    pEn: [
      "Access tokens should not live in XSS-readable storage when you can use HttpOnly cookies via a BFF.",
      "A BFF (Route Handler or internal API) turns session cookies into upstream calls with server-side credentials.",
    ],
    pitfallEs: "Exponer client_secret o refresh tokens en el bundle por configuración mal copiada.",
    pitfallEn: "Shipping `client_secret` or refresh tokens in the bundle via mis-copied config.",
    resourcesEs: "- [OAuth 2.0 for browser-based apps (IETF BCP)](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps)",
    resourcesEn: "- [OAuth 2.0 for browser-based apps (IETF BCP)](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps)",
  },
  {
    module: "styles",
    slug: "tailwind-utility-philosophy",
    order: 26,
    level: "junior",
    titleEs: "Tailwind: filosofía utility-first",
    titleEn: "Tailwind: utility-first philosophy",
    descEs: "Cuándo conviene y cómo evitar `className` ilegible.",
    descEn: "When it helps and how to avoid unreadable `className` strings.",
    pEs: [
      "Las utilidades acercan el estilo al JSX; combinalo con componentes y helpers `cn`/`clsx` para variantes.",
      "Mobile-first (`md:`) y dark mode (`dark:`) son prefijos habituales en entrevistas de diseño responsivo.",
    ],
    pEn: [
      "Utilities colocate styling with JSX; pair with components and `cn`/`clsx` helpers for variants.",
      "Mobile-first (`md:`) and dark mode (`dark:`) prefixes are common in responsive interviews.",
    ],
    resourcesEs: "- [Tailwind CSS — docs](https://tailwindcss.com/docs)",
    resourcesEn: "- [Tailwind CSS — docs](https://tailwindcss.com/docs)",
  },
];

let written = 0;
let skipped = 0;

for (const row of LESSONS) {
  const {
    module,
    slug,
    order,
    level,
    titleEs,
    titleEn,
    descEs,
    descEn,
    pEs,
    pEn,
    pitfallEs,
    pitfallEn,
    resourcesEs,
    resourcesEn,
  } = row;
  const dir = path.join(lessonsDir, module, slug);
  const esPath = path.join(dir, "es.mdx");
  const enPath = path.join(dir, "en.mdx");
  if (!force && fs.existsSync(esPath)) {
    skipped += 1;
    continue;
  }
  fs.mkdirSync(dir, { recursive: true });
  const pit =
    pitfallEs || pitfallEn
      ? { es: pitfallEs ?? DEF_PIT.es, en: pitfallEn ?? DEF_PIT.en }
      : null;
  const res =
    resourcesEs || resourcesEn
      ? { es: resourcesEs ?? DEF_RES.es, en: resourcesEn ?? DEF_RES.en }
      : null;
  const esOut =
    fm({
      title: titleEs,
      description: descEs,
      level,
      order,
    }) + body(titleEs, pEs, "es", pit, res);
  const enOut =
    fm({
      title: titleEn,
      description: descEn,
      level,
      order,
    }) + body(titleEn, pEn, "en", pit, res);
  fs.writeFileSync(esPath, esOut, "utf8");
  fs.writeFileSync(enPath, enOut, "utf8");
  written += 1;
}

console.log(
  `Qida seed: ${written} lesson dirs written, ${skipped} skipped (use --force to overwrite).`,
);
