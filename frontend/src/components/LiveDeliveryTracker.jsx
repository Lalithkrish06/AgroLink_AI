import React, { useState, useEffect } from 'react';
import { Truck, MapPin, CheckCircle2, Phone, ShieldCheck, Navigation } from 'lucide-react';
import API from '../services/api';

const LiveDeliveryTracker = ({ orderId = 'ORD-2026-001' }) => {
  const [assignment, setAssignment] = useState({
    driverName: 'Rajesh Driver',
    driverPhone: '+91 9876543213',
    vehicleNumber: 'TN 33 AB 1234',
    vehicleType: 'Mini Truck 14ft',
    status: 'In Transit'
  });

  const [location, setLocation] = useState({
    latitude: 11.341,
    longitude: 77.7172,
    speed: 35
  });

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const [assignRes, locRes] = await Promise.all([
          API.get(`/orders/${orderId}/driver`),
          API.get(`/driver/location/${orderId}`)
        ]);
        if (assignRes.data) setAssignment(assignRes.data);
        if (locRes.data) setLocation(locRes.data);
      } catch (e) {}
    };

    fetchTracking();
    const interval = setInterval(fetchTracking, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  const steps = [
    'Driver Assigned',
    'Driver On The Way',
    'Arrived At Farm',
    'Product Picked Up',
    'In Transit',
    'Reached Buyer Market',
    'Delivery Completed'
  ];

  const currentIdx = steps.indexOf(assignment.status) !== -1 ? steps.indexOf(assignment.status) : 4;

  return (
    <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', border: '1px solid #86EFAC', background: '#F0FDF4' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontWeight: 800, fontSize: '0.85rem' }}>
            <Truck size={18} /> LIVE DELIVERY TRACKING (# {orderId})
          </div>
          <h3 style={{ fontSize: '1.3rem', color: '#166534', marginTop: '0.2rem' }}>
            Driver Status: <strong>{assignment.status}</strong>
          </h3>
        </div>

        <span className="badge badge-success" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}>
          ● Live GPS Active
        </span>
      </div>

      {/* Progress Pipeline */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        {steps.map((st, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              minWidth: '100px',
              textAlign: 'center',
              padding: '0.5rem 0.25rem',
              borderRadius: 'var(--radius-sm)',
              background: i <= currentIdx ? '#166534' : '#E2E8F0',
              color: i <= currentIdx ? '#FFFFFF' : '#64748B',
              fontSize: '0.72rem',
              fontWeight: 700,
              transition: 'all 0.3s ease'
            }}
          >
            {i <= currentIdx && '✓ '}
            {st}
          </div>
        ))}
      </div>

      {/* Driver Contact & Vehicle Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #BBF7D0', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assigned Driver</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)' }}>{assignment.driverName}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, marginTop: '0.2rem' }}>
            <Phone size={14} /> {assignment.driverPhone}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vehicle Details</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)' }}>{assignment.vehicleNumber}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{assignment.vehicleType}</div>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Speed</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#166534' }}>{location.speed || 35} km/h</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lat: {location.latitude?.toFixed(4)}, Lng: {location.longitude?.toFixed(4)}</div>
        </div>
      </div>

      {/* Interactive Map Simulation Box */}
      <div
        style={{
          height: '180px',
          background: '#E2E8F0',
          borderRadius: 'var(--radius-md)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          border: '1px solid #CBD5E1'
        }}
      >
        {/* Map Background Grid */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: 0.4 }}></div>

        {/* Farmer Location Pin */}
        <div style={{ zIndex: 2, textAlign: 'center' }}>
          <div style={{ background: '#DCFCE7', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #22C55E', fontWeight: 800, color: '#15803D', fontSize: '0.85rem' }}>
            🌾 Farmer Farm (Erode)
          </div>
        </div>

        {/* Live Truck Marker Moving */}
        <div
          style={{
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            transition: 'all 0.5s ease'
          }}
        >
          <div style={{ background: '#166534', color: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            🚚 {assignment.driverName} ({assignment.status})
          </div>
          <span style={{ fontSize: '0.7rem', color: '#1E293B', fontWeight: 700, background: '#FFFFFF', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
            Speed: {location.speed || 35} km/h
          </span>
        </div>

        {/* Buyer Market Pin */}
        <div style={{ zIndex: 2, textAlign: 'center' }}>
          <div style={{ background: '#DBEAFE', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #3B82F6', fontWeight: 800, color: '#1E40AF', fontSize: '0.85rem' }}>
            🏢 Buyer APMC Market (Salem)
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDeliveryTracker;
