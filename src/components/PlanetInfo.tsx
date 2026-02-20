import { PlanetaryLine } from '../types/astro';
import './PlanetInfo.css';

interface PlanetInfoProps {
  line: PlanetaryLine;
  onClose: () => void;
}

const lineTypeDescriptions: Record<string, string> = {
  IC: 'Imum Coeli - Foundation & Home: Influences your roots, private life, and sense of belonging.',
  DC: 'Descendant - Partnerships: Affects your relationships, partnerships, and how you connect with others.',
  MC: 'Midheaven - Career & Purpose: Impacts your public image, career path, and life direction.',
  AC: 'Ascendant - Identity & Self: Shapes how you appear to others and your approach to life.',
};

export default function PlanetInfo({ line, onClose }: PlanetInfoProps) {
  return (
    <div className="planet-info-overlay" onClick={onClose}>
      <div className="planet-info-card" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="planet-info-header">
          <div
            className="planet-icon"
            style={{
              backgroundColor: line.color,
              boxShadow: `0 0 24px ${line.color}`,
            }}
          ></div>
          <div>
            <h3 className="planet-name">{line.planet}</h3>
            <p className="line-type">{line.type} Line</p>
          </div>
        </div>

        <div className="planet-info-body">
          <div className="info-section">
            <h4>Planetary Energy</h4>
            <p>{line.description}</p>
          </div>

          <div className="info-section">
            <h4>Line Meaning</h4>
            <p>{lineTypeDescriptions[line.type]}</p>
          </div>

          <div className="info-section">
            <h4>What This Means For You</h4>
            <p>
              Along this {line.planet} {line.type} line, the energy of {line.planet.toLowerCase()} is
              particularly strong. Traveling to or living near this line may amplify the qualities
              associated with {line.planet} in the context of your {line.type === 'IC' ? 'home and foundation' :
                line.type === 'DC' ? 'relationships and partnerships' :
                  line.type === 'MC' ? 'career and public life' :
                    'identity and self-expression'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
