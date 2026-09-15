import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export default function ProcessTimeline({ steps }) {
  const [flipped, setFlipped] = useState({});
  const [maxCardHeight, setMaxCardHeight] = useState(240);
  const frontRefs = useRef([]);
  const backRefs = useRef([]);
  const itemRefs = useRef([]);

  const toggleFlip = (index) => {
    setFlipped((current) => ({ ...current, [index]: !current[index] }));
  };

  useLayoutEffect(() => {
    const measure = () => {
      const heights = [...frontRefs.current, ...backRefs.current]
        .filter(Boolean)
        .map((element) => element.scrollHeight);

      if (heights.length > 0) setMaxCardHeight(Math.max(...heights));
    };

    const animationFrame = requestAnimationFrame(measure);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);

    [...frontRefs.current, ...backRefs.current]
      .filter(Boolean)
      .forEach((element) => observer?.observe(element));
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [steps]);

  useEffect(() => {
    const elements = itemRefs.current.filter(Boolean);
    const isTouch = window.matchMedia?.("(pointer: coarse)").matches;
    if (!elements.length || !isTouch || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-inview", entry.isIntersecting);
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -15% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [steps]);

  return (
    <div className="timeline" aria-label="Étapes de l’accompagnement">
      <div className="timeline__line" aria-hidden="true" />

      {steps.map((step, index) => {
        const number = String(index + 1).padStart(2, "0");
        const title = step?.title ?? "";
        const frontSummary = step?.front?.summary ?? step?.text ?? "";
        const backText = step?.back?.text ?? step?.text ?? "";
        const isFlipped = Boolean(flipped[index]);

        return (
          <article
            key={`${number}-${title}`}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className={[
              "timeline__item",
              index % 2 === 1 ? "is-right" : "is-left",
              isFlipped ? "is-flipped" : "",
              "reveal",
            ].join(" ")}
            style={{ "--delay": `${index * 90}ms` }}
          >
            <div className="timeline__dot" aria-hidden="true">
              {number}
            </div>

            <button
              type="button"
              className="timeline__card"
              onClick={() => toggleFlip(index)}
              aria-pressed={isFlipped}
              aria-label={
                isFlipped ? `Revenir au recto : ${title}` : `Voir le verso : ${title}`
              }
            >
              <div
                className="timeline__cardInner"
                style={{ height: `${maxCardHeight}px` }}
              >
                <div
                  ref={(element) => {
                    frontRefs.current[index] = element;
                  }}
                  className="timeline__face timeline__face--front"
                >
                  <div className="timeline__faceBody">
                    <p className="timeline__eyebrow">Étape {number}</p>
                    <h3 className="process__h3">{title}</h3>
                    {frontSummary && (
                      <p className="process__p process__p--muted">{frontSummary}</p>
                    )}
                  </div>
                  <span className="timeline__tapHint" aria-hidden="true">
                    Voir le détail →
                  </span>
                </div>

                <div
                  ref={(element) => {
                    backRefs.current[index] = element;
                  }}
                  className="timeline__face timeline__face--back"
                >
                  <div className="timeline__faceBody">
                    {backText && (
                      <p className="process__p process__p--muted">{backText}</p>
                    )}
                  </div>
                  <span className="timeline__tapHint" aria-hidden="true">
                    ← Revenir
                  </span>
                </div>
              </div>
            </button>
          </article>
        );
      })}
    </div>
  );
}

ProcessTimeline.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
};
