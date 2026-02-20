import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PlanetaryLine } from '../types/astro';
import PlanetInfo from './PlanetInfo';
import './AstroMap.css';

interface AstroMapProps {
  planetaryLines: PlanetaryLine[];
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 2);
  }, [center, map]);

  return null;
}

export default function AstroMap({ planetaryLines }: AstroMapProps) {
  const [selectedLine, setSelectedLine] = useState<PlanetaryLine | null>(null);
  const mapRef = useRef<L.Map>(null);

  const groupedLines = planetaryLines.reduce((acc, line) => {
    const key = `${line.planet}-${line.type}`;
    if (!acc[key]) {
      acc[key] = line;
    }
    return acc;
  }, {} as Record<string, PlanetaryLine>);

  return (
    <div className="map-container">
      <div className="map-header">
        <h2 className="map-title">Your Planetary Lines</h2>
        <p className="map-subtitle">Click on any line to learn about its influence</p>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={true}
          className="leaflet-map"
          ref={mapRef}
          minZoom={2}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
        >
          <MapController center={[20, 0]} />

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {Object.values(groupedLines).map((line, index) => (
            <Polyline
              key={`${line.planet}-${line.type}-${index}`}
              positions={line.coordinates}
              pathOptions={{
                color: line.color,
                weight: 3,
                opacity: 0.7,
                className: 'planetary-line',
              }}
              eventHandlers={{
                click: () => setSelectedLine(line),
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    weight: 5,
                    opacity: 1,
                  });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    weight: 3,
                    opacity: 0.7,
                  });
                },
              }}
            >
              <Popup>
                <div className="line-popup">
                  <strong>{line.planet} {line.type}</strong>
                  <p>{line.description}</p>
                </div>
              </Popup>
            </Polyline>
          ))}
        </MapContainer>

        {selectedLine && (
          <PlanetInfo
            line={selectedLine}
            onClose={() => setSelectedLine(null)}
          />
        )}
      </div>

      <div className="legend">
        <h3 className="legend-title">Planetary Lines</h3>
        <div className="legend-items">
          {Object.values(
            planetaryLines.reduce((acc, line) => {
              if (!acc[line.planet]) {
                acc[line.planet] = line;
              }
              return acc;
            }, {} as Record<string, PlanetaryLine>)
          ).map(line => (
            <div
              key={line.planet}
              className="legend-item"
              onClick={() => setSelectedLine(line)}
            >
              <div
                className="legend-color"
                style={{ backgroundColor: line.color }}
              ></div>
              <span className="legend-label">{line.planet}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
