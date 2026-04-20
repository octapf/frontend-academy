import type { TsExercise } from "@/exercises/types";

export const tsPickKeysExercise: TsExercise = {
  id: "ts-pick-keys",
  kind: "typescript",
  title: {
    es: "Pick de keys (genéricos)",
    en: "Pick keys (generics)",
  },
  description: {
    es: "Implementá `pickKeys` para quedarte solo con las keys pedidas (tipado seguro).",
    en: "Implement `pickKeys` to keep only selected keys (type-safe).",
  },
  hints: [
    {
      es: "Tip: `K extends keyof T` y retorno `Pick<T, K>`.",
      en: "Tip: use `K extends keyof T` and return `Pick<T, K>`.",
    },
    {
      es: "Podés iterar las keys y armar un objeto nuevo.",
      en: "Iterate the keys and build a new object.",
    },
  ],
  starter: `function pickKeys<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return {} as any;
}
`,
};

