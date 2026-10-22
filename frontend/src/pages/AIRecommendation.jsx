import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { Sparkles, Trophy, Award, MapPin, Truck, TrendingUp, CheckCircle2, Info } from 'lucide-react';

const AIRecommendation = () => {
  const [cropName, setCropName] = useState('Tomato');
  const [quantity, setQuantity] = useState('50');
  const [expectedPrice, setExpectedPrice] = useState('3200');
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAIRecommendation = async () => {
    setLoading(true);
    try {
      const res = await API.post('/markets/recommend', {
        cropName,
        quantity: Number(quantity),
        expectedPrice: Number(expectedPrice)
      });
      setAiResult(res.data);
    } catch (err) {
      console.log('Error fetching AI recommendation');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAIRecommendation();
  }, [cropName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAIRecommendation();
  };

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', color: 'var(--dark-navy)' }}>
              AI Market Recommendation Engine 🤖
            </h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Multi-parameter weighted scoring algorithm calculating maximum net profit & optimal mandi destination.
            </p>
          </div>

          {/* Form Controls */}
          <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <form onSubmit={handleSubmit} className="form-grid" style={{ alignItems: 'flex-end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Crop Name</label>
                <select className="form-control" value={cropName} onChange={(e) => setCropName(e.target.value)}>
                  <option value="Tomato">Tomato</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Onion">Onion</option>
                  <option value="Banana">Banana</option>
                  <option value="Rice">Rice</option>
                  <option value="Coconut">Coconut</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Quantity (Quintals)</label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Expected Target Price (₹/Qtl)</label>
                <input
                  type="number"
                  className="form-control"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  <Sparkles size={18} /> {loading ? 'Analyzing...' : 'Run AI Analysis'}
                </button>
              </div>
            </form>
          </div>

          {/* AI Result Cards */}
          {aiResult && (
            <>
              {/* Highlight Best Recommended Market Box */}
              <div
                className="spotlight-banner"
                style={{
                  background: 'linear-gradient(135deg, #054A29 0%, #065F46 60%, #0D9488 100%)',
                  marginBottom: '2rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div style={{ maxWidth: '750px' }}>
                    <div className="spotlight-tag" style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>
                      <Trophy size={16} /> WINNING RECOMMENDATION
                    </div>
                    <h2 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '0.5rem' }}>
                      {aiResult.recommendedMarket}
                    </h2>
                    <p style={{ color: '#CCFBF1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                      "{aiResult.reason}"
                    </p>

                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#99F6E4', fontWeight: 'bold' }}>MARKET PRICE</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>
                          ₹{aiResult.bestPrice?.toLocaleString()} <span style={{ fontSize: '0.85rem' }}>/ Qtl</span>
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#99F6E4', fontWeight: 'bold' }}>TRANSPORT COST</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FDE047' }}>
                          ₹{aiResult.transportCost?.toLocaleString()} <span style={{ fontSize: '0.85rem' }}>/ Qtl</span>
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#99F6E4', fontWeight: 'bold' }}>TOTAL NET PROFIT</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ADE80' }}>
                          ₹{aiResult.totalNetProfit?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Score Badge Circle */}
                  <div style={{ textAlign: 'center' }}>
                    <div className="ai-score-pill" style={{ width: '110px', height: '110px', fontSize: '2.4rem' }}>
                      {aiResult.aiScore}
                      <span>AI Score</span>
                    </div>
                    <div style={{ marginTop: '0.5rem', color: '#CCFBF1', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      Match Index 98%
                    </div>
                  </div>
                </div>
              </div>

              {/* Algorithm Breakdown Box */}
              <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                  <Info size={20} style={{ color: 'var(--primary-main)' }} />
                  <h3 style={{ fontSize: '1.2rem' }}>AI Scoring Formula Weights</h3>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)' }}>30%</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Market Price</div>
                  </div>
                  <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)' }}>20%</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Buyer Demand</div>
                  </div>
                  <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)' }}>15%</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Distance Proximity</div>
                  </div>
                  <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)' }}>15%</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Transport Overhead</div>
                  </div>
                  <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)' }}>10%</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Arrival Volume</div>
                  </div>
                  <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)' }}>10%</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Buyer Reliability</div>
                  </div>
                </div>
              </div>

              {/* Mandi Comparison Matrix Table */}
              <div className="card">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                  All Candidate Mandis Ranked by AI Score
                </h3>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Mandi Name</th>
                        <th>Current Price</th>
                        <th>Transport Cost</th>
                        <th>Net Profit</th>
                        <th>Demand Level</th>
                        <th>Distance</th>
                        <th>AI Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiResult.comparison.map((item, idx) => (
                        <tr key={idx} style={{ background: idx === 0 ? '#F0FDF4' : 'transparent' }}>
                          <td>
                            <strong style={{ color: idx === 0 ? '#15803D' : 'inherit' }}>#{idx + 1}</strong>
                          </td>
                          <td>
                            <strong>{item.mandiName}</strong>
                            <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)' }}>{item.location}</div>
                          </td>
                          <td>₹{item.currentPrice?.toLocaleString()} / Qtl</td>
                          <td style={{ color: '#B45309' }}>₹{item.transportCostPerQuintal} / Qtl</td>
                          <td style={{ color: '#15803D', fontWeight: 800 }}>₹{item.totalNetProfit?.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${item.demandLevel === 'High' ? 'badge-success' : 'badge-warning'}`}>
                              {item.demandLevel}
                            </span>
                          </td>
                          <td>{item.distanceKm} Km</td>
                          <td>
                            <span className="badge badge-success" style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem' }}>
                              {item.aiScore} / 100
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AIRecommendation;
