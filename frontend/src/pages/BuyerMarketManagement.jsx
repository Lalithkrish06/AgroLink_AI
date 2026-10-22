import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CROPS_DATA } from '../utils/crops';
import API from '../services/api';
import { Building2, PlusCircle, CheckCircle2, Sliders, Edit, Trash2, ShieldAlert, Tag, Calendar, X } from 'lucide-react';

const BuyerMarketManagement = () => {
  const { user } = useContext(AuthContext);
  const { t, getCropName } = useLanguage();
  const isBuyer = user?.role === 'buyer' || user?.role === 'admin';

  const [markets, setMarkets] = useState([]);
  const [requirements, setRequirements] = useState([]);

  const [marketForm, setMarketForm] = useState({
    buyerName: user?.name || '',
    businessName: '',
    marketName: '',
    mobileNumber: user?.mobileNumber || user?.mobile || '',
    email: user?.email || '',
    location: user?.location || '',
    district: '',
    address: '',
    marketType: 'Wholesale Market'
  });

  const [reqForm, setReqForm] = useState({
    crop: 'Tomato',
    requiredQuantity: '1000',
    requiredQualityGrade: 'Grade A',
    maximumPrice: '40',
    demandLevel: 'High Demand',
    status: 'ACTIVE'
  });

  const [editingReq, setEditingReq] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync user profile data into market form if loaded after mount
  useEffect(() => {
    if (user) {
      setMarketForm((prev) => ({
        ...prev,
        buyerName: prev.buyerName || user.name || '',
        mobileNumber: prev.mobileNumber || user.mobileNumber || user.mobile || '',
        email: prev.email || user.email || '',
        location: prev.location || user.location || ''
      }));
    }
  }, [user]);

  const fetchMarketsAndReqs = async () => {
    try {
      const buyerIdParam = user?.id || user?._id || '';
      const [mktRes, reqRes] = await Promise.all([
        API.get(`/markets?buyerId=${buyerIdParam}`),
        API.get(`/markets/requirements?buyerId=${buyerIdParam}`)
      ]);
      if (mktRes.data && Array.isArray(mktRes.data)) setMarkets(mktRes.data);
      if (reqRes.data && Array.isArray(reqRes.data)) setRequirements(reqRes.data);
    } catch (e) {
      console.error('Fetch markets/requirements error:', e);
    }
  };

  useEffect(() => {
    fetchMarketsAndReqs();
  }, [user]);

  const handleCreateMarket = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await API.post('/markets', {
        ...marketForm,
        buyerId: user?.id || user?._id,
        buyerUserId: user?.id || user?._id,
        buyerEmail: user?.email
      });
      if (res.data) {
        setSuccessMsg('Buyer Market Profile saved successfully!');
        await fetchMarketsAndReqs();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      setErrorMsg(e.response?.data?.message || 'Failed to save Market Profile. Please check server connection.');
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  const handleAddRequirement = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await API.post('/markets/requirements', {
        crop: reqForm.crop,
        cropName: reqForm.crop,
        requiredQuantity: Number(reqForm.requiredQuantity),
        unit: 'KG',
        minimumQuality: reqForm.requiredQualityGrade,
        requiredQualityGrade: reqForm.requiredQualityGrade,
        maximumPrice: Number(reqForm.maximumPrice),
        maximumBuyingPrice: Number(reqForm.maximumPrice),
        demandLevel: reqForm.demandLevel,
        status: reqForm.status || 'ACTIVE',
        requirementStatus: reqForm.status || 'ACTIVE',
        buyerUserId: user?.id || user?._id,
        buyerId: user?.id || user?._id
      });
      if (res.data) {
        setSuccessMsg(t('req_added_success'));
        setReqForm({ crop: 'Tomato', requiredQuantity: '1000', requiredQualityGrade: 'Grade A', maximumPrice: '40', demandLevel: 'High Demand', status: 'ACTIVE' });
        await fetchMarketsAndReqs();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save crop requirement. Please check server connection.');
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  const handleUpdateRequirement = async (e) => {
    e.preventDefault();
    if (!editingReq) return;
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await API.put(`/markets/requirements/${editingReq._id || editingReq.id}`, editingReq);
      if (res.data) {
        setSuccessMsg('Market Requirement updated successfully!');
        setEditingReq(null);
        await fetchMarketsAndReqs();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      setErrorMsg(e.response?.data?.message || 'Failed to update requirement.');
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  const handleDeleteRequirement = async (reqId) => {
    if (!window.confirm('Are you sure you want to delete this market requirement?')) return;
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await API.delete(`/markets/requirements/${reqId}`);
      if (res.data) {
        setSuccessMsg('Market Requirement deleted successfully!');
        await fetchMarketsAndReqs();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      setErrorMsg(e.response?.data?.message || 'Failed to delete requirement.');
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  const handleToggleStatus = async (r, newStatus) => {
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await API.put(`/markets/requirements/${r._id || r.id}`, { status: newStatus, requirementStatus: newStatus });
      setSuccessMsg(`Requirement status changed to ${newStatus}`);
      await fetchMarketsAndReqs();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      setErrorMsg('Failed to change status.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}>🏢 {t('buyer_market_title')}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Create your market profile and set crop procurement requirements for automated farmer matching.
            </p>
          </div>

          {successMsg && (
            <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #86EFAC', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> {successMsg}
            </div>
          )}

          {errorMsg && (
            <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #FCA5A5', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} /> {errorMsg}
            </div>
          )}

          {!isBuyer && (
            <div style={{ background: '#FEF3C7', color: '#92400E', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FCD34D', marginBottom: '1.5rem', fontWeight: 600 }}>
              ⚠️ Role Notice: You are viewing market requirements in read-only mode. Only registered Buyers can add or manage market requirements.
            </div>
          )}

          {isBuyer && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Create Market Profile Form */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-green)', fontWeight: 700, fontSize: '1.1rem' }}>
                  <Building2 size={20} /> {t('market_profile')}
                </div>

                <form onSubmit={handleCreateMarket}>
                  <div className="form-group">
                    <label className="form-label">Buyer Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter full name"
                      value={marketForm.buyerName}
                      onChange={(e) => setMarketForm({ ...marketForm, buyerName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Business Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter business / company name"
                      value={marketForm.businessName}
                      onChange={(e) => setMarketForm({ ...marketForm, businessName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('market_name')}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter market name (e.g. Erode APMC Market)"
                      value={marketForm.marketName}
                      onChange={(e) => setMarketForm({ ...marketForm, marketName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Registered Mobile Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={marketForm.mobileNumber}
                        readOnly
                        style={{ background: '#F8FAFC', fontWeight: 600, color: 'var(--primary-dark)' }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From registered profile</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={marketForm.email}
                        readOnly
                        style={{ background: '#F8FAFC', fontWeight: 600 }}
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Market Type</label>
                      <select className="form-control" value={marketForm.marketType} onChange={(e) => setMarketForm({ ...marketForm, marketType: e.target.value })}>
                        <option value="Wholesale Market">Wholesale Market</option>
                        <option value="Processor Procurement Yard">Processor Procurement Yard</option>
                        <option value="Institutional Buyer">Institutional Buyer</option>
                        <option value="Retail Chain Hub">Retail Chain Hub</option>
                        <option value="Digital Trader Mandi">Digital Trader Mandi</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Verification Status</label>
                      <div className="badge badge-success" style={{ padding: '0.6rem', textAlign: 'center', display: 'block', fontWeight: 800 }}>
                        🛡️ {t('verified_buyer')}
                      </div>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">District</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Erode"
                        value={marketForm.district || 'Erode'}
                        onChange={(e) => setMarketForm({ ...marketForm, district: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Perundurai"
                        value={marketForm.city || 'Perundurai'}
                        onChange={(e) => setMarketForm({ ...marketForm, city: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Detailed Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter yard address"
                      value={marketForm.address || 'APMC Yard Main Road, Perundurai'}
                      onChange={(e) => setMarketForm({ ...marketForm, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Market Description & Procurement Criteria</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Describe crop requirements, payment terms, and working hours..."
                      value={marketForm.description || 'Leading wholesale buyer of fresh vegetables & spices across Tamil Nadu.'}
                      onChange={(e) => setMarketForm({ ...marketForm, description: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                    {t('save')} {t('market_profile')}
                  </button>
                </form>
              </div>

              {/* Add Crop Requirement Form */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-green)', fontWeight: 700, fontSize: '1.1rem' }}>
                  <Sliders size={20} /> {t('add_requirement')}
                </div>

                <form onSubmit={handleAddRequirement}>
                  <div className="form-group">
                    <label className="form-label">{t('crop_name')}</label>
                    <select className="form-control" value={reqForm.crop} onChange={(e) => setReqForm({ ...reqForm, crop: e.target.value })}>
                      {CROPS_DATA.map(c => (
                        <option key={c.id} value={c.id}>
                          {getCropName(c.id)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('quantity')} (KG)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 1000"
                      value={reqForm.requiredQuantity}
                      onChange={(e) => setReqForm({ ...reqForm, requiredQuantity: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">{t('min_quality')}</label>
                      <select className="form-control" value={reqForm.requiredQualityGrade} onChange={(e) => setReqForm({ ...reqForm, requiredQualityGrade: e.target.value })}>
                        <option value="Grade A">Grade A</option>
                        <option value="Grade B">Grade B</option>
                        <option value="Grade C">Grade C</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t('max_price')} (₹/KG)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 40"
                        value={reqForm.maximumPrice}
                        onChange={(e) => setReqForm({ ...reqForm, maximumPrice: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">{t('demand_level')}</label>
                      <select className="form-control" value={reqForm.demandLevel} onChange={(e) => setReqForm({ ...reqForm, demandLevel: e.target.value })}>
                        <option value="High Demand">High Demand</option>
                        <option value="Medium Demand">Medium Demand</option>
                        <option value="Low Demand">Low Demand</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t('status')}</label>
                      <select className="form-control" value={reqForm.status} onChange={(e) => setReqForm({ ...reqForm, status: e.target.value })}>
                        <option value="ACTIVE">ACTIVE (Used for Matching)</option>
                        <option value="PAUSED">PAUSED</option>
                        <option value="EXPIRED">EXPIRED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                    <PlusCircle size={16} /> {t('save_requirement_btn')}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Dedicated "My Market Requirements" Section */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', margin: 0 }}>
                  📦 {t('my_requirements')}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                  Only active requirements registered under your account (Buyer ID: <code>{user?.id || user?._id || 'BUYER_ID'}</code>) are used for smart farmer matching.
                </p>
              </div>

              <span className="badge badge-success" style={{ padding: '0.4rem 0.75rem', fontWeight: 700 }}>
                {requirements.filter((r) => (r.status || r.requirementStatus) === 'ACTIVE').length} Active for Matching
              </span>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>{t('crop')}</th>
                    <th>{t('quantity')}</th>
                    <th>{t('min_quality')}</th>
                    <th>{t('max_price')}</th>
                    <th>{t('demand_level')}</th>
                    <th>{t('status')}</th>
                    <th>{t('date')}</th>
                    {isBuyer && <th>{t('actions')}</th>}
                  </tr>
                </thead>
                <tbody>
                  {requirements.map((r, i) => {
                    const st = r.status || r.requirementStatus || 'ACTIVE';
                    const badgeClass = st === 'ACTIVE' ? 'badge-success' : st === 'PAUSED' ? 'badge-warning' : 'badge-danger';

                    return (
                      <tr key={i}>
                        <td>
                          <strong>{getCropName(r.crop || r.cropName || 'Tomato')}</strong>
                        </td>
                        <td>{r.requiredQuantity || r.requiredQuantityMin || 1000} KG</td>
                        <td>
                          <span className="badge badge-outline">{r.minimumQuality || r.requiredQualityGrade || 'Grade A'}</span>
                        </td>
                        <td>
                          <strong style={{ color: '#166534' }}>₹{r.maximumPrice || r.expectedPriceMax || 40} / KG</strong>
                        </td>
                        <td>
                          <strong>{r.demandLevel || 'High Demand'}</strong>
                        </td>
                        <td>
                          <select
                            className={`badge ${badgeClass}`}
                            style={{ border: 'none', padding: '0.35rem 0.5rem', cursor: isBuyer ? 'pointer' : 'default' }}
                            value={st}
                            disabled={!isBuyer}
                            onChange={(e) => handleToggleStatus(r, e.target.value)}
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="PAUSED">PAUSED</option>
                            <option value="EXPIRED">EXPIRED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {r.dateAdded || new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        {isBuyer && (
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button
                                className="btn btn-outline btn-sm"
                                style={{ padding: '0.3rem 0.5rem' }}
                                title="Edit Requirement"
                                onClick={() => setEditingReq(r)}
                              >
                                <Edit size={14} /> Edit
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.3rem 0.5rem', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }}
                                title="Delete Requirement"
                                onClick={() => handleDeleteRequirement(r._id || r.id)}
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}

                  {requirements.length === 0 && (
                    <tr>
                      <td colSpan={isBuyer ? 8 : 7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        {t('no_data')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* EDIT REQUIREMENT MODAL */}
          {editingReq && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(3px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '1.75rem', marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', margin: 0 }}>Edit Crop Requirement</h3>
                  <button onClick={() => setEditingReq(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleUpdateRequirement}>
                  <div className="form-group">
                    <label className="form-label">{t('crop_name')}</label>
                    <select className="form-control" value={editingReq.crop || editingReq.cropName} onChange={(e) => setEditingReq({ ...editingReq, crop: e.target.value, cropName: e.target.value })}>
                      {CROPS_DATA.map(c => (
                        <option key={c.id} value={c.id}>
                          {getCropName(c.id)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">{t('quantity')} (KG)</label>
                      <input type="number" className="form-control" value={editingReq.requiredQuantity || editingReq.requiredQuantityMin} onChange={(e) => setEditingReq({ ...editingReq, requiredQuantity: e.target.value })} required />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t('min_quality')}</label>
                      <select className="form-control" value={editingReq.minimumQuality || editingReq.requiredQualityGrade} onChange={(e) => setEditingReq({ ...editingReq, minimumQuality: e.target.value, requiredQualityGrade: e.target.value })}>
                        <option value="Grade A">Grade A</option>
                        <option value="Grade B">Grade B</option>
                        <option value="Grade C">Grade C</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">{t('max_price')} (₹/KG)</label>
                      <input type="number" className="form-control" value={editingReq.maximumPrice || editingReq.expectedPriceMax} onChange={(e) => setEditingReq({ ...editingReq, maximumPrice: e.target.value })} required />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t('status')}</label>
                      <select className="form-control" value={editingReq.status || editingReq.requirementStatus} onChange={(e) => setEditingReq({ ...editingReq, status: e.target.value, requirementStatus: e.target.value })}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="PAUSED">PAUSED</option>
                        <option value="EXPIRED">EXPIRED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditingReq(null)}>{t('cancel')}</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{t('save')}</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default BuyerMarketManagement;
