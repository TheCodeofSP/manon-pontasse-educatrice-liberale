import { useState } from "react";
import { FiCheckCircle, FiCopy, FiMail, FiPhone } from "react-icons/fi";
import PropTypes from "prop-types";
import ServiceArea from "../ServiceArea.jsx";
import {
  serviceAreaCenter,
  serviceAreaCities,
  serviceAreaPolygon,
  serviceAreaZoom,
} from "../../data/serviceAreaMapData.js";
import { trackContactClick } from "../../lib/analytics.js";

const emergencyNumbers = [
  "15 – SAMU",
  "17 – Police secours",
  "18 – Pompiers",
  "112 – Numéro d’urgence européen",
  "114 – Urgence par SMS ou application pour les personnes sourdes ou malentendantes",
  "3114 – Soutien psychologique (24h/24)",
];

const normalizePhone = (value) => String(value || "").replace(/\s/g, "");

export default function ContactDetails({ methods }) {
  const [copied, setCopied] = useState("");

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      window.setTimeout(() => setCopied(""), 1200);
    } catch {
      // La copie est une aide facultative : les coordonnées restent accessibles.
    }
  };

  return (
    <aside className="contact__side">
      <div className="contact__sideCard">
        <h2 className="contact__h2">Coordonnées</h2>

        <div className="contact__methods">
          {methods.map((method) => {
            const isEmail = method.type === "email";
            const isPhone = method.type === "phone";
            const Icon = isEmail ? FiMail : isPhone ? FiPhone : FiCheckCircle;
            const href = isEmail
              ? `mailto:${method.value}`
              : isPhone
                ? `tel:${normalizePhone(method.value)}`
                : undefined;

            return (
              <div key={`${method.type}-${method.value}`} className="contact__method">
                <div className="contact__methodIcon" aria-hidden="true">
                  <Icon />
                </div>

                <div className="contact__methodBody">
                  <p className="contact__methodLabel">{method.label}</p>
                  {href ? (
                    <a
                      className="contact__methodValue"
                      href={href}
                      onClick={() =>
                        trackContactClick(
                          isEmail ? "email" : "phone",
                          "contact_details",
                        )
                      }
                    >
                      {method.value}
                    </a>
                  ) : (
                    <p className="contact__methodValue">{method.value}</p>
                  )}
                </div>

                <button
                  type="button"
                  className="contact__copy"
                  onClick={() => handleCopy(method.value)}
                  aria-label={`Copier ${method.label}`}
                  title="Copier"
                >
                  <FiCopy />
                  <span className="contact__copyText">
                    {copied === method.value ? "Copié" : "Copier"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="contact__note">
          <p>En cas d’urgence, contactez les services adaptés :</p>
          <ul>
            {emergencyNumbers.map((number) => (
              <li key={number}>{number}</li>
            ))}
          </ul>
        </div>
      </div>

      <ServiceArea
        variant="highlight"
        showMap
        mapMode="zone"
        zoneCities={serviceAreaCities}
        zonePolygon={serviceAreaPolygon}
        zoneCenter={serviceAreaCenter}
        zoneZoom={serviceAreaZoom}
        showCityList
        collapsibleCityList
        defaultCityListOpen={false}
        cityListLabel="Voir les communes desservies"
        cityListCloseLabel="Masquer les communes desservies"
        mapNote="Carte indicative de la zone d’intervention à Strasbourg, dans l’Eurométropole Sud et jusqu’au secteur d’Erstein."
      />
    </aside>
  );
}

ContactDetails.propTypes = {
  methods: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
};
