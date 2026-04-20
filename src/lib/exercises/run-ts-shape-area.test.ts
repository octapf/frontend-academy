import { runTsShapeArea } from "@/lib/exercises/run-ts-shape-area";

describe("runTsShapeArea", () => {
  it("passes for a correct implementation", () => {
    const code = `type Circle = { kind: "circle"; r: number };
type Rect = { kind: "rect"; w: number; h: number };
type Shape = Circle | Rect;
function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.r * shape.r;
    case "rect":
      return shape.w * shape.h;
    default:
      return 0;
  }
}`;
    const res = runTsShapeArea(code);
    expect(res.ok).toBe(true);
  });
});

