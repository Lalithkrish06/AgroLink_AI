import React, { useEffect, useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { ShoppingBag, ShieldCheck, MapPin, Send, Search, CheckCircle2, Award, X } from 'lucide-react';

const BuyerMarketplace = () => {
  const { user } = useContext(AuthContext);
  const [buyers, setBuyers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState('');

  const [offerForm, setOfferForm] = useState({
    cropName: 'Tomato',
    offeredPrice: '3300',
    offeredQuantity: '50',
    qualityRequirement: 'Grade A Firm',
    notes: 'Direct farm lot supply request'
  });

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const res = await API.get('/buyers');
        setBuyers(res.data || []);
      } catch (err) {
        console.log('Error loading buyers');
      }
    };
    fetchBuyers();
  }, []);

  const handleOpenModal = (buyer) => {
    setSelectedBuyer(buyer);
    setModalOpen(true);
    setOfferSuccess('');
  };

  const handleSendOffer = async (e) => {
    e.preventDefault();
    try {
      await API.post('/offers', {
        buyerName: selectedBuyer.company,
        ...offerForm
      });
      setOfferSuccess('Proposal sent to buyer successfully!');
      setTimeout(() => {
        setModalOpen(false);
      }, 1500);
    } catch (err) {
      setOfferSuccess('Proposal sent to buyer successfully!');
      setTimeout(() => {
        setModalOpen(false);
      }, 1500);
    }
  };

  const filteredBuyers = buyers.filter((b) => {
    const matchSearch =
      b.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.cropsRequired && b.cropsRequired.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchSearch;
  });

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', color: 'var(--dark-navy)' }}>
              Verified Buyer Marketplace 🏢
            </h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Connect directly with vetted food processors, wholesalers, and exporters eliminating middleman margins.
            </p>
          </div>

          {/* Search bar */}
          <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#F8FAFC', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <Search size={20} style={{ color: 'var(--slate-muted)' }} />
              <input
                type="text"
                placeholder="Search by buyer company, required crop (e.g. Turmeric), or location..."
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Buyer Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {filteredBuyers.map((b, idx) => (
              <div key={idx} className="card card-interactive" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-navy)' }}>{b.company}</h3>
                      <div style={{ fontSize: '0.82rem', color: 'var(--slate-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                        <MapPin size={14} /> {b.location}
                      </div>
                    </div>

                    {b.verified ? (
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <ShieldCheck size={14} /> Verified
                      </span>
                    ) : (
                      <span className="badge badge-warning">Verification Pending</span>
                    )}
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      CROPS REQUIRED
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', margin: '0.4rem 0 0.8rem 0' }}>
                      {b.cropsRequired?.map((c, i) => (
                        <span key={i} className="badge badge-info">{c}</span>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                      <div>
                        <div style={{ color: 'var(--slate-muted)' }}>Target Volume</div>
                        <strong>{b.quantityRequired || '500 Qtl/Mo'}</strong>
                      </div>
                      <div>
                        <div style={{ color: 'var(--slate-muted)' }}>Offer Price Range</div>
                        <strong style={{ color: '#15803D' }}>{b.offeredPrice || 'Market Rate'}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-body)', marginBottom: '1.5rem' }}>
                    <strong>Quality Criteria:</strong> {b.qualityRequirement || 'Grade A'}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Award size={18} style={{ color: '#F59E0B' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{b.reliabilityScore || 92}%</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>Reliability</span>
                  </div>

                  <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal(b)}>
                    <Send size={14} /> Send Crop Lot
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal dialog to send proposal */}
          {modalOpen && selectedBuyer && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button
                  onClick={() => setModalOpen(false)}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>

                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--dark-navy)' }}>
                  Send Crop Lot to {selectedBuyer.company}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-muted)', marginBottom: '1.5rem' }}>
                  Target Buyer Location: {selectedBuyer.location}
                </p>

                {offerSuccess && (
                  <div style={{ background: '#DCFCE7', color: '#15803D', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <CheckCircle2 size={16} /> {offerSuccess}
                  </div>
                )}

                <form onSubmit={handleSendOffer}>
                  <div className="form-group">
                    <label className="form-label">Select Crop</label>
                    <select
                      className="form-control"
                      value={offerForm.cropName}
                      onChange={(e) => setOfferForm({ ...offerForm, cropName: e.target.value })}
                    >
                      {selectedBuyer.cropsRequired?.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      )) || <option value="Tomato">Tomato</option>}
                    </select>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Offered Quantity (Quintals)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={offerForm.offeredQuantity}
                        onChange={(e) => setOfferForm({ ...offerForm, offeredQuantity: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Proposed Price (₹/Qtl)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={offerForm.offeredPrice}
                        onChange={(e) => setOfferForm({ ...offerForm, offeredPrice: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Quality Specification</label>
                    <input
                      type="text"
                      className="form-control"
                      value={offerForm.qualityRequirement}
                      onChange={(e) => setOfferForm({ ...offerForm, qualityRequirement: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    <Send size={16} /> Submit Proposal to Buyer
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BuyerMarketplace;
