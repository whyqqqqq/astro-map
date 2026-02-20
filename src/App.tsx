import { useState } from 'react';
import BirthDetailsForm from './components/BirthDetailsForm';
import AstroMap from './components/AstroMap';
import { BirthDetails, PlanetaryLine } from './types/astro';
import { calculatePlanetaryLines } from './utils/astroCalculations';
import { supabase } from './utils/supabase';
import './App.css';

function App() {
  const [planetaryLines, setPlanetaryLines] = useState<PlanetaryLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleSubmit = async (birthDetails: BirthDetails) => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const lines = calculatePlanetaryLines(birthDetails);
      setPlanetaryLines(lines);
      setShowMap(true);

      await supabase.from('astro_calculations').insert({
        birth_date: birthDetails.date,
        birth_time: birthDetails.time,
        birth_location: birthDetails.location,
        latitude: birthDetails.latitude,
        longitude: birthDetails.longitude,
        planetary_lines: lines,
      });
    } catch (error) {
      console.error('Error calculating planetary lines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setShowMap(false);
    setPlanetaryLines([]);
  };

  return (
    <div className="app">
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="content">
        {!showMap ? (
          <BirthDetailsForm onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <>
            <button className="reset-button" onClick={handleReset}>
              ← New Calculation
            </button>
            <AstroMap planetaryLines={planetaryLines} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
