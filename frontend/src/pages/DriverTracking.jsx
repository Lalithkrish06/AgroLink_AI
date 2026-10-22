import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../services/api';
import { Truck, MapPin, CheckCircle2, Navigation, Radio } from 'lucide-react';

const DriverTracking = () => {
  const [orderId, setOrderId] = useState('ORD-2026-001');
  const [driverStatus, setDriverStatus] = useState('In Transit');
  const [isLiveGPS, setIsLiveGPS] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [coords, setCoords] = useState({ lat: 11.341, lng: 77.7172 });

  const handleStatusUpdate = async (newStatus) => {
    setDriverStatus(newStatus);
    setStatusMsg(`Status updated to: "${newStatus}"! Notification sent to Farmer & Buyer.`);
    try {
      await API.put(`/driver/${orderId}/status`, { status: newStatus });
    } catch (e) {}

    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleToggleGPS = () => {
    if (!isLiveGPS) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setCoords({ lat, lng });
            setIsLiveGPS(true);
            setStatusMsg('📍 Live GPS tracking started! Location broadcasting to Farmer & Buyer map.');

            try {
              await API.post('/driver/location', {
                orderId,
                latitude: lat,
                longitude: lng,
                speed: 35
              });
            } catch (e) {}
          },
          () => {
            // Fallback default coordinates if denied
            setCoords({ lat: 11.341, lng: 77.7172 });
            setIsLiveGPS(true);
            setStatusMsg('📍 Live GPS tracking active (Demo location mode).');
          }
        );
      } else {
        setIsLiveGPS(true);
      }
    } else {
      setIsLiveGPS(false);
      setStatusMsg('GPS location sharing stopped.');
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '640px', margin: '0 auto', width: '100%' }}>
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: '#DCFCE7', borderRadius: '50%', color: '#166534', marginBottom: '0.75rem' }}>
            <Truck size={32} />
          </div>

          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>Driver Logistics Control Panel</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Rajesh Driver | Vehicle: <strong>TN 33 AB 1234</strong> (Mini Truck 14ft)
          </p>

          <div style={{ background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '1rem', fontSize: '0.9rem' }}>
            Order ID: <strong>{orderId}</strong> | Current Status: <span className="badge badge-success">{driverStatus}</span>
          </div>
        </div>

        {statusMsg && (
          <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #86EFAC', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} /> {statusMsg}
          </div>
        )}

        {/* Live GPS Broadcast Button */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', border: isLiveGPS ? '2px solid #22C55E' : '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Live GPS Location Sharing</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Broadcast real-time coordinates to the Farmer and Buyer map tracker.
          </p>

          <button
            className={`btn ${isLiveGPS ? 'btn-secondary' : 'btn-primary'} btn-lg`}
            onClick={handleToggleGPS}
            style={{ width: '100%', gap: '0.5rem' }}
          >
            <Radio size={20} className={isLiveGPS ? 'animate-pulse' : ''} />
            {isLiveGPS ? '⏹️ Stop Live Location' : '📍 Start Live Location'}
          </button>

          {isLiveGPS && (
            <div style={{ fontSize: '0.8rem', color: '#15803D', marginTop: '0.75rem', fontWeight: 600 }}>
              Broadcasting: Lat {coords.lat.toFixed(4)}, Lng {coords.lng.toFixed(4)}
            </div>
          )}
        </div>

        {/* Journey Progress Action Buttons */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>Update Delivery Progress</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={() => handleStatusUpdate('Driver On The Way')}>
              🚚 1. Start Journey / On The Way
            </button>
            <button className="btn btn-outline" onClick={() => handleStatusUpdate('Arrived At Farm')}>
              🌾 2. Arrived At Farm
            </button>
            <button className="btn btn-outline" onClick={() => handleStatusUpdate('Product Picked Up')}>
              📦 3. Product Picked Up
            </button>
            <button className="btn btn-primary" onClick={() => handleStatusUpdate('In Transit')}>
              🚛 4. Start Delivery (In Transit)
            </button>
            <button className="btn btn-primary" onClick={() => handleStatusUpdate('Delivery Completed')}>
              ✅ 5. Complete Delivery
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DriverTracking;
