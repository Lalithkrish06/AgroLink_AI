import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { 
  Target, 
  Sprout, 
  TrendingUp, 
  Truck, 
  ArrowRight, 
  Sparkles, 
  Award, 
  HeartHandshake,
  BarChart3,
  Globe2,
  Lock
} from 'lucide-react';

const Aim = () => {
  const { t } = useLanguage();

  const coreAims = [
    {
      icon: Target,
      color: '#166534',
      bg: '#DCFCE7',
      title: 'Eliminate Middleman Exploitation',
      description: 'Connect agricultural producers directly with APMC wholesale markets and verified buyers, ensuring maximum financial return for every harvest.'
    },
    {
      icon: BarChart3,
      color: '#0284C7',
      bg: '#E0F2FE',
      title: 'Data-Driven Market Intelligence',
      description: 'Empower farmers with real-time dynamic market recommendations, transparent price discovery, distance-based transport cost estimates, and net revenue calculations.'
    },
    {
      icon: Globe2,
      color: '#7C3AED',
      bg: '#F3E8FF',
      title: 'Multilingual Inclusivity',
      description: 'Break language barriers across India by offering localized interfaces in 7 regional languages including Tamil, Hindi, Telugu, Kannada, Malayalam, Marathi, and English.'
    },
    {
      icon: Lock,
      color: '#D97706',
      bg: '#FEF3C7',
      title: 'Transparent Payment Settlements',
      description: 'Provide digital offer tracking, idempotent order processing, and clear bill receipts so both farmers and buyers experience safe, trusted transactions.'
    },
    {
      icon: Truck,
      color: '#059669',
      bg: '#D1FAE5',
      title: 'Optimized Agricultural Logistics',
      description: 'Reduce post-harvest transportation loss by calculating precise transit distances and recommending optimal nearest regional buyer hubs.'
    },
    {
      icon: HeartHandshake,
      color: '#DC2626',
      bg: '#FEE2E2',
      title: 'Fair & Sustainable Growth',
      description: 'Build a sustainable ecosystem that rewards hard-working farmers, provides buyers with consistent quality produce, and strengthens national food supply chains.'
    }
  ];

  const impactMetrics = [
    { number: '100%', label: 'Direct Producer-to-Buyer Flow', detail: 'Zero Intermediary Commissions' },
    { number: '7+', label: 'Regional Languages Supported', detail: 'Inclusive National Coverage' },
    { number: 'Real-Time', label: 'Dynamic Price Matching', detail: 'Transparent Net Profit Logic' },
    { number: 'Safe', label: 'Digital Order Verification', detail: 'Idempotent Receipts & Audit Trails' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Navbar />

      {/* Hero Banner Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #052E16 0%, #166534 50%, #15803D 100%)', 
        color: '#FFFFFF', 
        padding: '3.5rem 1.5rem', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(255, 255, 255, 0.15)', 
            backdropFilter: 'blur(8px)',
            padding: '0.4rem 1rem', 
            borderRadius: '999px', 
            fontSize: '0.88rem', 
            fontWeight: 700, 
            marginBottom: '1.25rem',
            color: '#86EFAC',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Sparkles size={16} /> OUR AIM & MISSION
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.5px' }}>
            Empowering Indian Farmers Through Direct Market Connectivity & Fair Intelligence
          </h1>

          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '750px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Agro Link Market was conceived to revolutionize agricultural commerce in India by removing information opacity, eliminating middleman exploitation, and giving farmers the market intelligence they deserve.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/market-analysis" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: '8px', background: '#22C55E', borderColor: '#22C55E', fontWeight: 700 }}>
              Explore Market Analysis <ArrowRight size={18} style={{ marginLeft: '0.4rem' }} />
            </Link>
            <Link to="/register/farmer" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: '8px', color: '#FFFFFF', borderColor: '#FFFFFF', fontWeight: 700 }}>
              Join as a Farmer
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Vision Statement Card */}
        <div className="card" style={{ 
          background: '#FFFFFF', 
          borderRadius: '16px', 
          padding: '2.5rem', 
          marginBottom: '3rem', 
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#DCFCE7', padding: '0.75rem', borderRadius: '12px', color: '#166534' }}>
              <Sprout size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                Our Core Vision
              </h2>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Building India's Most Transparent Agricultural Trading Network
              </span>
            </div>
          </div>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.8, marginBottom: '1rem' }}>
            For decades, small and marginal farmers across India have faced severe income losses due to asymmetrical market information, price manipulation by unorganized middlemen, and high transport costs.
          </p>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.8, margin: 0 }}>
            Our aim is to democratize agricultural trade. By deploying intelligent multi-buyer matching algorithms, real-time APMC price tracking, and net profit calculators that deduct logistics overheads automatically, we ensure farmers receive maximum returns for their hard work.
          </p>
        </div>

        {/* Core Aims & Objectives Grid */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
              Key Strategic Aims
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Designed around the real challenges faced by agricultural communities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {coreAims.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="card" style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '12px', 
                  padding: '1.75rem', 
                  border: '1px solid var(--border-color)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '10px', 
                    background: item.bg, 
                    color: item.color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: '1.25rem' 
                  }}>
                    <IconComponent size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.6rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Impact Highlights Bar */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', 
          borderRadius: '16px', 
          padding: '2.5rem 1.5rem', 
          color: '#FFFFFF', 
          marginBottom: '3.5rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2rem' }}>
            Transforming Agricultural Commerce in Numbers
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {impactMetrics.map((m, idx) => (
              <div key={idx} style={{ 
                background: 'rgba(255, 255, 255, 0.06)', 
                borderRadius: '12px', 
                padding: '1.5rem 1rem', 
                border: '1px solid rgba(255, 255, 255, 0.1)' 
              }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#4ADE80', marginBottom: '0.3rem' }}>
                  {m.number}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.2rem' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  {m.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Footer Box */}
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%)', 
          border: '1px solid #86EFAC', 
          borderRadius: '16px', 
          padding: '2.5rem', 
          textAlign: 'center'
        }}>
          <div style={{ 
            display: 'inline-flex', 
            background: '#166534', 
            color: '#FFFFFF', 
            padding: '0.5rem', 
            borderRadius: '50%', 
            marginBottom: '1rem' 
          }}>
            <Award size={28} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14532D', marginBottom: '0.5rem' }}>
            Ready to Experience Transparent Crop Trade?
          </h3>
          <p style={{ fontSize: '1.05rem', color: '#166534', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
            Join thousands of progressive farmers and verified wholesale buyers on Agro Link Market today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register/farmer" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}>
              Register as Farmer
            </Link>
            <Link to="/register/buyer" className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}>
              Register as Buyer
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Aim;
