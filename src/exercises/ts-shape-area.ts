import type { TsExercise } from "@/exercises/types";

export const tsShapeAreaExercise: TsExercise = {
  id: "ts-shape-area",
  kind: "typescript",
  title: {
    es: "Área con discriminated unions",
    en: "Area with discriminated unions",
  },
  description: {
    es: "Implementá `area` para calcular el área de un shape y que sea exhaustivo.",
    en: "Implement `area` to compute a shape area with exhaustiveness.",
  },
  hints: [
    {
      es: "Usá un `switch (shape.kind)`.",
      en: "Use a `switch (shape.kind)`.",
    },
    {
      es: "Para exhaustividad: `const _exhaustive: never = shape` en default.",
      en: "For exhaustiveness: `const _exhaustive: never = shape` in default.",
    },
  ],
  starter: `type Circle = { kind: "circle"; r: number };
type Rect = { kind: "rect"; w: number; h: number };
type Shape = Circle | Rect;

function area(shape: Shape): number {
  return 0;
}
`,
};

