import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, Filter, ArrowUpRight, ArrowDownRight, MapPin, Truck, Box } from 'lucide-react';

const MarketIntelligence = () => {
  const [markets, setMarkets] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxDistance, setMaxDistance] = useState('');

  const fetchMarkets = async () => {
    try {
      let params = {};
      if (selectedCrop !== 'All') params.crop = selectedCrop;
      if (selectedDistrict !== 'All') params.district = selectedDistrict;
      if (maxPrice) params.maxPrice = maxPrice;
      if (maxDistance) params.maxDistance = maxDistance;

      const res = await API.get('/markets', { params });
      setMarkets(res.data || []);
    } catch (err) {
      console.log('Error fetching markets');
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, [selectedCrop, selectedDistrict, maxPrice, maxDistance]);

  const chartData = markets.map((m) => ({
    name: m.location,
    Price: m.currentPrice,
    TransportCost: m.transportCostPerQuintal,
    NetValue: m.currentPrice - m.transportCostPerQuintal
  }));

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', color: 'var(--dark-navy)' }}>
              Live Market Intelligence 📈
            </h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Real-time prices, arrival volumes, and transport overheads across major Tamil Nadu Mandis.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '1rem' }}>
              <Filter size={18} /> FILTER MARKETS
            </div>

            <div className="form-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Crop Name</label>
                <select className="form-control" value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
                  <option value="All">All Crops</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Onion">Onion</option>
                  <option value="Banana">Banana</option>
                  <option value="Rice">Rice</option>
                  <option value="Coconut">Coconut</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">District</label>
                <select className="form-control" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                  <option value="All">All Districts</option>
                  <option value="Erode">Erode</option>
                  <option value="Dindigul">Dindigul (Oddanchatram)</option>
                  <option value="Salem">Salem</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Price (₹/Qtl)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 15000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Distance (Km)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 150"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Mandi Price Comparison Chart */}
          <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
              Cross-Mandi Price & Transport Breakdown
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip
                    contentStyle={{ background: '#0F172A', color: 'white', borderRadius: '8px', border: 'none' }}
                    formatter={(val) => [`₹${val}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="Price" fill="#065F46" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="TransportCost" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mandi Listings Table */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
              Tamil Nadu Regulated Market Directory
            </h3>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mandi Name & Location</th>
                    <th>Crop</th>
                    <th>Current Price</th>
                    <th>Price Change</th>
                    <th>Demand</th>
                    <th>Arrival Volume</th>
                    <th>Distance & Transport</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((m, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{m.mandiName}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={12} /> {m.location}, {m.district}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">{m.cropName}</span>
                      </td>
                      <td style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                        ₹{m.currentPrice?.toLocaleString()} / Qtl
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            fontWeight: 700,
                            color: m.priceChange >= 0 ? '#15803D' : '#B91C1C'
                          }}
                        >
                          {m.priceChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                          {m.priceChange >= 0 ? `+₹${m.priceChange}` : `-₹${Math.abs(m.priceChange)}`}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${m.demandLevel === 'High' ? 'badge-success' : 'badge-warning'}`}>
                          {m.demandLevel} Demand
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Box size={14} style={{ color: 'var(--slate-muted)' }} />
                          {m.arrivalVolume} Quintals
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <strong>{m.distanceKm} Km</strong> away
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Truck size={12} /> ₹{m.transportCostPerQuintal}/Qtl
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarketIntelligence;
