import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSelector = ({ isMobile = false }) => {
  const { language, setLanguage, SUPPORTED_LANGUAGES } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Globe size={14} /> SELECT LANGUAGE / மொழி
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.65rem',
                borderRadius: '6px',
                border: language === lang.code ? '2px solid var(--primary-green)' : '1px solid var(--border-color)',
                background: language === lang.code ? '#DCFCE7' : '#FFFFFF',
                fontWeight: language === lang.code ? 700 : 500,
                color: language === lang.code ? '#166534' : 'var(--text-dark)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.45rem 0.85rem',
          borderRadius: '20px',
          border: '1.5px solid #86EFAC',
          background: '#F0FDF4',
          color: '#166534',
          fontWeight: 700,
          fontSize: '0.88rem',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(22,101,52,0.1)',
          transition: 'all 0.15s ease'
        }}
        title="Change Language / மொழி மாற்றுக"
      >
        <Globe size={16} style={{ color: '#166534' }} />
        <span>🌐 {activeLangObj.name}</span>
        <ChevronDown size={14} style={{ color: '#166534' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.4rem',
            width: '200px',
            background: '#FFFFFF',
            borderRadius: '10px',
            border: '1.5px solid var(--border-color)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.18)',
            zIndex: 1050,
            overflow: 'hidden',
            padding: '0.4rem'
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.35rem 0.65rem 0.2rem 0.65rem' }}>
            SELECT LANGUAGE / மொழி
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.55rem 0.65rem',
                border: 'none',
                borderRadius: '6px',
                background: language === lang.code ? '#DCFCE7' : 'transparent',
                color: language === lang.code ? '#166534' : 'var(--text-dark)',
                fontWeight: language === lang.code ? 800 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s ease'
              }}
            >
              <span style={{ fontSize: '1rem' }}>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
