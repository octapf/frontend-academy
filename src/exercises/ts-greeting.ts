import type { TsExercise } from "@/exercises/types";

export const tsGreetingExercise: TsExercise = {
  id: "ts-greeting",
  kind: "typescript",
  title: {
    es: "Saludo con plantilla",
    en: "Template string greeting",
  },
  description: {
    es: "Implementá `greeting(name)` para que devuelva exactamente `Hello, ${name}!`.",
    en: "Implement `greeting(name)` so it returns exactly `Hello, ${name}!`.",
  },
  starter: `function greeting(name: string): string {
  return "";
}`,
};
