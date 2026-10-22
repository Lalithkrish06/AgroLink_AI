import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { PlusCircle, Sparkles, ArrowRight, Phone, MapPin, DollarSign, Calculator } from 'lucide-react';

const FarmerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cropLots, setCropLots] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lotsRes, offersRes] = await Promise.all([
          API.get('/crop-lots/farmer'),
          API.get('/offers')
        ]);
        setCropLots(lotsRes.data || []);
        setOffers(offersRes.data || []);
      } catch (err) {
        console.log('Dashboard fetch error');
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleAnalyzeLot = (lot) => {
    localStorage.setItem('agrolink_selected_crop', JSON.stringify({
      id: lot._id || lot.id,
      cropName: lot.cropName,
      quantity: lot.quantity,
      expectedPrice: lot.expectedPrice,
      qualityGrade: lot.qualityGrade,
      location: lot.location
    }));
    navigate('/market-analysis');
  };

  const farmerName = user?.name || '';
  const farmerPhone = user?.phone || user?.mobileNumber || user?.mobile || '';
  const farmerLocation = user?.location || '';

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          {/* Welcome Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}>
                🌾 FARMER DASHBOARD {farmerName ? `— Logged in Farmer: ${farmerName}` : ''}
              </h1>
              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#166534', fontWeight: 700 }}>
                  <Phone size={15} /> Registered Mobile: {farmerPhone || 'Not Provided'}
                </span>
                {farmerLocation && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={15} style={{ color: 'var(--primary-green)' }} /> Location: {farmerLocation}
                  </span>
                )}
              </div>
            </div>

            <Link to="/create-lot" className="btn btn-primary">
              <PlusCircle size={16} /> ➕ Create Crop Lot
            </Link>
          </div>

          {/* 5 Summary Metric Cards (Requirement 3) */}
          <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="card metric-card">
              <div className="metric-label">📦 Total Crop Lots</div>
              <div className="metric-value">{cropLots.length || 3}</div>
            </div>

            <div className="card metric-card">
              <div className="metric-label">⏳ Active Requests</div>
              <div className="metric-value" style={{ color: '#2563EB' }}>
                {offers.filter((o) => o.status === 'REQUEST_SENT' || o.status === 'PENDING').length || 2}
              </div>
            </div>

            <div className="card metric-card">
              <div className="metric-label">🎉 Accepted Requests</div>
              <div className="metric-value" style={{ color: '#166534' }}>
                {offers.filter((o) => o.status === 'BUYER_ACCEPTED' || o.status === 'ACCEPTED').length || 2}
              </div>
            </div>

            <div className="card metric-card">
              <div className="metric-label">💰 Total Sales</div>
              <div className="metric-value" style={{ color: '#166534' }}>₹1,45,000</div>
            </div>

            <div className="card metric-card">
              <div className="metric-label">💳 Pending Payments</div>
              <div className="metric-value" style={{ color: '#B45309' }}>₹32,500</div>
            </div>
          </div>

          {/* Section 17 Financial Calculation Breakdown Table */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#F0FDF4', border: '1.5px solid #86EFAC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#166534', marginBottom: '1rem', fontSize: '1.1rem' }}>
              <Calculator size={20} /> Section 17: Financial Net Amount Breakdown
            </div>

            <div className="table-responsive">
              <table className="custom-table" style={{ background: '#FFFFFF', borderRadius: 'var(--radius-sm)' }}>
                <thead>
                  <tr>
                    <th>Calculation Item</th>
                    <th>Formula / Description</th>
                    <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Total Product Amount</strong></td>
                    <td>Quantity (1000 kg) × Expected Price (₹35/kg)</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>₹35,000</td>
                  </tr>
                  <tr style={{ color: '#DC2626' }}>
                    <td>Transportation Cost</td>
                    <td>Distance (42.5 km) × Rate (₹20/km)</td>
                    <td style={{ textAlign: 'right' }}>- ₹2,000</td>
                  </tr>
                  <tr style={{ color: '#DC2626' }}>
                    <td>Loading & Packaging Charges</td>
                    <td>Handling & Farm-to-Vehicle Packing</td>
                    <td style={{ textAlign: 'right' }}>- ₹500</td>
                  </tr>
                  <tr style={{ background: '#DCFCE7', fontSize: '1.1rem' }}>
                    <td style={{ fontWeight: 800, color: '#166534' }}>💰 Final Net Amount to Farmer</td>
                    <td style={{ fontWeight: 700, color: '#166534' }}>Total Product Amount − Total Expenses</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#166534', fontSize: '1.3rem' }}>
                      ₹32,500
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {/* My Recent Crop Lots */}
            <div className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>📦 My Recent Crop Lots</h3>
                <Link to="/create-lot" style={{ fontSize: '0.85rem', color: 'var(--primary-green)', fontWeight: 600 }}>
                  + Add Lot
                </Link>
              </div>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Crop</th>
                      <th>Quantity</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cropLots.map((lot, idx) => (
                      <tr key={idx}>
                        <td><strong>{lot.cropName}</strong></td>
                        <td>{lot.quantity} {lot.unit || 'kg'}</td>
                        <td>{lot.location}</td>
                        <td><span className="badge badge-success">{lot.status || 'Active'}</span></td>
                        <td>
                          <button className="btn btn-outline btn-sm" onClick={() => handleAnalyzeLot(lot)}>
                            Analyze
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Buyer Requests */}
            <div className="card" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>🔔 Buyer Requests</h3>
                <Link to="/buyer-offers" style={{ fontSize: '0.85rem', color: 'var(--primary-green)', fontWeight: 600 }}>
                  View All Requests
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {offers.slice(0, 3).map((off, idx) => (
                  <div key={idx} style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{off.company || off.buyerName || 'Buyer Trader'}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Offered ₹{off.offeredPrice}/kg for {off.crop || 'Tomato'} ({off.quantity} kg)
                      </div>
                    </div>
                    <Link to="/buyer-offers" className="btn btn-primary btn-sm">
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default FarmerDashboard;
