import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CookieConsent from "../../src/components/CookieConsent.jsx";
import { disableAnalytics } from "../../src/lib/analytics.js";

afterEach(() => {
  cleanup();
  disableAnalytics();
  localStorage.clear();
});

describe("consentement Analytics", () => {
  it("ne charge Analytics qu’après acceptation", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CookieConsent />
      </MemoryRouter>,
    );

    expect(document.querySelector("script[data-ga-id]")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Tout accepter" }));

    await waitFor(() => {
      expect(document.querySelector("script[data-ga-id]")).not.toBeNull();
    });
    expect(localStorage.getItem("mp_cookie_consent")).toBe("accepted");
  });

  it("ne charge rien après un refus", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CookieConsent />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Tout refuser" }));
    expect(document.querySelector("script[data-ga-id]")).toBeNull();
    expect(localStorage.getItem("mp_cookie_consent")).toBe("rejected");
  });
});
