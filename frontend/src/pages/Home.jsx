import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Eye, Sparkles, Users, CheckCircle2, UserPlus, LogIn, Sprout, Building2, Globe } from 'lucide-react';

const Home = () => {
  const { t, language } = useLanguage();
  const [showLoading, setShowLoading] = useState(() => {
    // Only show startup loading screen once per session
    return !sessionStorage.getItem('agrolink_has_loaded');
  });

  const handleLoadingFinish = () => {
    sessionStorage.setItem('agrolink_has_loaded', 'true');
    setShowLoading(false);
  };

  return (
    <div className="app-container">
      {showLoading && <LoadingScreen onFinish={handleLoadingFinish} />}

      <Navbar />

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section style={{ padding: '4rem 1.5rem 3.5rem 1.5rem', textAlign: 'center', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
          <div style={{ maxWidth: '920px', margin: '0 auto' }}>
            
            {/* Top Language & Platform Pill Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#DCFCE7', color: '#166534', padding: '0.45rem 1.1rem', borderRadius: '20px', fontSize: '0.88rem', fontWeight: 800 }}>
                <Sprout size={18} /> {t('app_title')} PLATFORM
              </div>

              {/* Prominent Language Selector Button on Home Hero */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#F1F5F9', border: '1px solid var(--border-color)', padding: '0.2rem 0.5rem', borderRadius: '20px' }}>
                <LanguageSelector />
              </div>
            </div>

            <h1 style={{ fontSize: '3.4rem', color: 'var(--primary-dark)', marginBottom: '1rem', letterSpacing: '-0.5px', fontWeight: 800 }}>
              🌾 {t('app_title')}
            </h1>

            <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-green)', marginBottom: '1.25rem', fontWeight: 700 }}>
              {t('tagline')}
            </h2>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-body)', maxWidth: '760px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
              A transparent digital platform enabling farmers to compare market opportunities, publish crop lots, connect directly with verified buyers, and maximize harvest earnings.
            </p>

            {/* EASY 1-CLICK INSTANT ACCESS BUTTONS (NO LOGIN FRICTION) */}
            <div style={{ backgroundColor: '#F0FDF4', border: '2px solid #52B788', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(45,106,79,0.1)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '0.5px' }}>
                ⚡ EASY 1-CLICK INSTANT DEMO ACCESS (NO PASSWORD REQUIRED)
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/farmer/market-analysis"
                  className="btn btn-success btn-lg"
                  style={{ padding: '1rem 1.8rem', fontSize: '1.1rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 4px 10px rgba(22,101,52,0.2)' }}
                >
                  🌾 1-Click Farmer Mode
                </Link>

                <Link
                  to="/buyer/markets"
                  className="btn btn-primary btn-lg"
                  style={{ padding: '1rem 1.8rem', fontSize: '1.1rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 4px 10px rgba(27,67,50,0.2)' }}
                >
                  🏢 1-Click Buyer Mode
                </Link>
              </div>
            </div>

            {/* STANDARD LOGIN & REGISTRATION LINKS */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/login/farmer" className="btn btn-primary btn-sm" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  🌾 {t('farmer_signin')}
                </Link>
                <Link to="/login/buyer" className="btn btn-outline btn-sm" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', borderColor: 'var(--primary-green)', color: 'var(--primary-dark)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  🏢 {t('buyer_signin')}
                </Link>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <span>New Farmer? <Link to="/register/farmer" style={{ color: 'var(--primary-green)', fontWeight: 700 }}>{t('farmer_register')}</Link></span>
                <span>•</span>
                <span>New Buyer? <Link to="/register/buyer" style={{ color: 'var(--primary-green)', fontWeight: 700 }}>{t('buyer_register')}</Link></span>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Solution Overview Section */}
        <section style={{ padding: '3.5rem 1.5rem', backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              <div className="card" style={{ padding: '2rem', marginBottom: 0, borderTop: '4px solid #EF4444' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#B91C1C', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  ⚠️ THE CHALLENGE IN AGRICULTURE
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--text-dark)', marginBottom: '0.75rem', fontWeight: 800 }}>
                  Information Asymmetry & Low Bargaining Power
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: '1.65' }}>
                  Small farmers and FPOs lack access to live prices across nearby mandis, processors, and institutional buyers. Fragmented info on quality demands, transport fees, and buyer credibility forces farmers to sell immediately at depressed prices.
                </p>
              </div>

              <div className="card" style={{ padding: '2rem', marginBottom: 0, borderTop: '4px solid #166534' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  💡 THE AGRO LINK SOLUTION
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--text-dark)', marginBottom: '0.75rem', fontWeight: 800 }}>
                  Market Intelligence + Direct Transaction Platform
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: '1.65' }}>
                  Agro Link Market combines live mandi intelligence, optimal sale window guidance, smart buyer matching scores, FPO lot aggregation, digital billing, payment escrow tracking, and transparent dispute resolution.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* How It Works (4 Steps) */}
        <section style={{ padding: '3.5rem 1.5rem', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)', fontWeight: 800 }}>How It Works</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
                Four simple steps connecting small farmers and FPOs directly with verified commercial buyers.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '1.5rem', marginBottom: 0, borderTop: '3px solid var(--primary-green)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-green)', marginBottom: '0.5rem' }}>1</div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Buyer Market Requirement</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Buyers register their business market profile and set active crop procurement requirements.</p>
              </div>

              <div className="card" style={{ padding: '1.5rem', marginBottom: 0, borderTop: '3px solid var(--primary-green)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-green)', marginBottom: '0.5rem' }}>2</div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Farmer Lot Creation</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Farmers or FPOs publish crop lots specifying crop, quantity, quality grade, and expected price.</p>
              </div>

              <div className="card" style={{ padding: '1.5rem', marginBottom: 0, borderTop: '3px solid var(--primary-green)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-green)', marginBottom: '0.5rem' }}>3</div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Price & Buyer Discovery</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Platform calculates match scores, net earnings, transport fees, and optimal selling windows.</p>
              </div>

              <div className="card" style={{ padding: '1.5rem', marginBottom: 0, borderTop: '3px solid var(--primary-green)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-green)', marginBottom: '0.5rem' }}>4</div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Transparent Deal & Digital Bill</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Buyers accept requests, automatically generating verifiable transactions and digital bills.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section: Farmers vs Buyers */}
        <section style={{ padding: '3.5rem 1.5rem', backgroundColor: 'var(--bg-app)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)', fontWeight: 800 }}>Platform Benefits</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
                Empowering both sides of the agricultural supply chain with digital transparency.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
              
              {/* Benefits for Farmers */}
              <div className="card" style={{ padding: '2rem', marginBottom: 0, background: '#F0FDF4', border: '1.5px solid #86EFAC' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#166534', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1rem' }}>
                  <Sprout size={24} /> Benefits for 🌾 Farmers & FPOs
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-dark)' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} style={{ color: '#166534', flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Higher Net Earnings:</strong> Transparent net calculation minus transport & APMC fees.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} style={{ color: '#166534', flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Optimal Selling Windows:</strong> Hold harvest 2–3 days when prices are trending up.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} style={{ color: '#166534', flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>FPO Aggregation:</strong> Combine multiple small farmer harvests to command bulk prices.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} style={{ color: '#166534', flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Payment Assurance:</strong> Escrow payment tracking & digital bill PDF receipts.</span>
                  </li>
                </ul>
              </div>

              {/* Benefits for Buyers */}
              <div className="card" style={{ padding: '2rem', marginBottom: 0, background: '#EFF6FF', border: '1.5px solid #93C5FD' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#1E40AF', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1rem' }}>
                  <Building2 size={24} /> Benefits for 🏢 Buyers & Processors
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-dark)' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} style={{ color: '#1E40AF', flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Direct Sourcing:</strong> Procure verified quality crops directly from farmers & FPOs.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} style={{ color: '#1E40AF', flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Targeted Procurement:</strong> Post exact crop grade, quantity, and maximum buying price.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} style={{ color: '#1E40AF', flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Quality Assurance:</strong> View crop freshness, grade certificates, and harvest details.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} style={{ color: '#1E40AF', flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Audit Record:</strong> Complete digital deal history with dispute resolution desk support.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
