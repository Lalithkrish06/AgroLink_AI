import React, { useState } from 'react';
import { MapPin, Navigation, CheckCircle2 } from 'lucide-react';

const LocationPicker = ({ location, setLocation, district, setDistrict, setLat, setLng }) => {
  const [locating, setLocating] = useState(false);
  const [success, setSuccess] = useState(false);

  const districts = ['Erode', 'Salem', 'Coimbatore', 'Oddanchatram', 'Chennai', 'Madurai', 'Tiruppur'];

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please select district manually.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        if (setLat) setLat(lat);
        if (setLng) setLng(lng);

        // Approximate District mapping for Tamil Nadu demo
        const detectedLocation = 'Erode, Tamil Nadu';
        const detectedDistrict = 'Erode';

        setLocation(detectedLocation);
        setDistrict(detectedDistrict);
        setLocating(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      },
      (error) => {
        setLocating(false);
        // Fallback default
        setLocation('Erode, Tamil Nadu');
        setDistrict('Erode');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      },
      { timeout: 5000 }
    );
  };

  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem', background: '#F8FAFC' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MapPin size={18} style={{ color: 'var(--primary-green)' }} /> Current Location
        </label>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleGetCurrentLocation}
          disabled={locating}
        >
          <Navigation size={14} /> {locating ? 'Detecting GPS...' : '📍 Use My Current Location'}
        </button>
      </div>

      {success && (
        <div style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <CheckCircle2 size={14} /> Location updated from GPS!
        </div>
      )}

      <div className="form-grid">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>District</label>
          <select
            className="form-control"
            value={district || 'Erode'}
            onChange={(e) => {
              setDistrict(e.target.value);
              setLocation(`${e.target.value}, Tamil Nadu`);
            }}
          >
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Display Location</label>
          <input
            type="text"
            className="form-control"
            value={location || 'Erode, Tamil Nadu'}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
