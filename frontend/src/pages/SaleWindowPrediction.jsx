import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CalendarDays, TrendingUp, Clock, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

const SaleWindowPrediction = () => {
  const [cropName, setCropName] = useState('Tomato');
  const [currentPrice, setCurrentPrice] = useState('3200');
  const [predictionData, setPredictionData] = useState(null);
  const [trends, setTrends] = useState([]);

  const fetchPrediction = async () => {
    try {
      const [predRes, trendRes] = await Promise.all([
        API.get(`/markets/prediction?cropName=${cropName}&currentPrice=${currentPrice}`),
        API.get(`/markets/trends?crop=${cropName}`)
      ]);
      setPredictionData(predRes.data);
      setTrends(trendRes.data.trends || []);
    } catch (err) {
      console.log('Error fetching prediction');
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, [cropName, currentPrice]);

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', color: 'var(--dark-navy)' }}>
              Best Sale Window Predictor 📅
            </h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Forecasting mandi demand velocity to optimize harvest liquidation timing and maximize price gains.
            </p>
          </div>

          {/* Form Filter */}
          <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <div className="form-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Crop Name</label>
                <select className="form-control" value={cropName} onChange={(e) => setCropName(e.target.value)}>
                  <option value="Tomato">Tomato</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Onion">Onion</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Current Mandi Price (₹/Qtl)</label>
                <input
                  type="number"
                  className="form-control"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                />
              </div>
            </div>
          </div>

          {predictionData && (
            <>
              {/* Recommendation Callout */}
              <div
                style={{
                  background: '#ECFDF5',
                  border: '2px solid #10B981',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#10B981',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <TrendingUp size={30} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    AI SALE ADVICE
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: '#064E3B', margin: '0.25rem 0 0.5rem 0' }}>
                    {predictionData.recommendation}
                  </h3>
                  <p style={{ color: '#047857', fontSize: '0.95rem' }}>
                    Current Price: <strong>₹{predictionData.currentPrice?.toLocaleString()}</strong> | Predicted Price in 7 Days:{' '}
                    <strong style={{ color: '#054A29' }}>₹{predictionData.predictedPrice7Days?.toLocaleString()}</strong> (+₹{predictionData.priceGain7Days?.toLocaleString()}/Qtl net lift)
                  </p>
                </div>
              </div>

              {/* 3 Sale Window Option Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {predictionData.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className="card card-interactive"
                    style={{
                      padding: '1.75rem',
                      border: opt.status === 'BEST CHOICE' ? '2px solid var(--primary-light)' : '1px solid var(--border-light)',
                      position: 'relative'
                    }}
                  >
                    {opt.status === 'BEST CHOICE' && (
                      <span
                        className="badge badge-success"
                        style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.75rem' }}
                      >
                        BEST CHOICE ★
                      </span>
                    )}

                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-muted)', fontWeight: 600 }}>{opt.option}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark-navy)', margin: '0.5rem 0', fontFamily: 'var(--font-heading)' }}>
                      ₹{opt.estimatedPrice?.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>/ Qtl</span>
                    </div>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontWeight: 700,
                        color: opt.priceDifference > 0 ? '#15803D' : '#64748B',
                        fontSize: '0.9rem',
                        marginBottom: '1rem'
                      }}
                    >
                      {opt.priceDifference > 0 && <ArrowUpRight size={16} />}
                      {opt.priceDifference > 0 ? `+₹${opt.priceDifference.toLocaleString()} Gain` : 'Current Reference Baseline'}
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-body)', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px' }}>
                      {opt.recommendation}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Projection Area Chart */}
              <div className="card">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                  14-Day Price Forecast Trajectory ({cropName})
                </h3>

                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trends}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                      <YAxis stroke="#64748B" fontSize={11} domain={['dataMin - 200', 'dataMax + 200']} />
                      <Tooltip
                        contentStyle={{ background: '#0F172A', color: 'white', borderRadius: '8px', border: 'none' }}
                        formatter={(val) => [`₹${val}/Qtl`, 'Estimated Price']}
                      />
                      <Area type="monotone" dataKey="price" stroke="#054A29" strokeWidth={3} fillOpacity={1} fill="url(#priceGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default SaleWindowPrediction;
