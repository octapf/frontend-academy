export type LearnModuleMeta = {
  slug: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
};

/**
 * Orden y metadatos de módulos en Learn (única fuente de verdad).
 * Alineado con el stack de preparación (JS/TS, web, React, Next, estado, datos, tests, entrega).
 */
export const LEARN_MODULES: LearnModuleMeta[] = [
  {
    slug: "javascript",
    title: { es: "JavaScript", en: "JavaScript" },
    description: {
      es: "Fundamentos del lenguaje, asincronía y modelo mental para el navegador.",
      en: "Language fundamentals, async, and a browser mental model.",
    },
  },
  {
    slug: "typescript",
    title: { es: "TypeScript", en: "TypeScript" },
    description: { es: "Tipos, narrowing, DX.", en: "Types, narrowing, and DX." },
  },
  {
    slug: "html-css",
    title: { es: "HTML y CSS", en: "HTML & CSS" },
    description: {
      es: "Semántica, accesibilidad base y layout sin depender solo de un framework.",
      en: "Semantics, baseline accessibility, and layout without relying on a single framework.",
    },
  },
  {
    slug: "styles",
    title: { es: "Estilos (CSS)", en: "Styles (CSS)" },
    description: {
      es: "Layout, responsive, cascade, Tailwind y sistemas de diseño.",
      en: "Layout, responsive design, cascade, Tailwind, and design systems.",
    },
  },
  {
    slug: "react",
    title: { es: "React", en: "React" },
    description: { es: "Componentes, hooks, rendering.", en: "Components, hooks, rendering." },
  },
  {
    slug: "nextjs",
    title: { es: "Next.js", en: "Next.js" },
    description: {
      es: "App Router, servidor/cliente, datos, rutas y despliegue.",
      en: "App Router, server/client, data, routing, and deployment.",
    },
  },
  {
    slug: "redux",
    title: { es: "Redux (Toolkit)", en: "Redux (Toolkit)" },
    description: {
      es: "Estado global predecible, store y flujo de datos.",
      en: "Predictable global state, store, and data flow.",
    },
  },
  {
    slug: "zustand",
    title: { es: "Zustand", en: "Zustand" },
    description: {
      es: "Stores ligeros y minimalistas en React.",
      en: "Lightweight, minimal stores for React.",
    },
  },
  {
    slug: "tanstack-query",
    title: { es: "TanStack Query", en: "TanStack Query" },
    description: {
      es: "Cache, sincronización y estado de servidor en React.",
      en: "Caching, synchronization, and server state in React.",
    },
  },
  {
    slug: "testing",
    title: { es: "Testing", en: "Testing" },
    description: {
      es: "Jest + RTL, estrategia, mocks.",
      en: "Jest + RTL, strategy, and mocks.",
    },
  },
  {
    slug: "architecture",
    title: { es: "Arquitectura", en: "Architecture" },
    description: {
      es: "Trade-offs, patrones, seguridad web y calidad de entrega.",
      en: "Trade-offs, patterns, web security, and delivery quality.",
    },
  },
  {
    slug: "git",
    title: { es: "Git", en: "Git" },
    description: {
      es: "Control de versiones y flujo de trabajo diario.",
      en: "Version control and day-to-day workflow.",
    },
  },
  {
    slug: "agile",
    title: { es: "Agile y entrega", en: "Agile & delivery" },
    description: {
      es: "Tableros, ceremonias y colaboración con el equipo.",
      en: "Boards, ceremonies, and team collaboration.",
    },
  },
  {
    slug: "vocab",
    title: { es: "Vocab (glosario + jerga)", en: "Vocab (Glossary + Slang)" },
    description: {
      es: "Términos y jerga con práctica rápida.",
      en: "Quick practice on terms and slang.",
    },
  },
];
