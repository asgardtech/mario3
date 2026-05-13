import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/components/GameCanvas", () => ({
  GameCanvas: () => <div data-testid="game-canvas" />,
}));

import App from "./App";

describe("App", () => {
  it("renders the project heading", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: /mario/i }),
    ).toBeInTheDocument();
  });
});
