import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AnalyticsTracker from "../components/AnalyticsTracker.jsx";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import FloatingActions from "../components/FloatingActions.jsx";
import LocalBusinessJsonLd from "../seo/LocalBusinessJsonLd.jsx";
import CookieConsent from "../components/CookieConsent.jsx";

import { useRevealOnScroll } from "../hooks/useRevealOnScroll.js";

export default function Layout() {
  const { pathname, hash } = useLocation();

  // ✅ Reveal unique
  useRevealOnScroll({
    selector: ".reveal",
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.08,
    once: true,
  });

  // ✅ Scroll to top à chaque navigation
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Aller au contenu principal
      </a>
      <LocalBusinessJsonLd />
      <AnalyticsTracker />
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      <FloatingActions contactTo="/contact" contactLabel="Me contacter" />
      <CookieConsent />
    </>
  );
}
