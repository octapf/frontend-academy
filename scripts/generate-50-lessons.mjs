#!/usr/bin/env node
/**
 * Genera 50 lecciones (es.mdx + en.mdx) con estructura pedagógica fija.
 * Por defecto no sobrescribe si existe `es.mdx`. Pasá `--force` para regenerar.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const lessonsDir = path.join(root, "content", "lessons");
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

function fm({ title, description, level, order }) {
  return `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
level: ${level}
order: ${order}
---

`;
}

/** @type {Array<{module:string;slug:string;order:number;level:string;titleEs:string;titleEn:string;descEs:string;descEn:string;pEs:string[];pEn:string[]}>} */
const LESSONS = [
  // —— React (15) ——
  {
    module: "react",
    slug: "streaming-ssr-overview",
    order: 15,
    level: "senior",
    titleEs: "Streaming SSR (idea general)",
    titleEn: "Streaming SSR (overview)",
    descEs: "HTML progresivo y percepción de velocidad.",
    descEn: "Progressive HTML and perceived speed.",
    pEs: [
      "El servidor puede empezar a enviar HTML antes de tener toda la página lista, mejorando el first paint.",
      "En frameworks modernos el detalle varía; el concepto útil es **dividir trabajo** entre server y cliente.",
    ],
    pEn: [
      "The server can start sending HTML before the whole page is ready, improving first paint.",
      "Details vary by framework; the useful idea is **splitting work** between server and client.",
    ],
  },
  {
    module: "react",
    slug: "suspense-data-patterns",
    order: 16,
    level: "senior",
    titleEs: "Suspense y datos (patrones)",
    titleEn: "Suspense and data (patterns)",
    descEs: "Fallbacks y límites de responsabilidad.",
    descEn: "Fallbacks and responsibility boundaries.",
    pEs: [
      "Suspense agrupa regiones que pueden “esperar” recursos; el fallback debe ser **accesible** y no parpadear sin control.",
      "Definí qué capa posee el fetch y cómo se invalida el cache para evitar estados imposibles.",
    ],
    pEn: [
      "Suspense groups regions that can wait for resources; fallbacks should be **accessible** and avoid uncontrolled flicker.",
      "Define which layer owns fetching and how cache invalidation works to avoid impossible UI states.",
    ],
  },
  {
    module: "react",
    slug: "use-id-accessibility",
    order: 17,
    level: "junior",
    titleEs: "`useId` y accesibilidad",
    titleEn: "`useId` and accessibility",
    descEs: "IDs estables para aria y formularios.",
    descEn: "Stable ids for aria and forms.",
    pEs: [
      "`useId` genera identificadores únicos por instancia de componente, útiles para `aria-labelledby` sin colisiones en Strict Mode.",
      "Evitá concatenar índices de map como id global; rompe con reordenamiento.",
    ],
    pEn: [
      "`useId` generates per-component-instance unique ids, useful for `aria-labelledby` without collisions in Strict Mode.",
      "Avoid concatenating map indexes as global ids; reordering breaks assumptions.",
    ],
  },
  {
    module: "react",
    slug: "use-deferred-value",
    order: 18,
    level: "mid",
    titleEs: "`useDeferredValue`",
    titleEn: "`useDeferredValue`",
    descEs: "Mantener la UI responsiva ante entradas pesadas.",
    descEn: "Keep UI responsive under heavy input.",
    pEs: [
      "Diferís el valor “visible” para que React pueda priorizar input inmediato y reconciliar trabajo pesado después.",
      "No es debounce manual: el comportamiento depende de prioridades concurrentes.",
    ],
    pEn: [
      "You defer the “visible” value so React can prioritize immediate typing and reconcile heavier work afterward.",
      "It is not a manual debounce: behavior depends on concurrent priorities.",
    ],
  },
  {
    module: "react",
    slug: "use-transition-basics",
    order: 19,
    level: "mid",
    titleEs: "`useTransition` (intro)",
    titleEn: "`useTransition` (intro)",
    descEs: "Marcar actualizaciones como no urgentes.",
    descEn: "Mark updates as non-urgent.",
    pEs: [
      "`startTransition` permite decir: esta actualización de estado puede esperar si hay algo más urgente (p. ej. typing).",
      "Mostrá `isPending` en UI para feedback honesto.",
    ],
    pEn: [
      "`startTransition` says: this state update can wait if something more urgent is happening (e.g. typing).",
      "Surface `isPending` in UI for honest feedback.",
    ],
  },
  {
    module: "react",
    slug: "strict-mode-effects",
    order: 20,
    level: "junior",
    titleEs: "Strict Mode y effects dobles",
    titleEn: "Strict Mode and double effects",
    descEs: "Por qué tu effect corre dos veces en desarrollo.",
    descEn: "Why your effect runs twice in development.",
    pEs: [
      "En desarrollo React puede montar/desmontar/montar para encontrar **cleanup incompleto**.",
      "Si tu effect no es idempotente, fallará también con navegaciones rápidas en prod.",
    ],
    pEn: [
      "In development React may mount/unmount/remount to find **incomplete cleanup**.",
      "If your effect is not idempotent, fast navigations in prod will also break it.",
    ],
  },
  {
    module: "react",
    slug: "compound-components",
    order: 21,
    level: "mid",
    titleEs: "Compound components",
    titleEn: "Compound components",
    descEs: "APIs flexibles con subcomponentes coordinados.",
    descEn: "Flexible APIs with coordinated subcomponents.",
    pEs: [
      "Patrón: `Select`, `Select.Trigger`, `Select.Panel` comparten estado interno sin prop drilling masivo.",
      "Comunicación vía context interno o render props según complejidad.",
    ],
    pEn: [
      "Pattern: `Select`, `Select.Trigger`, `Select.Panel` share internal state without massive prop drilling.",
      "Use internal context or render props depending on complexity.",
    ],
  },
  {
    module: "react",
    slug: "hydration-mismatch-debug",
    order: 22,
    level: "mid",
    titleEs: "Debug de hydration mismatch",
    titleEn: "Debugging hydration mismatches",
    descEs: "HTML servidor ≠ cliente.",
    descEn: "Server HTML ≠ client.",
    pEs: [
      "Causas típicas: `Date.now()`, `Math.random()`, locale distinta, markup condicional por `window`.",
      "Mové fuentes no determinísticas al cliente después de mount o unifica render servidor/cliente.",
    ],
    pEn: [
      "Typical causes: `Date.now()`, `Math.random()`, different locale, conditional markup on `window`.",
      "Move non-deterministic sources to post-mount client rendering or unify server/client output.",
    ],
  },
  {
    module: "react",
    slug: "css-modules-react",
    order: 23,
    level: "junior",
    titleEs: "CSS Modules con React",
    titleEn: "CSS Modules with React",
    descEs: "Clases locales y composición.",
    descEn: "Local classes and composition.",
    pEs: [
      "Los imports `.module.css` generan objetos de clase; renombrá imports si colisionan con variables.",
      "Composición con `composes:` mantiene el cascade bajo control.",
    ],
    pEn: [
      "`.module.css` imports produce class maps; rename imports if they collide with variables.",
      "`composes:` helps keep cascade under control.",
    ],
  },
  {
    module: "react",
    slug: "stylesheet-tradeoffs",
    order: 24,
    level: "mid",
    titleEs: "CSS-in-JS: trade-offs",
    titleEn: "CSS-in-JS trade-offs",
    descEs: "Runtime vs build-time vs clases.",
    descEn: "Runtime vs build-time vs classes.",
    pEs: [
      "Runtime styles aumentan trabajo en cliente; zero-runtime aproxima a CSS tradicional con tipos.",
      "Elegí según bundle budget, SSR y DX del equipo.",
    ],
    pEn: [
      "Runtime styles increase client work; zero-runtime approaches behave closer to typed CSS.",
      "Choose based on bundle budget, SSR, and team DX.",
    ],
  },
  {
    module: "react",
    slug: "virtualized-lists-intro",
    order: 25,
    level: "mid",
    titleEs: "Listas virtualizadas (intro)",
    titleEn: "Virtualized lists (intro)",
    descEs: "Miles de filas sin miles de nodos.",
    descEn: "Thousands of rows without thousands of nodes.",
    pEs: [
      "Solo renderizás ventana visible + overscan; medí altura fija vs dinámica.",
      "Accesibilidad: roles de lista y foco al teclado siguen siendo obligatorios.",
    ],
    pEn: [
      "Render only the visible window + overscan; measure fixed vs dynamic row height.",
      "Accessibility: list roles and keyboard focus still matter.",
    ],
  },
  {
    module: "react",
    slug: "web-workers-ui",
    order: 26,
    level: "senior",
    titleEs: "Web Workers y UI",
    titleEn: "Web Workers and UI",
    descEs: "Pasar trabajo pesado fuera del main thread.",
    descEn: "Move heavy work off the main thread.",
    pEs: [
      "Serialización postMessage tiene costo; troceá datos y evitá objetos gigantes.",
      "Comunicación con hooks: guardá refs y cancelá workers en cleanup.",
    ],
    pEn: [
      "`postMessage` serialization has a cost; chunk data and avoid huge objects.",
      "Hook communication: store refs and terminate workers in cleanup.",
    ],
  },
  {
    module: "react",
    slug: "route-code-splitting",
    order: 27,
    level: "mid",
    titleEs: "Splitting por rutas",
    titleEn: "Route-level code splitting",
    descEs: "Chunks alineados a navegación.",
    descEn: "Chunks aligned to navigation.",
    pEs: [
      "Agrupá features por ruta para que usuarios casuales no descarguen admin completo.",
      "Preload selectivo en hover/intent reduce latencia percibida.",
    ],
    pEn: [
      "Group features by route so casual users don’t download the full admin bundle.",
      "Selective preload on hover/intent reduces perceived latency.",
    ],
  },
  {
    module: "react",
    slug: "tables-a11y-basics",
    order: 28,
    level: "junior",
    titleEs: "Tablas accesibles (bases)",
    titleEn: "Accessible tables (basics)",
    descEs: "Encabezados y lectores de pantalla.",
    descEn: "Headers and screen readers.",
    pEs: [
      "Usá `th` con `scope` o `headers`/`id` en tablas complejas.",
      "Evitá tablas solo para layout; flex/grid son mejores.",
    ],
    pEn: [
      "Use `th` with `scope` or `headers`/`id` for complex tables.",
      "Avoid tables for layout; flex/grid are better tools.",
    ],
  },
  {
    module: "react",
    slug: "animation-and-react",
    order: 29,
    level: "mid",
    titleEs: "Animación y rendimiento",
    titleEn: "Animation and performance",
    descEs: "Transform y opacity vs layout thrash.",
    descEn: "Transform and opacity vs layout thrash.",
    pEs: [
      "Preferí propiedades que no disparen layout (`transform`, `opacity`).",
      "Listas animadas: cuidado con keys y re-mounts que reinician animaciones.",
    ],
    pEn: [
      "Prefer properties that skip layout (`transform`, `opacity`).",
      "Animated lists: watch keys and remounts that restart animations.",
    ],
  },

  // —— TypeScript (12) ——
  {
    module: "typescript",
    slug: "keyof-typeof-patterns",
    order: 14,
    level: "mid",
    titleEs: "`keyof` + `typeof` en práctica",
    titleEn: "`keyof` + `typeof` in practice",
    descEs: "Tipos desde valores existentes.",
    descEn: "Types from existing values.",
    pEs: [
      "`typeof config` captura la forma de un objeto; `keyof` lista claves permitidas.",
      "Evitá duplicar strings mágicos: derivá unions desde la fuente de verdad.",
    ],
    pEn: [
      "`typeof config` captures an object shape; `keyof` lists allowed keys.",
      "Avoid duplicating magic strings: derive unions from the source of truth.",
    ],
  },
  {
    module: "typescript",
    slug: "template-literal-types",
    order: 15,
    level: "senior",
    titleEs: "Template literal types (intro)",
    titleEn: "Template literal types (intro)",
    descEs: "Tipos que dependen de strings.",
    descEn: "Types that depend on strings.",
    pEs: [
      "Podés modelar rutas `/api/${string}` o event names con unions de plantillas.",
      "Complejidad crece rápido: usalo donde el beneficio sea legibilidad real.",
    ],
    pEn: [
      "You can model paths like `/api/${string}` or event names with template unions.",
      "Complexity grows fast: use it where readability truly wins.",
    ],
  },
  {
    module: "typescript",
    slug: "infer-keyword-intro",
    order: 16,
    level: "senior",
    titleEs: "`infer` en condicionales",
    titleEn: "`infer` in conditional types",
    descEs: "Extraer tipos internos.",
    descEn: "Extract inner types.",
    pEs: [
      "`infer` aparece en `extends` para “capturar” un parámetro de función o ítem de array.",
      "Si el tipo se vuelve ilegible, dividí en alias con nombres claros.",
    ],
    pEn: [
      "`infer` appears inside `extends` to “capture” a function parameter or array item.",
      "If types become unreadable, split into well-named aliases.",
    ],
  },
  {
    module: "typescript",
    slug: "tsconfig-practical",
    order: 17,
    level: "junior",
    titleEs: "`tsconfig` práctico",
    titleEn: "Practical `tsconfig`",
    descEs: "Flags que más impactan en apps.",
    descEn: "Flags that matter most in apps.",
    pEs: [
      "`strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax` cambian el día a día.",
      "Alineá `moduleResolution` con tu bundler (Node16/Bundler).",
    ],
    pEn: [
      "`strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax` change day-to-day ergonomics.",
      "Align `moduleResolution` with your bundler (Node16/Bundler).",
    ],
  },
  {
    module: "typescript",
    slug: "declaration-merging-caution",
    order: 18,
    level: "mid",
    titleEs: "Declaration merging: cautela",
    titleEn: "Declaration merging: caution",
    descEs: "Cuando dos declaraciones se suman.",
    descEn: "When two declarations combine.",
    pEs: [
      "Útil para ambientar librerías; peligroso si el equipo no entiende el orden de carga.",
      "Preferí módulos explícitos en código de producto.",
    ],
    pEn: [
      "Useful for augmenting libraries; risky if the team doesn’t understand load order.",
      "Prefer explicit modules in product code.",
    ],
  },
  {
    module: "typescript",
    slug: "namespace-modules-legacy",
    order: 19,
    level: "mid",
    titleEs: "`namespace` (legado)",
    titleEn: "`namespace` (legacy)",
    descEs: "Cuándo aún lo ves.",
    descEn: "Where you still see it.",
    pEs: [
      "TypeScript `namespace`/`module` antiguos conviven en código generado o libs viejas.",
      "En código nuevo preferí ES modules + `import type`.",
    ],
    pEn: [
      "Legacy TS `namespace`/`module` appears in older generated code or libraries.",
      "In new code prefer ES modules + `import type`.",
    ],
  },
  {
    module: "typescript",
    slug: "optional-chaining-nullish",
    order: 20,
    level: "junior",
    titleEs: "`?.` y `??`",
    titleEn: "Optional chaining and nullish coalescing",
    descEs: "Menos `&&` ruidosos.",
    descEn: "Fewer noisy `&&` chains.",
    pEs: [
      "`?.` corta en `null`/`undefined`; no confundas con truthiness (0 o '').",
      "`??` solo cae en `null`/`undefined`, distinto de `||`.",
    ],
    pEn: [
      "`?.` short-circuits on `null`/`undefined`; don’t confuse with truthiness (`0` or '').",
      "`??` only falls back on `null`/`undefined`, unlike `||`.",
    ],
  },
  {
    module: "typescript",
    slug: "index-access-types",
    order: 21,
    level: "mid",
    titleEs: "Index access types (`T['k']`)",
    titleEn: "Index access types (`T['k']`)",
    descEs: "Extraer tipos de propiedades.",
    descEn: "Extract property types.",
    pEs: [
      "`User['id']` devuelve el tipo de esa propiedad; combina con `keyof` para unions de valores.",
      "Útil para APIs donde el backend devuelve un subset documentado.",
    ],
    pEn: [
      "`User['id']` returns that property’s type; combine with `keyof` for value unions.",
      "Useful when backends return a documented subset.",
    ],
  },
  {
    module: "typescript",
    slug: "recursive-types-intro",
    order: 22,
    level: "senior",
    titleEs: "Tipos recursivos (intro)",
    titleEn: "Recursive types (intro)",
    descEs: "JSON y árboles.",
    descEn: "JSON and trees.",
    pEs: [
      "Modelar árboles con interfaces auto-referenciadas; a veces necesitás `interface` por expansión.",
      "Limitá profundidad en runtime aunque TS compile.",
    ],
    pEn: [
      "Model trees with self-referential interfaces; sometimes `interface` expansion helps.",
      "Limit depth at runtime even if TS compiles.",
    ],
  },
  {
    module: "typescript",
    slug: "symbol-bigint-primitives",
    order: 23,
    level: "mid",
    titleEs: "`symbol` y `bigint`",
    titleEn: "`symbol` and `bigint`",
    descEs: "Primitivos raros en UI.",
    descEn: "Rare primitives in UI.",
    pEs: [
      "`symbol` como keys opacas; serialización JSON los pierde.",
      "`bigint` para IDs grandes; cuidado con JSON y APIs.",
    ],
    pEn: [
      "`symbol` as opaque keys; JSON serialization drops them.",
      "`bigint` for large ids; watch JSON/API compatibility.",
    ],
  },
  {
    module: "typescript",
    slug: "satisfies-vs-as-cast",
    order: 24,
    level: "mid",
    titleEs: "`satisfies` vs `as`",
    titleEn: "`satisfies` vs `as`",
    descEs: "Cuándo cada uno.",
    descEn: "When to use each.",
    pEs: [
      "`satisfies` valida sin ensanchar; `as` fuerza y puede mentir.",
      "Si necesitás escape hatch, documentá por qué en el PR.",
    ],
    pEn: [
      "`satisfies` validates without widening; `as` forces and can lie.",
      "If you need an escape hatch, document why in the PR.",
    ],
  },
  {
    module: "typescript",
    slug: "bundler-types-resolution",
    order: 25,
    level: "mid",
    titleEs: "Resolución de tipos con bundler",
    titleEn: "Bundler type resolution",
    descEs: "`exports`, `types`, condiciones.",
    descEn: "`exports`, `types`, conditions.",
    pEs: [
      "Paquetes modernos exponen `exports` con rutas `types` separadas.",
      "Si algo no resuelve, inspeccioná `package.json` y la matriz de `moduleResolution`.",
    ],
    pEn: [
      "Modern packages expose `exports` with separate `types` paths.",
      "If resolution fails, inspect `package.json` and `moduleResolution` settings.",
    ],
  },

  // —— Testing (8) ——
  {
    module: "testing",
    slug: "playwright-vs-rtl",
    order: 12,
    level: "mid",
    titleEs: "Playwright vs RTL: capas",
    titleEn: "Playwright vs RTL: layers",
    descEs: "Dónde va cada herramienta.",
    descEn: "Where each tool fits.",
    pEs: [
      "RTL valida comportamiento en JSDOM rápido; Playwright valida navegador real y red.",
      "No dupliques la misma aserción en tres capas: elegí la más barata que detecte el bug.",
    ],
    pEn: [
      "RTL validates behavior in fast JSDOM; Playwright validates real browser + network.",
      "Don’t duplicate the same assertion across three layers: pick the cheapest detector.",
    ],
  },
  {
    module: "testing",
    slug: "user-event-keyboard",
    order: 13,
    level: "junior",
    titleEs: "`userEvent` y teclado",
    titleEn: "`userEvent` and keyboard",
    descEs: "Atajos y foco.",
    descEn: "Shortcuts and focus.",
    pEs: [
      "Simulá secuencias realistas (`type`, `keyboard`) en lugar de mutar el DOM a mano.",
      "Verificá que el foco llegue al elemento correcto tras abrir un menú.",
    ],
    pEn: [
      "Simulate realistic sequences (`type`, `keyboard`) instead of mutating the DOM manually.",
      "Verify focus lands on the correct element after opening a menu.",
    ],
  },
  {
    module: "testing",
    slug: "screen-debugging-tips",
    order: 14,
    level: "junior",
    titleEs: "Depurar con `screen`",
    titleEn: "Debugging with `screen`",
    descEs: "Logs útiles sin ruido.",
    descEn: "Useful logs without noise.",
    pEs: [
      "`screen.debug()` imprime el DOM actual; combiná con `logRoles` para descubrir queries.",
      "Si no encontrás rol, revisá si el componente es accesible de verdad.",
    ],
    pEn: [
      "`screen.debug()` prints current DOM; pair with `logRoles` to discover queries.",
      "If you can’t find a role, check whether the component is actually accessible.",
    ],
  },
  {
    module: "testing",
    slug: "custom-render-providers",
    order: 15,
    level: "mid",
    titleEs: "`render` custom con providers",
    titleEn: "Custom `render` with providers",
    descEs: "Router, QueryClient, Theme.",
    descEn: "Router, QueryClient, theme.",
    pEs: [
      "Centralizá wrappers en `test-utils` para no repetir 20 líneas por archivo.",
      "Reseteá stores entre tests para evitar orden dependiente.",
    ],
    pEn: [
      "Centralize wrappers in `test-utils` to avoid repeating 20 lines per file.",
      "Reset stores between tests to avoid order dependence.",
    ],
  },
  {
    module: "testing",
    slug: "msw-handlers-basics",
    order: 16,
    level: "mid",
    titleEs: "MSW: handlers básicos",
    titleEn: "MSW: basic handlers",
    descEs: "Mock HTTP en tests.",
    descEn: "Mock HTTP in tests.",
    pEs: [
      "Interceptá `fetch`/XHR a nivel de worker o node según entorno.",
      "Versioná payloads de ejemplo cerca de los handlers para detectar drift.",
    ],
    pEn: [
      "Intercept `fetch`/XHR at worker or node level depending on environment.",
      "Version example payloads near handlers to detect drift.",
    ],
  },
  {
    module: "testing",
    slug: "testing-hooks-wrappers",
    order: 17,
    level: "mid",
    titleEs: "Testear hooks con wrappers",
    titleEn: "Testing hooks with wrappers",
    descEs: "`renderHook` y act.",
    descEn: "`renderHook` and `act`.",
    pEs: [
      "Encapsulá estado y efectos en un componente mínimo si `renderHook` no alcanza.",
      "Todo update que dispare effects debe vivir dentro de `act` cuando la lib lo requiere.",
    ],
    pEn: [
      "Wrap state/effects in a minimal component if `renderHook` is not enough.",
      "Updates that trigger effects should run inside `act` when the library requires it.",
    ],
  },
  {
    module: "testing",
    slug: "visual-regression-intro",
    order: 18,
    level: "mid",
    titleEs: "Regresión visual (intro)",
    titleEn: "Visual regression (intro)",
    descEs: "Screenshots y diffs.",
    descEn: "Screenshots and diffs.",
    pEs: [
      "Útil para design systems; sensible a fuentes y animaciones.",
      "Estabilizá story states antes de capturar.",
    ],
    pEn: [
      "Useful for design systems; sensitive to fonts and animations.",
      "Stabilize story states before capturing.",
    ],
  },
  {
    module: "testing",
    slug: "property-based-testing-intro",
    order: 19,
    level: "senior",
    titleEs: "Property-based testing (intro)",
    titleEn: "Property-based testing (intro)",
    descEs: "Generar casos al azar.",
    descEn: "Generate random cases.",
    pEs: [
      "Librerías como fast-check buscan contraejemplos mínimos.",
      "Empezá con funciones puras pequeñas antes de UI compleja.",
    ],
    pEn: [
      "Libraries like fast-check shrink failing counterexamples.",
      "Start with small pure functions before complex UI.",
    ],
  },

  // —— Styles (8) ——
  {
    module: "styles",
    slug: "position-sticky-pitfalls",
    order: 10,
    level: "mid",
    titleEs: "`sticky`: trampas comunes",
    titleEn: "`sticky` common pitfalls",
    descEs: "Ancestros con overflow hidden.",
    descEn: "Ancestors with overflow hidden.",
    pEs: [
      "`position: sticky` falla si un ancestro corta overflow o crea contexto extraño.",
      "Inspeccioná la cadena completa con DevTools → computed.",
    ],
    pEn: [
      "`position: sticky` fails if an ancestor clips overflow or creates odd contexts.",
      "Inspect the full chain in DevTools → computed.",
    ],
  },
  {
    module: "styles",
    slug: "scroll-snap-basics",
    order: 11,
    level: "junior",
    titleEs: "Scroll snap (bases)",
    titleEn: "Scroll snap basics",
    descEs: "Carruseles accesibles.",
    descEn: "Accessible carousels.",
    pEs: [
      "`scroll-snap-type` + `scroll-snap-align` mejoran UX táctil.",
      "No reemplaza foco/teclado: seguí reglas de carrusel accesible.",
    ],
    pEn: [
      "`scroll-snap-type` + `scroll-snap-align` improve touch UX.",
      "This does not replace focus/keyboard: follow accessible carousel patterns.",
    ],
  },
  {
    module: "styles",
    slug: "transforms-and-gpu",
    order: 12,
    level: "mid",
    titleEs: "Transforms y capa GPU",
    titleEn: "Transforms and the GPU layer",
    descEs: "Cuándo promover capas.",
    descEn: "When to promote layers.",
    pEs: [
      "`transform` y `opacity` suelen componer bien; abusar de `will-change` consume memoria.",
      "Medí con Performance panel antes de optimizar a ciegas.",
    ],
    pEn: [
      "`transform` and `opacity` usually compose well; abusing `will-change` consumes memory.",
      "Measure with the Performance panel before blind optimization.",
    ],
  },
  {
    module: "styles",
    slug: "whitespace-and-formatting",
    order: 13,
    level: "junior",
    titleEs: "Whitespace y formato",
    titleEn: "Whitespace and formatting",
    descEs: "HTML vs CSS vs inline.",
    descEn: "HTML vs CSS vs inline.",
    pEs: [
      "Espacios entre inline-blocks pueden crear gaps misteriosos.",
      "`white-space`, `word-break` y `overflow-wrap` resuelven textos largos.",
    ],
    pEn: [
      "Whitespace between inline blocks can create mysterious gaps.",
      "`white-space`, `word-break`, and `overflow-wrap` tame long text.",
    ],
  },
  {
    module: "styles",
    slug: "print-stylesheets",
    order: 14,
    level: "mid",
    titleEs: "CSS para impresión",
    titleEn: "Print stylesheets",
    descEs: "`@media print`",
    descEn: "`@media print`",
    pEs: [
      "Ocultá navegación ruidosa; mostrá URLs de links si aporta.",
      "Probá con “Print preview” real, no solo emulación parcial.",
    ],
    pEn: [
      "Hide noisy navigation; show link URLs when helpful.",
      "Test with real print preview, not only partial emulation.",
    ],
  },
  {
    module: "styles",
    slug: "prefers-reduced-motion",
    order: 15,
    level: "junior",
    titleEs: "`prefers-reduced-motion`",
    titleEn: "`prefers-reduced-motion`",
    descEs: "Respetar preferencias del SO.",
    descEn: "Respect OS preferences.",
    pEs: [
      "Desactivá autoplay agresivo y parallax fuerte.",
      "Combiná con toggles manuales en settings de la app.",
    ],
    pEn: [
      "Disable aggressive autoplay and heavy parallax.",
      "Pair with manual toggles in app settings.",
    ],
  },
  {
    module: "styles",
    slug: "color-scheme-dark-light",
    order: 16,
    level: "junior",
    titleEs: "`color-scheme` y dark mode CSS",
    titleEn: "`color-scheme` and CSS dark mode",
    descEs: "Scrollbars y formularios nativos.",
    descEn: "Native scrollbars and forms.",
    pEs: [
      "`color-scheme: dark light` ayuda a controles nativos a seguir el tema.",
      "Complementa con variables CSS, no solo media query.",
    ],
    pEn: [
      "`color-scheme: dark light` helps native controls follow theme.",
      "Complement with CSS variables, not only media queries.",
    ],
  },
  {
    module: "styles",
    slug: "clamp-fluid-typography",
    order: 17,
    level: "mid",
    titleEs: "`clamp()` para tipografía fluida",
    titleEn: "`clamp()` for fluid typography",
    descEs: "Min, preferido, max.",
    descEn: "Min, preferred, max.",
    pEs: [
      "`font-size: clamp(1rem, 2vw, 1.25rem)` evita saltos bruscos entre breakpoints.",
      "Revisá contraste WCAG al mínimo tamaño.",
    ],
    pEn: [
      "`font-size: clamp(1rem, 2vw, 1.25rem)` avoids harsh jumps between breakpoints.",
      "Check WCAG contrast at the minimum size.",
    ],
  },

  // —— Architecture (5) ——
  {
    module: "architecture",
    slug: "bff-pattern-basics",
    order: 8,
    level: "mid",
    titleEs: "BFF (Backend for Frontend)",
    titleEn: "BFF (Backend for Frontend)",
    descEs: "Un backend por experiencia de cliente.",
    descEn: "One backend per client experience.",
    pEs: [
      "El BFF adapta APIs genéricas al shape que la web necesita, reduciendo chatty clients.",
      "Coste: más superficie operada; documentá ownership.",
    ],
    pEn: [
      "A BFF adapts generic APIs to the shape the web needs, reducing chatty clients.",
      "Cost: more operated surface; document ownership.",
    ],
  },
  {
    module: "architecture",
    slug: "graphql-tradeoffs",
    order: 9,
    level: "senior",
    titleEs: "GraphQL: trade-offs",
    titleEn: "GraphQL trade-offs",
    descEs: "Flexibilidad vs coste.",
    descEn: "Flexibility vs cost.",
    pEs: [
      "Queries profundas pueden pegarle al performance si no hay límites ni DataLoader.",
      "Versionado y caching HTTP son distintos a REST clásico.",
    ],
    pEn: [
      "Deep queries can hurt performance without limits or DataLoader patterns.",
      "Versioning and HTTP caching differ from classic REST.",
    ],
  },
  {
    module: "architecture",
    slug: "websocket-reconnect",
    order: 10,
    level: "mid",
    titleEs: "WebSockets: reconexión",
    titleEn: "WebSockets: reconnection",
    descEs: "Backoff y estado.",
    descEn: "Backoff and state.",
    pEs: [
      "Implementá jitter en reconexión para evitar thundering herd.",
      "Definí qué mensajes son idempotentes al replay.",
    ],
    pEn: [
      "Add jitter on reconnect to avoid thundering herds.",
      "Define which messages are idempotent on replay.",
    ],
  },
  {
    module: "architecture",
    slug: "offline-first-intro",
    order: 11,
    level: "senior",
    titleEs: "Offline-first (intro)",
    titleEn: "Offline-first (intro)",
    descEs: "Colas y conflictos.",
    descEn: "Queues and conflicts.",
    pEs: [
      "Persistí operaciones pendientes y sincronizá con estrategia last-write-wins o CRDT según dominio.",
      "La UI debe comunicar estado de sync honestamente.",
    ],
    pEn: [
      "Persist pending operations and sync with last-write-wins or CRDTs depending on domain.",
      "UI must communicate sync state honestly.",
    ],
  },
  {
    module: "architecture",
    slug: "service-worker-updates",
    order: 12,
    level: "mid",
    titleEs: "Service worker: actualizaciones",
    titleEn: "Service worker updates",
    descEs: "Nuevas versiones sin atascar usuarios.",
    descEn: "New versions without trapping users.",
    pEs: [
      "Escuchá `waiting` worker y ofrecé “Actualizar” explícito.",
      "Invalidá caches versionados por hash de build.",
    ],
    pEn: [
      "Listen for `waiting` worker and offer an explicit “Refresh”.",
      "Version caches by build hash.",
    ],
  },

  // —— Vocab (2) ——
  {
    module: "vocab",
    slug: "pr-review-phrases",
    order: 3,
    level: "junior",
    titleEs: "Frases útiles en code review",
    titleEn: "Useful code review phrases",
    descEs: "ES/EN corto para PRs.",
    descEn: "Short ES/EN for PRs.",
    pEs: [
      "**nit:** detalle menor. **blocking:** no mergear hasta resolver.",
      "**LGTM** (looks good to me): aprobación informal; definí si alcanza o hace falta checklist formal.",
    ],
    pEn: [
      "**nit:** small detail. **blocking:** do not merge until resolved.",
      "**LGTM** (looks good to me): informal approval; define whether a formal checklist is still required.",
    ],
  },
  {
    module: "vocab",
    slug: "standup-status-words",
    order: 4,
    level: "junior",
    titleEs: "Standup: estados en inglés",
    titleEn: "Standup status words",
    descEs: "On track, blocked, carry-over.",
    descEn: "On track, blocked, carry-over.",
    pEs: [
      "**On track** / **in progress** / **blocked** / **at risk** son señales claras para el equipo remoto.",
      "**Carry-over**: trabajo que pasa al próximo sprint sin vergüenza, con motivo.",
    ],
    pEn: [
      "**On track** / **in progress** / **blocked** / **at risk** are clear signals for remote teams.",
      "**Carry-over**: work moving to the next sprint, with a reason—no shame, just visibility.",
    ],
  },
];

