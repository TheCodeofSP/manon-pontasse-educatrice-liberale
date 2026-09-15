import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CookieConsent from "../../src/components/CookieConsent.jsx";
import {
  disableAnalytics,
  trackContactClick,
  trackEvent,
} from "../../src/lib/analytics.js";

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

  it("mesure les contacts uniquement après acceptation", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CookieConsent />
      </MemoryRouter>,
    );

    const eventsBeforeConsent = window.dataLayer?.length ?? 0;
    trackEvent("generate_lead", { lead_source: "contact_form" });
    expect(window.dataLayer?.length ?? 0).toBe(eventsBeforeConsent);

    await user.click(screen.getByRole("button", { name: "Tout accepter" }));
    await waitFor(() => expect(window.gtag).toBeTypeOf("function"));

    trackEvent("generate_lead", { lead_source: "contact_form" });
    trackContactClick("phone", "footer");

    const events = window.dataLayer.map((entry) => Array.from(entry));
    expect(events).toContainEqual([
      "event",
      "generate_lead",
      { lead_source: "contact_form" },
    ]);
    expect(events).toContainEqual([
      "event",
      "contact_click",
      { contact_method: "phone", link_location: "footer" },
    ]);
  });
});
