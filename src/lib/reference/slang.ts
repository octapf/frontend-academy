export type MinTrack = "junior" | "mid" | "senior";

export type SlangEntry = {
  es: string;
  en: string;
  meaning: string;
  minTrack: MinTrack;
};

export const SLANG_ENTRIES: SlangEntry[] = [
  { es: "inestable (test)", en: "flaky", meaning: "Test que a veces falla.", minTrack: "junior" },
  { es: "mezclar ramas", en: "merge", meaning: "Integrar una rama en otra.", minTrack: "junior" },
  { es: "subir a prod", en: "ship", meaning: "Liberar código a producción.", minTrack: "mid" },
  { es: "parche rápido", en: "hotfix", meaning: "Corrección urgente en prod.", minTrack: "mid" },
  { es: "arreglo temporal", en: "workaround", meaning: "Solución no ideal.", minTrack: "senior" },
];

