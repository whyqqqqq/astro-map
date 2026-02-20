import { useState } from 'react';
import { BirthDetails } from '../types/astro';
import { geocodeLocation } from '../utils/astroCalculations';
import './BirthDetailsForm.css';

interface BirthDetailsFormProps {
  onSubmit: (details: BirthDetails) => void;
  isLoading: boolean;
}

export default function BirthDetailsForm({ onSubmit, isLoading }: BirthDetailsFormProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!date || !time || !location) {
      setError('Please fill in all fields');
      return;
    }

    const coords = await geocodeLocation(location);
    if (!coords) {
      setError('Location not found. Please try a different location.');
      return;
    }

    const birthDetails: BirthDetails = {
      date,
      time,
      location,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    onSubmit(birthDetails);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1 className="form-title">Discover Your Astrocartography</h1>
        <p className="form-subtitle">
          Enter your birth details to reveal where in the world different planetary energies influence you most
        </p>
      </div>

      <form onSubmit={handleSubmit} className="birth-form">
        <div className="form-group">
          <label htmlFor="date">Birth Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Birth Time</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Birth Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="City, Country"
            required
            disabled={isLoading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Calculating Your Lines...
            </>
          ) : (
            'Calculate My Lines'
          )}
        </button>
      </form>
    </div>
  );
}
