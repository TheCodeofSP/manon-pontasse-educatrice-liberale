import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../src/components/Navbar.jsx";

afterEach(() => cleanup());

describe("menu mobile", () => {
  it("s’ouvre puis se ferme au clic extérieur", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const burger = screen.getByRole("button", { name: "Ouvrir le menu" });
    await user.click(burger);
    expect(burger.getAttribute("aria-expanded")).toBe("true");

    fireEvent.pointerDown(document.body);
    expect(burger.getAttribute("aria-expanded")).toBe("false");
  });

  it("se ferme avec la touche Échap", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const burger = screen.getByRole("button", { name: "Ouvrir le menu" });
    await user.click(burger);
    await user.keyboard("{Escape}");

    expect(burger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(burger);
  });
});
