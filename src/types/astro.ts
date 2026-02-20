export interface BirthDetails {
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
}

export interface PlanetaryLine {
  planet: string;
  type: 'IC' | 'DC' | 'MC' | 'AC';
  coordinates: [number, number][];
  color: string;
  description: string;
}

export interface AstroData {
  birthDetails: BirthDetails;
  planetaryLines: PlanetaryLine[];
}

export const PLANET_INFO: Record<string, { color: string; description: string }> = {
  Sun: {
    color: '#FFD700',
    description: 'Vitality, identity, and self-expression. Where you shine brightest.',
  },
  Moon: {
    color: '#E0E7FF',
    description: 'Emotions, comfort, and inner security. Where you feel at home.',
  },
  Mercury: {
    color: '#87CEEB',
    description: 'Communication, learning, and connections. Where your mind thrives.',
  },
  Venus: {
    color: '#FF69B4',
    description: 'Love, harmony, and aesthetics. Where beauty and relationships flourish.',
  },
  Mars: {
    color: '#FF4500',
    description: 'Action, passion, and drive. Where you feel energized and motivated.',
  },
  Jupiter: {
    color: '#9370DB',
    description: 'Growth, opportunity, and abundance. Where luck and expansion find you.',
  },
  Saturn: {
    color: '#708090',
    description: 'Structure, responsibility, and mastery. Where you build lasting foundations.',
  },
};
