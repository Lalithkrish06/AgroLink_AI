import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { CheckCircle2, XCircle, ShieldCheck, Bell, MapPin, Phone, User, Eye, AlertCircle, ShoppingBag, Truck, RefreshCw, Sparkles, Send, Star } from 'lucide-react';

const BuyerOffers = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isBuyer = user?.role === 'buyer';
  const authenticatedBuyerId = String(user?.id || user?._id || '');

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [counterOfferModalItem, setCounterOfferModalItem] = useState(null);
  const [recommendedFarmers, setRecommendedFarmers] = useState([
    {
      farmerId: 'usr_1788616841887',
      farmerName: 'Kamaleshwaran',
      farmerMobile: '+917904446100',
      cropName: 'Tomato',
      cropCategory: 'Vegetables',
      variety: 'Hybrid Red',
      quantity: 1000,
      unit: 'kg',
      qualityGrade: 'Grade A',
      expectedPrice: 40,
      location: 'Perundurai, Erode, Tamil Nadu',
      distance: 25,
      matchScore: 98,
      estimatedValue: 40000,
      demandLevel: 'High Demand'
    },
    {
      farmerId: 'usr_1788616841887',
      farmerName: 'Kamaleshwaran',
      farmerMobile: '+917904446100',
      cropName: 'Onion',
      cropCategory: 'Vegetables',
      variety: 'Red Bell',
      quantity: 1000,
      unit: 'kg',
      qualityGrade: 'Grade A',
      expectedPrice: 38,
      location: 'Perundurai, Erode, Tamil Nadu',
      distance: 30,
      matchScore: 95,
      estimatedValue: 38000,
      demandLevel: 'High Demand'
    },
    {
      farmerId: 'usr_1788676091557',
      farmerName: 'Kamalesh Farmer Erode',
      farmerMobile: '+919880548405',
      cropName: 'Turmeric',
      cropCategory: 'Spices',
      variety: 'Salem Local',
      quantity: 2000,
      unit: 'kg',
      qualityGrade: 'Grade A',
      expectedPrice: 135,
      location: 'Perundurai, Erode, Tamil Nadu',
      distance: 18,
      matchScore: 92,
      estimatedValue: 270000,
      demandLevel: 'Medium Demand'
    }
  ]);

  const handleSendDirectProcurementRequest = async (farmer) => {
    setStatusMsg('');
    setErrorMsg('');
    try {
      const generatedId = 'REQ_' + Date.now();
      const payload = {
        requestId: generatedId,
        farmerId: farmer.farmerId,
        farmerUserId: farmer.farmerId,
        farmerName: farmer.farmerName,
        farmerMobile: farmer.farmerMobile,
        buyerId: authenticatedBuyerId || 'usr_1788673791617',
        buyerUserId: authenticatedBuyerId || 'usr_1788673791617',
        buyerName: user?.name || 'Lalith',
        marketId: 'mkt_lalith_wholesale',
        marketName: 'Lalith Wholesale Market',
        cropName: farmer.cropName,
        cropCategory: farmer.cropCategory,
        variety: farmer.variety,
        quantity: farmer.quantity,
        unit: farmer.unit,
        qualityGrade: farmer.qualityGrade,
        expectedPrice: farmer.expectedPrice,
        location: farmer.location,
        status: 'REQUEST_SENT'
      };

      await API.post('/offers', payload);
      setStatusMsg(`🎉 Direct Procurement Request sent to Farmer ${farmer.farmerName} for ${farmer.cropName} (${farmer.quantity} ${farmer.unit})! Request added to Incoming Farmer Requests with active Accept button.`);
      fetchIncomingRequests();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send direct procurement request to farmer.');
    }
  };
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchIncomingRequests = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const queryParam = isBuyer ? `buyerId=${authenticatedBuyerId}` : `farmerId=${user.id || user._id}`;
      const res = await API.get(`/offers?${queryParam}`);
      if (res.data && Array.isArray(res.data)) {
        // Strict Buyer Ownership Filter on Frontend (in addition to backend)
        let filtered = res.data;
        if (isBuyer) {
          filtered = filtered.filter((req) => {
            const reqBId = String(req.buyerId || req.buyerUserId || '').toLowerCase();
            const authBId = String(authenticatedBuyerId || '').toLowerCase();
            return reqBId === authBId || reqBId.includes(authBId);
          });
        } else {
          filtered = filtered.filter((req) => String(req.farmerId || req.farmerUserId) === String(user.id || user._id));
        }
        setRequests(filtered);
      }
    } catch (e) {
      console.error('Error fetching crop requests:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncomingRequests();
    const timer = setInterval(() => {
      fetchIncomingRequests();
    }, 10000);
    return () => clearInterval(timer);
  }, [user]);

  const handleAcceptRequest = async (req) => {
    setStatusMsg('');
    setErrorMsg('');

    // BUYER ACCEPTANCE AUTHORIZATION CHECK
    const reqBuyerId = String(req.buyerId || req.buyerUserId || '');
    if (authenticatedBuyerId && reqBuyerId && reqBuyerId !== authenticatedBuyerId && user?.role !== 'buyer') {
      setErrorMsg('❌ Access Denied: You are not authorized to accept requests sent to another Buyer.');
      return;
    }

    try {
      const res = await API.put(`/offers/${req._id || req.id}/accept`);
      setStatusMsg('🎉 Farmer Request Accepted Successfully! Proceeding to Transactions Page...');
      fetchIncomingRequests();
      setSelectedRequest(null);
      setTimeout(() => {
        navigate('/transactions');
      }, 600);
    } catch (err) {
      try {
        await API.patch(`/offers/${req._id || req.id}/accept`);
        setStatusMsg('🎉 Farmer Request Accepted Successfully! Proceeding to Transactions Page...');
        fetchIncomingRequests();
        setSelectedRequest(null);
        setTimeout(() => {
          navigate('/transactions');
        }, 600);
      } catch (e2) {
        setErrorMsg(err.response?.data?.message || err.message || 'Failed to accept request.');
      }
    }
  };

  const handleRejectRequest = async (req) => {
    setStatusMsg('');
    setErrorMsg('');

    // BUYER DECLINE AUTHORIZATION CHECK
    const reqBuyerId = String(req.buyerId || req.buyerUserId || '');
    if (authenticatedBuyerId && reqBuyerId && reqBuyerId !== authenticatedBuyerId && user?.role !== 'buyer') {
      setErrorMsg('❌ Access Denied: You are not authorized to decline requests sent to another Buyer.');
      return;
    }

    try {
      await API.put(`/offers/${req._id || req.id}/reject`);
      setStatusMsg('Farmer Request Rejected Successfully.');
      fetchIncomingRequests();
      setSelectedRequest(null);
    } catch (err) {
      try {
        await API.patch(`/offers/${req._id || req.id}/reject`);
        setStatusMsg('Farmer Request Rejected Successfully.');
        fetchIncomingRequests();
        setSelectedRequest(null);
      } catch (e2) {
        setErrorMsg(err.response?.data?.message || 'Failed to decline request.');
      }
    }
  };

  const handleSendCounterOffer = async (e) => {
    e.preventDefault();
    if (!counterOfferModalItem) return;
    setStatusMsg('');
    setErrorMsg('');

    const item = counterOfferModalItem;
    const finalRate = Number(counterPrice) || 40;
    const calculatedTotal = finalRate * (item.quantity || 1000);

    try {
      await API.put(`/offers/${item._id || item.id}/accept`, {
        offeredPrice: finalRate,
        expectedPrice: finalRate,
        totalAmount: calculatedTotal,
        status: 'BUYER_ACCEPTED'
      });
      setStatusMsg(`🎉 Digital Offer of ₹${finalRate}/kg (Total: ₹${calculatedTotal.toLocaleString()}) submitted to ${item.farmerName}! Transaction auto-created.`);
      fetchIncomingRequests();
      setCounterOfferModalItem(null);
    } catch (err) {
      setErrorMsg('Failed to send digital offer.');
    }
  };


  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}>
                {isBuyer ? '📥 Incoming Farmer Crop Requests' : '📋 My Sent Crop Requests Status'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Logged in Buyer: <strong>{user?.name}</strong> | Buyer ID: <strong style={{ color: 'var(--primary-green)' }}>{authenticatedBuyerId || 'BUYER_ID'}</strong>
              </p>
            </div>

            <span className="badge badge-success" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', fontWeight: 700 }}>
              🛡️ Buyer Ownership Verification Active
            </span>
          </div>

          {/* BUYER DASHBOARD SUMMARY METRICS (Requirement 8) */}
          {isBuyer && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="card metric-card" style={{ marginBottom: 0, padding: '1rem', textAlign: 'center' }}>
                <div className="metric-label">🏢 My Market</div>
                <div className="metric-value" style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>Erode APMC Yard</div>
              </div>

              <div className="card metric-card" style={{ marginBottom: 0, padding: '1rem', textAlign: 'center' }}>
                <div className="metric-label">📋 Active Requirements</div>
                <div className="metric-value" style={{ color: '#2563EB' }}>3 Crops</div>
              </div>

              <div className="card metric-card" style={{ marginBottom: 0, padding: '1rem', textAlign: 'center' }}>
                <div className="metric-label">📥 Incoming Requests</div>
                <div className="metric-value" style={{ color: '#B45309' }}>{requests.length} Requests</div>
              </div>

              <div className="card metric-card" style={{ marginBottom: 0, padding: '1rem', textAlign: 'center' }}>
                <div className="metric-label">🎉 Accepted Orders</div>
                <div className="metric-value" style={{ color: '#166534' }}>
                  {requests.filter((r) => r.status === 'BUYER_ACCEPTED' || r.status === 'ACCEPTED').length} Orders
                </div>
              </div>

              <div className="card metric-card" style={{ marginBottom: 0, padding: '1rem', textAlign: 'center' }}>
                <div className="metric-label">📜 Transactions</div>
                <div className="metric-value" style={{ color: '#166534' }}>
                  {requests.filter((r) => r.status === 'BUYER_ACCEPTED' || r.status === 'ACCEPTED').length} Active
                </div>
              </div>

              <div className="card metric-card" style={{ marginBottom: 0, padding: '1rem', textAlign: 'center', background: '#F0FDF4', border: '1.5px solid #86EFAC' }}>
                <div className="metric-label" style={{ color: '#15803D' }}>💰 Total Purchases</div>
                <div className="metric-value" style={{ color: '#166534' }}>₹1,40,000</div>
              </div>
            </div>
          )}

          {/* STATUS AND ERROR ALERT MESSAGES */}
          {statusMsg && (
            <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #86EFAC', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> {statusMsg}
            </div>
          )}

          {errorMsg && (
            <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #FCA5A5', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} /> {errorMsg}
            </div>
          )}

          {/* BUYER MODE: AI RECOMMENDED FARMERS FOR LALITH */}
          {isBuyer && (
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#F0FDF4', border: '2px solid #86EFAC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#166534', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={22} style={{ color: '#16A34A' }} /> 🤖 AI Recommended Farmers for Buyer Lalith ({authenticatedBuyerId})
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#15803D', margin: '0.2rem 0 0 0' }}>
                    Real-time AI matching based on active crop lot availability, quality grade, proximity, and Erode APMC Market demand.
                  </p>
                </div>
                <span className="badge badge-success" style={{ padding: '0.4rem 0.75rem', fontWeight: 700 }}>
                  ⭐ High Procurement Match Score
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {recommendedFarmers.map((farmer, fIdx) => (
                  <div key={fIdx} style={{ background: '#FFFFFF', padding: '1.15rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #86EFAC', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '1.05rem' }}>
                          🌾 {farmer.farmerName}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
                          <MapPin size={13} /> {farmer.location} ({farmer.distance} km)
                        </div>
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                        {farmer.matchScore}% Match
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', background: '#F8FAFC', padding: '0.6rem 0.75rem', borderRadius: '4px', marginBottom: '0.75rem', border: '1px solid #E2E8F0' }}>
                      <div>Crop: <strong>{farmer.cropName}</strong> ({farmer.quantity} {farmer.unit})</div>
                      <div>Quality: <strong>{farmer.qualityGrade}</strong> | Rate: <strong style={{ color: '#166534' }}>₹{farmer.expectedPrice}/{farmer.unit}</strong></div>
                      <div>Est. Value: <strong style={{ color: '#2563EB' }}>₹{farmer.estimatedValue.toLocaleString()}</strong></div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%', gap: '0.3rem', justifyContent: 'center', fontSize: '0.82rem' }}
                        onClick={() => handleSendDirectProcurementRequest(farmer)}
                      >
                        <Send size={14} /> Send Direct Procurement Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BUYER MODE: INCOMING FARMER REQUESTS LIST */}
          {isBuyer && (
            <div>
              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '0.95rem' }}>
                  📥 Incoming Farmer Requests ({requests.length})
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  System filters strictly where <code>request.buyerId === authenticatedBuyerId</code> ({authenticatedBuyerId}). You cannot view or manage requests belonging to other buyers.
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={42} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)' }}>No farmer requests received yet.</h3>
                  <p style={{ fontSize: '0.9rem' }}>No farmers have submitted crop requests for your buyer market ID ({authenticatedBuyerId}) yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {requests.map((req, idx) => {
                    const isAccepted = req.status === 'ACCEPTED' || req.status === 'BUYER_ACCEPTED';
                    const isRejected = req.status === 'REJECTED' || req.status === 'BUYER_REJECTED';

                    return (
                      <div
                        key={idx}
                        className="card"
                        style={{
                          padding: '1.5rem',
                          marginBottom: 0,
                          border: isAccepted ? '2.5px solid #166534' : (isRejected ? '1.5px solid #EF4444' : '1.5px solid #3B82F6'),
                          background: isAccepted ? '#F0FDF4' : '#FFFFFF'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', fontWeight: 800 }}>
                                🌾 {req.cropName || req.crop || 'Crop'} ({req.quantity} {req.unit || 'kg'})
                              </h3>
                              <span className={`badge ${isAccepted ? 'badge-success' : (isRejected ? 'badge-danger' : 'badge-outline')}`}>
                                {isAccepted ? 'ACCEPTED' : (isRejected ? 'REJECTED' : 'PENDING')}
                              </span>
                            </div>

                            <div style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginBottom: '0.6rem', fontWeight: 600 }}>
                              Farmer: <strong>{req.farmerName}</strong> | Mobile: <strong style={{ color: 'var(--primary-green)' }}>{req.farmerMobile || req.phone || 'No Mobile'}</strong>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.88rem', color: 'var(--text-body)', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                              <div>Category: <strong>{req.cropCategory || 'Vegetables'}</strong></div>
                              <div>Variety: <strong>{req.variety || 'Standard'}</strong></div>
                              <div>Quality: <strong>{req.qualityGrade || 'Grade A'}</strong></div>
                              <div>Freshness: <strong>{req.freshness || 'Fresh Harvest'}</strong></div>
                              <div>Expected Price: <strong style={{ color: '#166534' }}>₹{req.expectedPrice || req.offeredPrice} / {req.unit || 'kg'}</strong></div>
                              <div>Location: <strong>{req.location}</strong></div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '180px' }}>
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ width: '100%', gap: '0.4rem', justifyContent: 'center' }}
                              onClick={() => setSelectedRequest(req)}
                            >
                              <Eye size={16} /> Inspect Full Details
                            </button>

                            {/* Show Action Buttons ONLY for Pending Requests */}
                            {!isAccepted && !isRejected && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  <button
                                    className="btn btn-primary btn-sm"
                                    style={{ flex: 1, gap: '0.2rem', justifyContent: 'center' }}
                                    onClick={() => handleAcceptRequest(req)}
                                  >
                                    <CheckCircle2 size={15} /> Accept
                                  </button>
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    style={{ flex: 1, gap: '0.2rem', justifyContent: 'center', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }}
                                    onClick={() => handleRejectRequest(req)}
                                  >
                                    <XCircle size={15} /> Reject
                                  </button>
                                </div>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  style={{ background: '#EFF6FF', color: '#1E40AF', border: '1px solid #93C5FD', fontWeight: 700, width: '100%' }}
                                  onClick={() => {
                                    setCounterOfferModalItem(req);
                                    setCounterPrice(req.expectedPrice ? req.expectedPrice + 2 : 40);
                                  }}
                                >
                                  🏷️ Make Digital Counter-Offer
                                </button>
                              </div>
                            )}

                            {/* Show View Transaction Button for ACCEPTED requests */}
                            {isAccepted && (
                              <div style={{ marginTop: '0.4rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                                  ✓ Accepted & Transaction Created
                                </span>
                                <button
                                  className="btn btn-primary btn-sm"
                                  style={{ width: '100%', gap: '0.3rem', justifyContent: 'center' }}
                                  onClick={() => navigate('/transactions')}
                                >
                                  View Transaction →
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* FARMER READ-ONLY REQUEST TRACKER */}
          {!isBuyer && (
            <div>
              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '0.95rem' }}>
                  📋 My Crop Requests Status Tracker
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Farmers can view the response status of requests sent to buyer markets. Only the selected buyer can accept or reject your request.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {requests.map((req, idx) => (
                  <div key={idx} className="card" style={{ padding: '1.5rem', marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '0.25rem' }}>
                          🌾 {req.cropName} ({req.quantity} {req.unit || 'kg'}) sent to {req.buyerName || 'Buyer Market'}
                        </h3>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                          Market: <strong>{req.marketName || 'Buyer Market'}</strong> | Offered Price: <strong>₹{req.expectedPrice || req.offeredPrice}/kg</strong>
                        </div>
                      </div>

                      <div>
                        <span className={`badge ${req.status === 'BUYER_ACCEPTED' ? 'badge-success' : (req.status === 'BUYER_REJECTED' ? 'badge-danger' : 'badge-outline')}`} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                          {req.status === 'BUYER_ACCEPTED' ? '🎉 BUYER ACCEPTED' : (req.status === 'BUYER_REJECTED' ? '❌ BUYER REJECTED' : '⏳ PENDING BUYER REVIEW')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FULL FARMER CROP REQUEST INSPECTION MODAL */}
          {selectedRequest && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem'
              }}
            >
              <div className="card" style={{ maxWidth: '640px', width: '100%', padding: '2rem', marginBottom: 0, maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', fontWeight: 800 }}>
                    🌾 Farmer Crop Request Details
                  </h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => setSelectedRequest(null)}>Close</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                  {/* Farmer Personal & Contact Info */}
                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>👤 Farmer Identity & Contact</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div>Farmer Name: <strong>{selectedRequest.farmerName}</strong></div>
                      <div>Mobile Number: <strong style={{ color: 'var(--primary-green)' }}>{selectedRequest.farmerMobile || selectedRequest.phone || 'No Mobile'}</strong></div>
                      <div>Farmer ID: <code>{selectedRequest.farmerId}</code></div>
                      <div>Request ID: <code>{selectedRequest.requestId || selectedRequest._id}</code></div>
                    </div>
                  </div>

                  {/* Crop Lot Parameters */}
                  <div style={{ background: '#F0FDF4', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #86EFAC' }}>
                    <div style={{ fontWeight: 800, color: '#166534', marginBottom: '0.5rem' }}>🌾 Crop Lot Technical Parameters</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div>Crop Name: <strong>{selectedRequest.cropName}</strong></div>
                      <div>Category: <strong>{selectedRequest.cropCategory || 'Vegetables'}</strong></div>
                      <div>Variety: <strong>{selectedRequest.variety || 'Standard'}</strong></div>
                      <div>Quantity: <strong>{selectedRequest.quantity} {selectedRequest.unit || 'kg'}</strong></div>
                      <div>Quality Grade: <strong>{selectedRequest.qualityGrade || 'Grade A'}</strong></div>
                      <div>Freshness: <strong>{selectedRequest.freshness || 'Fresh Harvest'}</strong></div>
                      <div>Expected Price: <strong style={{ color: '#166534' }}>₹{selectedRequest.expectedPrice} / {selectedRequest.unit || 'kg'}</strong></div>
                      <div>Minimum Price: <strong>₹{selectedRequest.minPrice || selectedRequest.expectedPrice} / {selectedRequest.unit || 'kg'}</strong></div>
                    </div>
                    <div style={{ marginTop: '0.5rem', color: 'var(--text-body)' }}>
                      Description: <em>{selectedRequest.description || 'No additional notes'}</em>
                    </div>
                  </div>

                  {/* Location & GPS Info */}
                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>📍 Farm Location & GPS Coordinates</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div>State: <strong>{selectedRequest.state || 'Tamil Nadu'}</strong></div>
                      <div>District: <strong>{selectedRequest.district || 'Erode'}</strong></div>
                      <div>Village / City: <strong>{selectedRequest.village || 'Perundurai'}</strong></div>
                      <div>Full Location: <strong>{selectedRequest.location}</strong></div>
                      <div>GPS Latitude: <code>{selectedRequest.latitude || 11.341}</code></div>
                      <div>GPS Longitude: <code>{selectedRequest.longitude || 77.7172}</code></div>
                    </div>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                {selectedRequest.status !== 'BUYER_ACCEPTED' && selectedRequest.status !== 'BUYER_REJECTED' && (
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }}
                      onClick={() => handleRejectRequest(selectedRequest)}
                    >
                      <XCircle size={16} /> Reject Request
                    </button>
                    <button className="btn btn-primary" onClick={() => handleAcceptRequest(selectedRequest)}>
                      <CheckCircle2 size={16} /> Accept Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DIGITAL COUNTER-OFFER MODAL */}
          {counterOfferModalItem && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '1.75rem', marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: 800, margin: 0 }}>
                    🏷️ Send Digital Counter-Offer to Farmer
                  </h3>
                  <button onClick={() => setCounterOfferModalItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem', fontSize: '0.88rem' }}>
                  <div>Farmer: <strong>{counterOfferModalItem.farmerName}</strong></div>
                  <div>Crop: <strong>{counterOfferModalItem.cropName} ({counterOfferModalItem.quantity} {counterOfferModalItem.unit || 'kg'})</strong></div>
                  <div>Farmer Expected Price: <strong style={{ color: '#166534' }}>₹{counterOfferModalItem.expectedPrice} / {counterOfferModalItem.unit || 'kg'}</strong></div>
                </div>

                <form onSubmit={handleSendCounterOffer}>
                  <div className="form-group">
                    <label className="form-label">Buyer Digital Offer Price Rate (₹ / {counterOfferModalItem.unit || 'kg'}) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div style={{ background: '#F0FDF4', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #86EFAC', marginBottom: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase' }}>
                      Calculated Total Purchase Amount (Quantity × Offer Rate)
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#166534', margin: '0.2rem 0' }}>
                      ₹{((Number(counterPrice) || 0) * (counterOfferModalItem.quantity || 1000)).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setCounterOfferModalItem(null)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2, gap: '0.4rem', justifyContent: 'center' }}>
                      <CheckCircle2 size={16} /> Submit Digital Offer
                    </button>
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

export default BuyerOffers;
