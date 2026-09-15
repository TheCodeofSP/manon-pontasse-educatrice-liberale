import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { disableAnalytics, initAnalytics, trackPageView } from "../lib/analytics.js";
import "./cookieConsent.scss";

const STORAGE_KEY = "mp_cookie_consent";
const readChoice = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export default function CookieConsent() {
  const [choice, setChoice] = useState(readChoice);
  const [open, setOpen] = useState(() => !readChoice());
  const firstActionRef = useRef(null);

  useEffect(() => {
    if (choice === "accepted") {
      initAnalytics();
      trackPageView(window.location.pathname + window.location.search);
    } else disableAnalytics();
  }, [choice]);

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener("mp-open-cookie-settings", reopen);
    return () => window.removeEventListener("mp-open-cookie-settings", reopen);
  }, []);

  useEffect(() => {
    if (open && choice) firstActionRef.current?.focus();
  }, [open, choice]);

  const decide = (next) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* choix conservé pour la session */
    }
    setChoice(next);
    setOpen(false);
  };

  if (!open) return null;
  return (
    <section
      className="cookieConsent"
      role="region"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-description"
    >
      <div className="cookieConsent__inner">
        <div className="cookieConsent__copy">
          <h2 id="cookie-title">Votre choix concernant les statistiques</h2>
          <p id="cookie-description">
            Avec votre accord, Google Analytics m’aide à comprendre les pages consultées
            afin d’améliorer le site. Aucun outil de mesure d’audience n’est chargé
            avant votre acceptation. Vous pouvez modifier votre choix à tout moment.
          </p>
          <Link to="/confidentialite">Consulter la politique de confidentialité</Link>
        </div>
        <div className="cookieConsent__actions">
          <button ref={firstActionRef} type="button" onClick={() => decide("rejected")}>
            Tout refuser
          </button>
          <button type="button" onClick={() => decide("accepted")}>
            Tout accepter
          </button>
        </div>
      </div>
    </section>
  );
}
