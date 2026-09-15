import { useMemo } from "react";
import ContactDetails from "../components/contact/ContactDetails.jsx";
import ContactForm from "../components/contact/ContactForm.jsx";
import Signature from "../components/Signature.jsx";
import { useContent } from "../content/useContent.js";
import SEO from "../seo/SEO.jsx";
import "./contact.scss";

export default function Contact() {
  const { error, isLoading, list, node } = useContent();
  const intro = node("contact.intro") ?? {};
  const methods = list("contact.content.methods");
  const safeMethods = useMemo(() => (Array.isArray(methods) ? methods : []), [methods]);

  if (isLoading) {
    return (
      <main className="contact">
        <div className="contact__container">
          <p>Chargement…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="contact">
        <div className="contact__container">
          <p>Erreur : {String(error.message || error)}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <SEO
        path="contact"
        fallbackTitle="Manon Pontasse - Contact"
        fallbackDesc="Contactez une éducatrice spécialisée en déficience intellectuelle."
      />

      <div className="contact__container">
        <header className="contact__hero">
          <h1 className="contact__title">{intro.title ?? "Me contacter"}</h1>
          {intro.subtitle && <p className="contact__kicker">{intro.subtitle}</p>}
          {intro.lead && <p className="contact__lead">{intro.lead}</p>}
        </header>

        <div className="contact__layout">
          <ContactDetails methods={safeMethods} />
          <ContactForm />
        </div>

        <Signature type="emotional" variant="subtle" />
      </div>
    </>
  );
}
