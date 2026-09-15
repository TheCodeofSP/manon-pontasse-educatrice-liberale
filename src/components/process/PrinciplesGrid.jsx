import { useMemo } from "react";
import PropTypes from "prop-types";
import {
  FiCompass,
  FiHeart,
  FiMessageCircle,
  FiShield,
  FiSmile,
  FiTarget,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

export default function PrinciplesGrid({ principles }) {
  const icons = useMemo(
    () => [
      FiHeart,
      FiUsers,
      FiTarget,
      FiTrendingUp,
      FiSmile,
      FiShield,
      FiCompass,
      FiMessageCircle,
    ],
    [],
  );

  return (
    <div className="principles" role="list">
      {principles.map((text, index) => {
        const Icon = icons[index % icons.length];
        return (
          <article
            key={text}
            className="principleCard reveal"
            role="listitem"
            style={{ "--delay": `${index * 70}ms` }}
          >
            <div className="principleCard__icon" aria-hidden="true">
              <Icon />
            </div>
            <p className="principleCard__text">{text}</p>
          </article>
        );
      })}
    </div>
  );
}

PrinciplesGrid.propTypes = {
  principles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
