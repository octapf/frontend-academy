export type MinTrack = "junior" | "mid" | "senior";

export type GlossaryEntry = {
  term: string;
  definition: string;
  minTrack: MinTrack;
};

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    term: "Closure",
    definition: "Función que recuerda variables de su scope de creación.",
    minTrack: "junior",
  },
  {
    term: "Specificity",
    definition: "Peso de un selector CSS para resolver conflictos.",
    minTrack: "junior",
  },
  {
    term: "Hydration",
    definition: "Adjuntar handlers al HTML renderizado en el server.",
    minTrack: "mid",
  },
  {
    term: "RSC",
    definition: "React Server Component: se renderiza en server, no en cliente.",
    minTrack: "senior",
  },
];

