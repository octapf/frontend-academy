export type LearnModuleMeta = {
  slug: string;
  title: string;
  description: string;
};

/** Orden y metadatos de módulos en Learn (única fuente de verdad). */
export const LEARN_MODULES: LearnModuleMeta[] = [
  {
    slug: "react",
    title: "React",
    description: "Componentes, hooks, rendering.",
  },
  {
    slug: "typescript",
    title: "TypeScript",
    description: "Tipos, narrowing, DX.",
  },
  {
    slug: "styles",
    title: "Styles (CSS)",
    description: "Layout, responsive, cascade.",
  },
  {
    slug: "vocab",
    title: "Vocab (Glossary + Slang)",
    description: "Términos y jerga con práctica rápida.",
  },
  {
    slug: "testing",
    title: "Testing",
    description: "Jest + RTL, strategy, mocks.",
  },
  {
    slug: "architecture",
    title: "Architecture",
    description: "Trade-offs, patterns, microfrontends.",
  },
];
