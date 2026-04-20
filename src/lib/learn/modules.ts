export type LearnModuleMeta = {
  slug: string;
  title: string;
  description: string;
};

/**
 * Orden y metadatos de módulos en Learn (única fuente de verdad).
 * Alineado con el stack de preparación (JS/TS, web, React, Next, estado, datos, tests, entrega).
 */
export const LEARN_MODULES: LearnModuleMeta[] = [
  {
    slug: "javascript",
    title: "JavaScript",
    description: "Fundamentos del lenguaje, asincronía y modelo mental para el navegador.",
  },
  {
    slug: "typescript",
    title: "TypeScript",
    description: "Tipos, narrowing, DX.",
  },
  {
    slug: "html-css",
    title: "HTML & CSS",
    description: "Semántica, accesibilidad base y layout sin depender solo de un framework.",
  },
  {
    slug: "styles",
    title: "Styles (CSS)",
    description: "Layout, responsive, cascade, Tailwind y sistemas de diseño.",
  },
  {
    slug: "react",
    title: "React",
    description: "Componentes, hooks, rendering.",
  },
  {
    slug: "nextjs",
    title: "Next.js",
    description: "App Router, servidor/cliente, datos, rutas y despliegue.",
  },
  {
    slug: "redux",
    title: "Redux (Toolkit)",
    description: "Estado global predecible, store y flujo de datos.",
  },
  {
    slug: "zustand",
    title: "Zustand",
    description: "Stores ligeros y minimalistas en React.",
  },
  {
    slug: "tanstack-query",
    title: "TanStack Query",
    description: "Cache, sincronización y estado de servidor en React.",
  },
  {
    slug: "testing",
    title: "Testing",
    description: "Jest + RTL, strategy, mocks.",
  },
  {
    slug: "architecture",
    title: "Architecture",
    description: "Trade-offs, patrones, seguridad web y calidad de entrega.",
  },
  {
    slug: "git",
    title: "Git",
    description: "Control de versiones y flujo de trabajo diario.",
  },
  {
    slug: "agile",
    title: "Agile & delivery",
    description: "Tableros, ceremonias y colaboración con el equipo.",
  },
  {
    slug: "vocab",
    title: "Vocab (Glossary + Slang)",
    description: "Términos y jerga con práctica rápida.",
  },
];
