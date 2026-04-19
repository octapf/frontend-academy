import { render, screen } from "@testing-library/react";

import { Callout } from "@/components/mdx/Callout";

describe("Callout", () => {
  it("renders title and children", () => {
    render(
      <Callout title="Nota">
        <span>Contenido</span>
      </Callout>
    );
    expect(screen.getByText("Nota")).toBeInTheDocument();
    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });
});
