import React, { useEffect, useState } from 'react';
import { Sprout } from 'lucide-react';

const LoadingScreen = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 0.5s ease',
        opacity: fade ? 0 : 1,
        pointerEvents: fade ? 'none' : 'auto'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '1.25rem',
            borderRadius: '50%',
            display: 'inline-flex',
            marginBottom: '1rem',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <Sprout size={48} style={{ color: '#86EFAC' }} />
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
          🌾 Agro Link Market
        </h1>
        <p style={{ color: '#A7F3D0', fontSize: '1rem', fontWeight: 500, marginBottom: '2rem' }}>
          Connecting Farmers Directly with the Right Markets
        </p>

        {/* Loading Spinner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderTop: '3px solid #86EFAC',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}
          ></div>
          <span style={{ fontSize: '0.88rem', color: '#D1FAE5', fontWeight: 600 }}>Loading platform...</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
