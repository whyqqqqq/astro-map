import * as Astronomy from 'astronomy-engine';
import { BirthDetails, PlanetaryLine, PLANET_INFO } from '../types/astro';

export function calculatePlanetaryLines(birthDetails: BirthDetails): PlanetaryLine[] {
  const { date, time, latitude, longitude } = birthDetails;

  const dateTime = new Date(`${date}T${time}`);
  const observer = new Astronomy.Observer(latitude, longitude, 0);

  const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  const lines: PlanetaryLine[] = [];

  planets.forEach(planetName => {
    const body = planetName as Astronomy.Body;

    try {
      const equator = Astronomy.Equator(body, dateTime, observer, true, true);

      const icLine = generateLineCoordinates(equator.dec);
      const dcLine = generateLineCoordinates(90 - equator.dec);
      const mcLine = generateLineCoordinates(equator.dec + 180);
      const acLine = generateLineCoordinates(270 - equator.dec);

      const planetInfo = PLANET_INFO[planetName];

      if (icLine.length > 0) {
        lines.push({
          planet: planetName,
          type: 'IC',
          coordinates: icLine,
          color: planetInfo.color,
          description: planetInfo.description,
        });
      }

      if (mcLine.length > 0) {
        lines.push({
          planet: planetName,
          type: 'MC',
          coordinates: mcLine,
          color: planetInfo.color,
          description: planetInfo.description,
        });
      }

      if (acLine.length > 0) {
        lines.push({
          planet: planetName,
          type: 'AC',
          coordinates: acLine,
          color: adjustColorBrightness(planetInfo.color, -20),
          description: planetInfo.description,
        });
      }

      if (dcLine.length > 0) {
        lines.push({
          planet: planetName,
          type: 'DC',
          coordinates: dcLine,
          color: adjustColorBrightness(planetInfo.color, -20),
          description: planetInfo.description,
        });
      }
    } catch (error) {
      console.error(`Error calculating ${planetName} lines:`, error);
    }
  });

  return lines;
}

function generateLineCoordinates(longitudeDegree: number): [number, number][] {
  const coordinates: [number, number][] = [];
  const normalizedLon = ((longitudeDegree % 360) + 360) % 360;
  const lon = normalizedLon > 180 ? normalizedLon - 360 : normalizedLon;

  for (let lat = -85; lat <= 85; lat += 5) {
    coordinates.push([lat, lon]);
  }

  return coordinates;
}

function adjustColorBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

export async function geocodeLocation(locationName: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
