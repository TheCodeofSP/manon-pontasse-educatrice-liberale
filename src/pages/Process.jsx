import { Link } from "react-router-dom";
import PrinciplesGrid from "../components/process/PrinciplesGrid.jsx";
import ProcessTimeline from "../components/process/ProcessTimeline.jsx";
import ServiceArea from "../components/ServiceArea.jsx";
import Signature from "../components/Signature.jsx";
import { useContent } from "../content/useContent.js";
import SEO from "../seo/SEO.jsx";
import "./process.scss";

export default function Process() {
  const { content, error, isLoading, list, node, t } = useContent();
  const base = content?.process ? "process" : "approach";
  const intro = node(`${base}.intro`) ?? {};
  const steps = list(`${base}.content.steps`);
  const principles = list(`${base}.content.principles`);

  const stepsTitle = t(`${base}.ui.stepsTitle`, "Étapes");
  const principlesTitle = t(`${base}.ui.principlesTitle`, "Principes");
  const pricingsTitle = t(`${base}.ui.pricingsTitle`, "Tarifs");
  const pricingsText = t(
    `${base}.ui.pricingsText`,
    "Les tarifs sont modulables selon le type d’intervention défini ensemble. Des aides financières peuvent être possibles. N’hésitez pas à me contacter pour en discuter.",
  );
  const ctaTitle = t(
    `${base}.ui.ctaTitle`,
    "Vous souhaitez échanger sur votre situation ?",
  );
  const ctaText = t(
    `${base}.ui.ctaText`,
    "Décrivez votre situation et vos objectifs : je vous réponds dès que possible.",
  );
  const ctaLabel = t(`${base}.ui.ctaLabel`, "Me contacter");

  if (isLoading || error) {
    return (
      <div className="process">
        <div className="process__content">
          <div className="process__state reveal">
            <p>
              {error ? `Erreur : ${String(error.message || error)}` : "Chargement…"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        path="approach"
        fallbackTitle="Manon Pontasse - Approche"
        fallbackDesc="Découvrez les étapes et principes de l’accompagnement éducatif spécialisé."
      />

      <div className="process">
        <div className="process__content">
          <header
            className="process__hero reveal reveal--up"
            style={{ "--delay": "0ms" }}
          >
            <h1 className="process__title">{intro.title ?? "Mon approche"}</h1>
            {intro.subtitle && <p className="process__kicker">{intro.subtitle}</p>}
            {intro.lead && <p className="process__lead">{intro.lead}</p>}
          </header>

          <div className="reveal" style={{ "--delay": "80ms" }}>
            <ServiceArea variant="highlight" />
          </div>

          <section className="process__section">
            <h2 className="process__h2 reveal" style={{ "--delay": "0ms" }}>
              {stepsTitle}
            </h2>
            <ProcessTimeline steps={steps} />
          </section>

          <section className="process__section">
            <h2 className="process__h2 reveal" style={{ "--delay": "0ms" }}>
              {principlesTitle}
            </h2>
            <PrinciplesGrid principles={principles} />
          </section>

          <section className="process__footerCta reveal" style={{ "--delay": "120ms" }}>
            <div className="process__footerCard">
              <h2 className="process__h2">{pricingsTitle}</h2>
              <p className="process__p process__p--muted">{pricingsText}</p>
            </div>
          </section>

          <section className="process__footerCta reveal" style={{ "--delay": "120ms" }}>
            <div className="process__footerCard">
              <h2 className="process__h2">{ctaTitle}</h2>
              <p className="process__p process__p--muted">{ctaText}</p>
              <Link className="process__btn process__btn--primary" to="/contact">
                {ctaLabel}
              </Link>
            </div>
          </section>
        </div>

        <Signature type="emotional" variant="subtle" />
      </div>
    </>
  );
}
