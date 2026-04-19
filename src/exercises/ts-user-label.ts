import type { TsExercise } from "@/exercises/types";

export const tsUserLabelExercise: TsExercise = {
  id: "ts-user-label",
  kind: "typescript",
  title: {
    es: "Etiqueta con Pick",
    en: "Label with Pick",
  },
  description: {
    es: "Completá `userLabel` para que devuelva `nombre <email>` exactamente (usá el tipo `Pick` del parámetro).",
    en: "Complete `userLabel` so it returns `name <email>` exactly (use the parameter’s `Pick` type).",
  },
  starter: `type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};

function userLabel(user: Pick<User, "name" | "email">): string {
  return "";
}`,
};
