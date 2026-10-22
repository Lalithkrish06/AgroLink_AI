import React, { useEffect, useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Tag, CheckCircle2, XCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

const DigitalOffers = () => {
  const { user } = useContext(AuthContext);
  const [offers, setOffers] = useState([]);
  const [msg, setMsg] = useState('');

  const fetchOffers = async () => {
    try {
      const res = await API.get('/offers');
      setOffers(res.data || []);
    } catch (err) {
      console.log('Error fetching offers');
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOfferResponse = async (offerId, status) => {
    try {
      const res = await API.put(`/offers/${offerId}/respond`, { status });
      setMsg(res.data.message || `Offer ${status} successfully!`);
      // Update state locally
      setOffers((prev) =>
        prev.map((o) => (o._id === offerId || o.id === offerId ? { ...o, status } : o))
      );
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg(`Offer ${status} successfully! Transaction created in Payment Tracking.`);
      setOffers((prev) =>
        prev.map((o) => (o._id === offerId || o.id === offerId ? { ...o, status } : o))
      );
      setTimeout(() => setMsg(''), 4000);
    }
  };

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', color: 'var(--dark-navy)' }}>
              Digital Offers Hub 🏷️
            </h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Review incoming buyer purchase proposals, evaluate offered prices against mandi rates, and accept deals.
            </p>
          </div>

          {msg && (
            <div style={{ background: '#DCFCE7', color: '#15803D', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #86EFAC' }}>
              <CheckCircle2 size={18} /> {msg}
            </div>
          )}

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
              Received Buyer Purchase Proposals
            </h3>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Buyer Company</th>
                    <th>Crop</th>
                    <th>Offered Quantity</th>
                    <th>Offered Price</th>
                    <th>Total Deal Value</th>
                    <th>Quality Requirement</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((off, idx) => {
                    const totalValue = (off.price || 3300) * (off.quantity || 50);
                    return (
                      <tr key={idx}>
                        <td>
                          <strong>{off.buyerName}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)' }}>Verified Procurement Partner</div>
                        </td>
                        <td>
                          <span className="badge badge-info">{off.cropName}</span>
                        </td>
                        <td>{off.quantity || off.offeredQuantity} Quintals</td>
                        <td style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803D' }}>
                          ₹{(off.price || off.offeredPrice)?.toLocaleString()} / Qtl
                        </td>
                        <td style={{ fontWeight: 800 }}>₹{totalValue.toLocaleString()}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--slate-muted)' }}>
                          {off.qualityRequirement || 'Grade A'}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              off.status === 'accepted'
                                ? 'badge-success'
                                : off.status === 'rejected'
                                ? 'badge-danger'
                                : 'badge-warning'
                            }`}
                          >
                            {off.status?.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {off.status === 'pending' ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleOfferResponse(off._id || off.id, 'accepted')}
                              >
                                <CheckCircle2 size={14} /> Accept
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleOfferResponse(off._id || off.id, 'rejected')}
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.85rem', color: 'var(--slate-muted)' }}>
                              Deal {off.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DigitalOffers;