function body(title, paras, lang) {
  const s = SECTION[lang];
  const [first, second] = paras;
  const practiceBullets =
    lang === "es"
      ? `- Anotá **un caso real** de tu repo donde este tema apareció (o debería haber aparecido).\n- Si aplica, usá **DevTools** (red, consola, performance, layout) para conectar el concepto con lo observable.`
      : `- Write down **one real case** from your repo where this topic showed up (or should have).\n- When relevant, use **DevTools** (network, console, performance, layout) to connect the idea to what you can observe.`;
  const pitfall =
    lang === "es"
      ? "Copiar el snippet sin adaptar convenciones del equipo (nombres, capas, tests, accesibilidad)."
      : "Copying snippets without adapting team conventions (names, layers, tests, accessibility).";
  const res =
    lang === "es"
      ? `- [MDN Web Docs](https://developer.mozilla.org/es/)\n- Documentación oficial de React, TypeScript o tu bundler, según el tema.`
      : `- [MDN Web Docs](https://developer.mozilla.org/en-US/)\n- Official docs for React, TypeScript, or your bundler, depending on the topic.`;

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

let created = 0;
let skipped = 0;
let overwritten = 0;

for (const L of LESSONS) {
  const dir = path.join(lessonsDir, L.module, L.slug);
  const esPath = path.join(dir, "es.mdx");
  const existed = fs.existsSync(esPath);
  if (existed && !force) {
    skipped += 1;
    continue;
  }
  fs.mkdirSync(dir, { recursive: true });
  const es = fm({
    title: L.titleEs,
    description: L.descEs,
    level: L.level,
    order: L.order,
  }) + body(L.titleEs, L.pEs, "es");
  const en = fm({
    title: L.titleEn,
    description: L.descEn,
    level: L.level,
    order: L.order,
  }) + body(L.titleEn, L.pEn, "en");
  fs.writeFileSync(esPath, es, "utf8");
  fs.writeFileSync(path.join(dir, "en.mdx"), en, "utf8");
  if (existed && force) overwritten += 1;
  else created += 1;
}

console.log(
  `Lessons written: ${created + overwritten} (new: ${created}, overwritten: ${overwritten}), skipped: ${skipped}. Force=${force}`
);
