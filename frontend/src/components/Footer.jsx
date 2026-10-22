import React from 'react';
import { Sprout } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Sprout size={20} style={{ color: 'var(--primary-green)' }} />
        <strong style={{ color: 'var(--text-dark)' }}>AgroLink AI</strong>
      </div>
      <p>
        AgroLink AI helps farmers make better selling decisions by comparing markets and connecting them with suitable buyers.
      </p>
      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        Smart India Hackathon (SIH) Prototype Demonstration
      </div>
    </footer>
  );
};

export default Footer;
