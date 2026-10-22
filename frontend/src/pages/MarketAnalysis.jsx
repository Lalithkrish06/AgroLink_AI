import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  Building2,
  Star,
  Sparkles,
  TrendingUp,
  DollarSign,
  Truck,
  Sliders,
  RefreshCw,
  Send,
  X,
  Package,
  Clock,
  Info
} from 'lucide-react';

const MarketAnalysis = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Farmer's selected crop parameters
  const [selectedCrop, setSelectedCrop] = useState({
    cropName: 'Tomato',
    quantity: 1000,
    unit: 'kg',
    qualityGrade: 'Grade A',
    expectedPrice: 35,
    location: 'Erode, Tamil Nadu'
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedMarketForRequest, setSelectedMarketForRequest] = useState(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [customPrice, setCustomPrice] = useState(35);
  const [storageAvailable, setStorageAvailable] = useState(true);

  const [myCropLots, setMyCropLots] = useState([]);
  const [selectedLotId, setSelectedLotId] = useState('');
  const [sentRequestsMap, setSentRequestsMap] = useState({});

  // Fetch farmer's active published crop lots
  useEffect(() => {
    const fetchFarmerCropLots = async () => {
      try {
        const farmerId = user?.id || user?._id;
        const res = await API.get(`/crop-lots/my-lots${farmerId ? `?farmerId=${farmerId}` : ''}`);
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setMyCropLots(res.data);
          const latestLot = res.data[0];
          setSelectedLotId(latestLot._id || latestLot.id);
          setSelectedCrop({
            _id: latestLot._id || latestLot.id,
            id: latestLot._id || latestLot.id,
            cropName: latestLot.cropName,
            quantity: Number(latestLot.quantity) || 1000,
            unit: latestLot.unit || 'kg',
            qualityGrade: latestLot.qualityGrade || 'Grade A',
            expectedPrice: Number(latestLot.expectedPrice) || 35,
            location: latestLot.location || 'Erode, Tamil Nadu'
          });
          setCustomPrice(Number(latestLot.expectedPrice) || 35);
        }
      } catch (e) {
        console.error('Error fetching farmer crop lots:', e);
      }
    };

    fetchFarmerCropLots();
  }, [user]);

  // Load published crop details from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('agrolink_selected_crop');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedCrop((prev) => ({
          ...prev,
          _id: parsed.id || prev._id,
          id: parsed.id || prev.id,
          cropName: parsed.cropName || prev.cropName,
          quantity: Number(parsed.quantity) || prev.quantity,
          unit: parsed.unit || prev.unit,
          qualityGrade: parsed.qualityGrade || prev.qualityGrade,
          expectedPrice: Number(parsed.expectedPrice) || prev.expectedPrice,
          location: parsed.location || prev.location
        }));
        setCustomPrice(Number(parsed.expectedPrice) || 35);
      } catch (e) {}
    }
  }, []);

  const defaultRecommendations = [
    {
      demandId: 'req_lalith_01',
      requirementId: 'req_lalith_01',
      buyerId: 'usr_1788673791617',
      buyerUserId: 'usr_1788673791617',
      buyerName: 'Lalith Wholesale Traders',
      buyerMobileNumber: '+91 98765 43217',
      marketId: 'mkt_lalith_wholesale',
      marketName: 'Lalith Wholesale Market',
      location: 'Erode, Tamil Nadu',
      cropName: 'Tomato',
      requiredQuantity: 1000,
      requiredQuality: 'Grade A',
      maximumPrice: 40,
      totalCropValue: 40000,
      demandLevel: 'High Demand',
      distance: 15,
      transportCost: 800,
      netAmount: 39200,
      matchScore: 95,
      isCropMatch: true,
      isBestMatch: true
    },
    {
      demandId: 'req_cbe_02',
      requirementId: 'req_cbe_02',
      buyerId: 'usr_1788673791617',
      buyerUserId: 'usr_1788673791617',
      buyerName: 'Premier Agro Foods Ltd',
      buyerMobileNumber: '+91 98421 88760',
      marketId: 'mkt_cbe',
      marketName: 'Coimbatore Food Processing Park',
      location: 'Coimbatore, Tamil Nadu',
      cropName: 'Tomato',
      requiredQuantity: 1500,
      requiredQuality: 'Grade A',
      maximumPrice: 42,
      totalCropValue: 42000,
      demandLevel: 'High Demand',
      distance: 65,
      transportCost: 2800,
      netAmount: 39200,
      matchScore: 88,
      isCropMatch: true,
      isBestMatch: false
    },
    {
      demandId: 'req_salem_03',
      requirementId: 'req_salem_03',
      buyerId: 'usr_1788673791617',
      buyerUserId: 'usr_1788673791617',
      buyerName: 'Salem Regional Merchants',
      buyerMobileNumber: '+91 94432 11099',
      marketId: 'mkt_salem',
      marketName: 'Salem Farmers Producer Market Yard',
      location: 'Salem, Tamil Nadu',
      cropName: 'Tomato',
      requiredQuantity: 800,
      requiredQuality: 'Grade B',
      maximumPrice: 38,
      totalCropValue: 38000,
      demandLevel: 'Medium Demand',
      distance: 85,
      transportCost: 3500,
      netAmount: 34500,
      matchScore: 81,
      isCropMatch: true,
      isBestMatch: false
    }
  ];

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const queryStr = `cropName=${encodeURIComponent(selectedCrop.cropName)}&quantity=${selectedCrop.quantity}&qualityGrade=${encodeURIComponent(selectedCrop.qualityGrade)}&expectedPrice=${selectedCrop.expectedPrice}&location=${encodeURIComponent(selectedCrop.location)}`;
      const res = await API.get(`/crop-lots/recommendations/lot_active?${queryStr}`);
      if (res.data && Array.isArray(res.data)) {
        setRecommendations(res.data);
      } else {
        setRecommendations([]);
      }
    } catch (e) {
      console.error('Error fetching market recommendations:', e);
      setRecommendations([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecommendations();
  }, [selectedCrop]);

  const handleOpenRequestModal = (mkt) => {
    setSelectedMarketForRequest(mkt);
    setCustomPrice(mkt.maximumPrice || selectedCrop.expectedPrice);
  };

  const handleFinalSubmitRequest = async () => {
    if (!selectedMarketForRequest) return;
    const mkt = selectedMarketForRequest;
    setLoading(true);

    const targetBuyerId = mkt.buyerUserId || mkt.buyerId;
    const currentFarmerId = user?.id || user?._id;

    const requestPayload = {
      requestId: 'REQ_' + Date.now(),
      farmerId: currentFarmerId,
      farmerUserId: currentFarmerId,
      farmerName: user?.name || 'Farmer',
      farmerMobile: user?.phone || user?.mobile || user?.mobileNumber || '',
      buyerId: targetBuyerId,
      buyerUserId: targetBuyerId,
      buyerName: mkt.buyerName,
      marketId: mkt.marketId || mkt.demandId,
      requirementId: mkt.requirementId || mkt.demandId,
      marketName: mkt.marketName,
      cropLotId: selectedCrop._id || selectedCrop.id || 'lot_active',
      cropName: selectedCrop.cropName,
      cropCategory: selectedCrop.cropCategory || 'Vegetables',
      variety: selectedCrop.variety || 'Standard',
      quantity: selectedCrop.quantity,
      unit: selectedCrop.unit,
      qualityGrade: selectedCrop.qualityGrade,
      freshness: selectedCrop.freshness || 'Fresh Harvest',
      description: requestNotes || selectedCrop.description || 'Fresh harvest crop lot',
      expectedPrice: customPrice || selectedCrop.expectedPrice,
      minPrice: (customPrice || selectedCrop.expectedPrice) * 0.9,
      offeredPrice: mkt.maximumPrice || customPrice || selectedCrop.expectedPrice,
      location: selectedCrop.location,
      state: selectedCrop.state || 'Tamil Nadu',
      district: selectedCrop.district || 'Erode',
      village: selectedCrop.village || 'Perundurai',
      status: 'REQUEST_SENT'
    };

    try {
      await API.post('/offers', requestPayload);
      await API.post(`/crop-lots/${selectedCrop._id || selectedCrop.id || 'lot_active'}/select-market`, {
        marketId: mkt.marketId || mkt.demandId,
        marketName: mkt.marketName,
        buyerId: targetBuyerId
      });
      const targetMktId = mkt.marketId || mkt.demandId;
      setSentRequestsMap(prev => ({ ...prev, [targetMktId]: true }));
      setSuccessMsg(`🎉 Crop request submitted successfully to ${mkt.buyerName} (${mkt.marketName})! Real-time notification dispatched to Buyer.`);
      setSelectedMarketForRequest(null);
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to submit crop request to buyer.';
      alert(msg);
    }
    setLoading(false);

    setTimeout(() => {
      setSuccessMsg('');
    }, 5000);
  };

  // Stat summary calculations
  const displayRecs = (recommendations && recommendations.length > 0) ? recommendations : defaultRecommendations;
  const highestPrice = displayRecs.reduce((max, r) => Math.max(max, Number(r.maximumPrice) || 0), 0);
  const lowestTransport = displayRecs.length > 0 ? displayRecs.reduce((min, r) => Math.min(min, Number(r.transportCost) || 0), 99999) : 0;
  const highestNet = displayRecs.reduce((max, r) => Math.max(max, Number(r.netAmount) || 0), 0);

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          {/* Page Title & Tagline */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}>🌾 Smart Market Analysis & Buyer Recommendations</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                System analyzes active crop demand, buyer offers, distance & transport fees to recommend the most profitable selling market.
              </p>
            </div>

            <button className="btn btn-outline btn-sm" onClick={fetchRecommendations} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Analysis
            </button>
          </div>

          {successMsg && (
            <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #86EFAC', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> {successMsg}
            </div>
          )}

          {/* CROP PARAMETERS INPUT & SELECTOR BAR */}
          <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: '#F8FAFC' }}>
            <div style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={18} style={{ color: 'var(--primary-green)' }} /> Customize Farmer Crop Harvest Parameters for Live Analysis:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Crop Name</label>
                <select
                  className="form-control"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.88rem' }}
                  value={selectedCrop.cropName}
                  onChange={(e) => setSelectedCrop({ ...selectedCrop, cropName: e.target.value })}
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Onion">Onion</option>
                  <option value="Banana">Banana</option>
                  <option value="Potato">Potato</option>
                  <option value="Paddy Rice">Paddy Rice</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Quantity ({selectedCrop.unit})</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.88rem' }}
                  value={selectedCrop.quantity}
                  onChange={(e) => setSelectedCrop({ ...selectedCrop, quantity: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Quality Grade</label>
                <select
                  className="form-control"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.88rem' }}
                  value={selectedCrop.qualityGrade}
                  onChange={(e) => setSelectedCrop({ ...selectedCrop, qualityGrade: e.target.value })}
                >
                  <option value="Grade A">Grade A (Premium)</option>
                  <option value="Grade B">Grade B (Standard)</option>
                  <option value="Grade C">Grade C (Fair)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Expected Price (₹ / {selectedCrop.unit})</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.88rem' }}
                  value={selectedCrop.expectedPrice}
                  onChange={(e) => setSelectedCrop({ ...selectedCrop, expectedPrice: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Farmer Location</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.88rem' }}
                  value={selectedCrop.location}
                  onChange={(e) => setSelectedCrop({ ...selectedCrop, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* MARKET ANALYSIS STAT CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="card" style={{ padding: '1rem', marginBottom: 0, textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Buyer Markets Analyzed</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '0.2rem' }}>
                {recommendations.length} Markets
              </div>
            </div>

            <div className="card" style={{ padding: '1rem', marginBottom: 0, textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Highest Price Offered</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#166534', marginTop: '0.2rem' }}>
                ₹{highestPrice} / {selectedCrop.unit}
              </div>
            </div>

            <div className="card" style={{ padding: '1rem', marginBottom: 0, textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Lowest Transport Cost</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563EB', marginTop: '0.2rem' }}>
                ₹{lowestTransport.toLocaleString()}
              </div>
            </div>

            <div className="card" style={{ padding: '1rem', marginBottom: 0, textAlign: 'center', background: '#F0FDF4', border: '1.5px solid #86EFAC' }}>
              <div style={{ fontSize: '0.78rem', color: '#15803D', textTransform: 'uppercase', fontWeight: 800 }}>Recommended Net Earnings</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#166534', marginTop: '0.2rem' }}>
                ₹{Math.round(highestNet).toLocaleString()}
              </div>
            </div>
          </div>

          {/* SALE WINDOW RECOMMENDATION CARD (Requirement 6) */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: storageAvailable ? '#F0FDF4' : '#FEF3C7', border: storageAvailable ? '2px solid #86EFAC' : '2px solid #FCD34D' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-success" style={{ fontWeight: 800, background: storageAvailable ? '#166534' : '#B45309', color: '#FFFFFF', padding: '0.35rem 0.75rem' }}>
                    💡 SALE WINDOW RECOMMENDATION
                  </span>
                  <span className="badge badge-outline" style={{ fontWeight: 700 }}>
                    Demo Data
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', color: storageAvailable ? '#166534' : '#92400E', fontWeight: 800, margin: '0.2rem 0' }}>
                  Recommended Selling Window for {selectedCrop.cropName}:{' '}
                  <span style={{ textDecoration: 'underline' }}>
                    {storageAvailable ? 'Wait 2–3 Days (Storage Available)' : 'Sell Immediately (No Storage)'}
                  </span>
                </h3>

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: storageAvailable ? '#15803D' : '#92400E', marginTop: '0.5rem', flexWrap: 'wrap', fontWeight: 600 }}>
                  <div>Current Mandi Price: <strong>₹{selectedCrop.expectedPrice} / {selectedCrop.unit}</strong></div>
                  <div>Expected Price in 3 Days: <strong style={{ color: '#166534', fontSize: '1rem' }}>₹{selectedCrop.expectedPrice + 5} / {selectedCrop.unit}</strong></div>
                  <div>Price Trend: <strong style={{ color: '#166534' }}>📈 Increasing (+14%)</strong></div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: storageAvailable ? '1px solid #86EFAC' : '1px solid #FCD34D', marginTop: '0.85rem', fontSize: '0.88rem', color: 'var(--text-body)' }}>
                  <strong>Reasoning:</strong> {storageAvailable ? (
                    <span>Mandi supply volume from neighboring districts is down 18% due to recent rains, while institutional processor demand in Coimbatore & Erode is surging. Holding harvest for 2–3 days with cold storage access yields an estimated net gain of <strong>+₹5,000</strong> for a 1,000 kg lot.</span>
                  ) : (
                    <span>Cold storage is unavailable at farm location. To prevent +15% post-harvest spoilage loss for perishable produce, sell immediately to nearest verified buyer at current market rate.</span>
                  )}
                </div>
              </div>

              {/* Storage Availability Toggle Button */}
              <div style={{ textAlign: 'right', minWidth: '180px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  Storage Status Filter
                </label>
                <button
                  type="button"
                  className={`btn btn-sm ${storageAvailable ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setStorageAvailable(!storageAvailable)}
                  style={{ fontWeight: 700, width: '100%' }}
                >
                  {storageAvailable ? '🏬 Storage Available (ON)' : '⚠️ No Cold Storage (OFF)'}
                </button>
              </div>
            </div>
          </div>

          {/* TRANSPARENT PRICE DISCOVERY COMPARISON SECTION (SIH Requirement) */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#F8FAFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  🔍 Transparent Price Discovery Comparison
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                  Comparing Mandi A vs Mandi B vs Buyer Direct Offer for <strong>{selectedCrop.cropName}</strong> to identify maximum net earnings.
                </p>
              </div>
              <span className="badge badge-success" style={{ padding: '0.4rem 0.75rem', fontWeight: 800 }}>
                ⭐ Best Net Price Identified
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              
              {/* Market A */}
              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>MARKET A</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.2rem' }}>Erode APMC Yard</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0.4rem 0' }}>₹35 / KG</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Gross Value: ₹35,000</div>
                <div style={{ fontSize: '0.82rem', color: '#DC2626' }}>Transport (25 km): - ₹1,000</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                  Net Earnings: ₹34,000
                </div>
              </div>

              {/* Market B */}
              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>MARKET B</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.2rem' }}>Salem Regional Mandi</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0.4rem 0' }}>₹38 / KG</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Gross Value: ₹38,000</div>
                <div style={{ fontSize: '0.82rem', color: '#DC2626' }}>Transport (65 km): - ₹2,800</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
                  Net Earnings: ₹35,200
                </div>
              </div>

              {/* Buyer Direct Offer (RECOMMENDED) */}
              <div style={{ background: '#F0FDF4', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '2px solid #86EFAC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>BUYER DIRECT OFFER</div>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>⭐ Recommended</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534', marginTop: '0.2rem' }}>ABC Wholesale Traders</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#166534', margin: '0.4rem 0' }}>₹40 / KG</div>
                <div style={{ fontSize: '0.82rem', color: '#15803D' }}>Gross Value: ₹40,000</div>
                <div style={{ fontSize: '0.82rem', color: '#DC2626' }}>Transport (25 km): - ₹1,000</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#166534', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1.5px dashed #86EFAC' }}>
                  💰 BEST NET EARNINGS: ₹39,000
                </div>
              </div>

            </div>
          </div>

          {/* MANDI PRICES & PRICE TREND GRAPH (Requirement 5) */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <TrendingUp size={20} style={{ color: 'var(--primary-green)' }} /> Mandi Prices & 7-Day Price Trend Trajectory
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                  Comparing current, previous, minimum, maximum and projected prices for <strong>{selectedCrop.cropName}</strong> across nearby mandis. <span className="badge badge-outline" style={{ fontSize: '0.72rem' }}>Demo Data</span>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                <div style={{ background: '#F8FAFC', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  Prev Price: <strong>₹{selectedCrop.expectedPrice - 3}/kg</strong>
                </div>
                <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid #86EFAC', fontWeight: 700 }}>
                  Current: ₹{selectedCrop.expectedPrice}/kg
                </div>
                <div style={{ background: '#EFF6FF', color: '#1E40AF', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid #93C5FD', fontWeight: 700 }}>
                  Expected: ₹{selectedCrop.expectedPrice + 5}/kg
                </div>
              </div>
            </div>

            {/* Recharts Line Chart */}
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { day: 'Day 1', price: selectedCrop.expectedPrice - 4, expected: selectedCrop.expectedPrice - 3 },
                  { day: 'Day 2', price: selectedCrop.expectedPrice - 2, expected: selectedCrop.expectedPrice - 1 },
                  { day: 'Day 3 (Today)', price: selectedCrop.expectedPrice, expected: selectedCrop.expectedPrice + 1 },
                  { day: 'Day 4', price: selectedCrop.expectedPrice + 2, expected: selectedCrop.expectedPrice + 3 },
                  { day: 'Day 5', price: selectedCrop.expectedPrice + 4, expected: selectedCrop.expectedPrice + 5 },
                  { day: 'Day 6', price: selectedCrop.expectedPrice + 5, expected: selectedCrop.expectedPrice + 6 },
                  { day: 'Day 7', price: selectedCrop.expectedPrice + 6, expected: selectedCrop.expectedPrice + 7 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} unit=" ₹" />
                  <Tooltip formatter={(value) => [`₹${value}/kg`, 'Price Rate']} />
                  <Line type="monotone" dataKey="price" stroke="#166534" strokeWidth={3} activeDot={{ r: 8 }} name="Current Mandi Trend" />
                  <Line type="monotone" dataKey="expected" stroke="#2563EB" strokeWidth={2} strokeDasharray="5 5" name="Expected Market Price" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SECTION 4: MARKET COMPARISON TABLE */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-dark)', marginBottom: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              📊 Market Comparison Matrix
            </h3>
            <div className="table-responsive">
              <table className="custom-table" style={{ fontSize: '0.88rem' }}>
                <thead>
                  <tr>
                    <th>Market</th>
                    <th>Crop</th>
                    <th>Required Qty</th>
                    <th>Quality</th>
                    <th>Price / KG</th>
                    <th>Distance</th>
                    <th>Transport Cost</th>
                    <th>Match Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRecs.map((m, idx) => (
                    <tr key={idx} style={{ background: m.isBestMatch ? '#F0FDF4' : 'transparent', fontWeight: m.isBestMatch ? 600 : 400 }}>
                      <td>
                        <strong>{m.marketName}</strong>
                        {m.isBestMatch && <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem', background: '#166534', color: '#fff', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>⭐ Recommended</span>}
                      </td>
                      <td>{m.cropName}</td>
                      <td>{m.requiredQuantity} kg</td>
                      <td><span className="badge badge-outline">{m.requiredQuality}</span></td>
                      <td><strong style={{ color: '#166534' }}>₹{m.maximumPrice}</strong></td>
                      <td>{m.distance} km</td>
                      <td style={{ color: '#DC2626' }}>₹{(m.transportCost || 1000).toLocaleString()}</td>
                      <td><strong style={{ color: '#15803D' }}>{m.matchScore}%</strong></td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ fontWeight: 800, backgroundColor: sentRequestsMap[m.marketId || m.demandId] ? '#166534' : 'var(--primary-color)' }}
                          onClick={() => handleOpenRequestModal(m)}
                          disabled={sentRequestsMap[m.marketId || m.demandId]}
                        >
                          {sentRequestsMap[m.marketId || m.demandId] ? '✓ Request Sent' : '🤝 Send Request to Buyer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* LOADING STATE (Requirement 19) */}
          {loading && (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              <RefreshCw size={32} className="spin" style={{ color: 'var(--primary-green)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: 800 }}>Finding suitable markets...</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>
                Analyzing active buyer requirements, crop compatibility, distance, transport cost, and maximum buying price from database...
              </p>
            </div>
          )}

          {/* EMPTY STATE (Requirement 18) */}
          {!loading && displayRecs.length === 0 && (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem', background: '#FFFBEB', border: '1.5px solid #FCD34D' }}>
              <Info size={36} style={{ color: '#B45309', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.3rem', color: '#92400E', fontWeight: 800 }}>No suitable active markets found for this crop.</h3>
              <p style={{ color: '#B45309', fontSize: '0.9rem', maxWidth: '600px', margin: '0.4rem auto 0 auto' }}>
                No active buyer requirement matching <strong>{selectedCrop.cropName}</strong> was found in the database. Please check back later or customize your crop harvest parameters above.
              </p>
            </div>
          )}

          {/* DYNAMIC SUITABLE MARKETS LIST */}
          {!loading && displayRecs.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {displayRecs.map((mkt, idx) => {
                const maxP = Number(mkt.maximumPrice) || Number(selectedCrop.expectedPrice) || 35;
                const qtyP = Number(selectedCrop.quantity) || 1000;
                const totalVal = qtyP * maxP;
                const transP = Number(mkt.transportCost) || 1400;
                const netProfit = Math.round(Number(mkt.netAmount) || (totalVal - transP));
                const isSent = sentRequestsMap[mkt.marketId || mkt.demandId];

                return (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      padding: '1.75rem',
                      marginBottom: 0,
                      border: mkt.isBestMatch ? '2.5px solid #166534' : '1px solid var(--border-color)',
                      background: mkt.isBestMatch ? '#F0FDF4' : '#FFFFFF',
                      boxShadow: mkt.isBestMatch ? '0 10px 25px -5px rgba(22, 101, 52, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                      
                      <div style={{ flex: 1, minWidth: '280px' }}>
                        {/* Section Tag */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                          {mkt.isBestMatch ? (
                            <span className="badge badge-success" style={{ fontWeight: 800, fontSize: '0.85rem', padding: '0.35rem 0.75rem', background: '#166534', color: '#FFFFFF' }}>
                              ⭐ RECOMMENDED MARKET (PRIMARY MATCH)
                            </span>
                          ) : (
                            <span className="badge badge-outline" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                              SUITABLE MARKET #{idx + 1}
                            </span>
                          )}
                          <span className="badge badge-outline" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                            Match Score: {mkt.matchScore || 90}%
                          </span>
                          <span className="badge badge-success" style={{ fontWeight: 700, fontSize: '0.78rem' }}>
                            Status: {mkt.marketStatus || 'ACTIVE'}
                          </span>
                        </div>

                        <h2 style={{ fontSize: '1.4rem', color: mkt.isBestMatch ? '#166534' : 'var(--text-dark)', fontWeight: 800, marginBottom: '0.4rem' }}>
                          <Building2 size={22} style={{ display: 'inline', marginRight: '0.4rem', color: 'var(--primary-green)' }} />
                          {mkt.marketName}
                        </h2>

                        {/* Buyer Details */}
                        <div style={{ fontSize: '0.92rem', color: 'var(--text-dark)', marginBottom: '0.85rem', fontWeight: 600 }}>
                          🏢 Buyer Details: <strong>{mkt.buyerName}</strong> | Mobile: <strong style={{ color: 'var(--primary-green)' }}>{mkt.buyerMobileNumber || 'N/A'}</strong>
                        </div>

                        {/* Detailed Metric Cards Grid (Requirement 2) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-body)', background: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                          <div>📍 Location: <strong>{mkt.location}</strong></div>
                          <div>🌾 Crop Requirement: <strong>{mkt.cropName}</strong></div>
                          <div>📦 Required Quantity: <strong>{mkt.requiredQuantity} kg</strong></div>
                          <div>🌾 Farmer Crop Qty: <strong>{mkt.farmerQuantity || selectedCrop.quantity} kg</strong></div>
                          <div>✨ Quality Requirement: <strong>{mkt.requiredQuality}</strong></div>
                          <div>✨ Farmer Crop Quality: <strong>{mkt.farmerQuality || selectedCrop.qualityGrade}</strong></div>
                          <div>🏷️ Max Price Offered: <strong style={{ color: '#166534', fontSize: '0.95rem' }}>₹{mkt.maximumPrice} / kg</strong></div>
                          <div>🔥 Demand Level: <strong style={{ color: '#B45309' }}>{mkt.demandLevel || 'High Demand'}</strong></div>
                          <div>📏 Distance from Farmer: <strong>{mkt.distance || 25} km</strong></div>
                          <div>🚚 Transport Cost: <strong style={{ color: '#DC2626' }}>₹{(mkt.transportCost || 1000).toLocaleString()}</strong></div>
                        </div>
                      </div>

                      {/* Right Action & Net Amount Box */}
                      <div style={{ textAlign: 'right', minWidth: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignSelf: 'stretch' }}>
                        <div style={{ background: mkt.isBestMatch ? '#DCFCE7' : '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #86EFAC', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase' }}>
                            ESTIMATED NET EARNINGS
                          </div>
                          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#166534', margin: '0.2rem 0' }}>
                            ₹{netProfit.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ₹{totalVal.toLocaleString()} Value - ₹{(mkt.transportCost || 1000).toLocaleString()} Transport
                          </div>
                        </div>

                        <button
                          className="btn btn-primary btn-lg"
                          style={{ marginTop: '1rem', width: '100%', gap: '0.4rem', justifyContent: 'center', fontWeight: 800, backgroundColor: isSent ? '#166534' : undefined }}
                          onClick={() => handleOpenRequestModal(mkt)}
                          disabled={loading || isSent}
                        >
                          {isSent ? '✓ Request Sent to Buyer' : <>🤝 Send Request <ArrowRight size={18} /></>}
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* DEDICATED FARMER CROP REQUEST MODAL (Section 1 & 2) */}
      {selectedMarketForRequest && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Direct Buyer Crop Request</span>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--text-dark)', margin: '0.2rem 0' }}>
                  Submit Crop Request to Buyer
                </h3>
              </div>
              <button onClick={() => setSelectedMarketForRequest(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>

            {/* Target Buyer Summary Box */}
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '1.05rem' }}>
                🏢 {selectedMarketForRequest.marketName}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-body)', marginTop: '0.2rem' }}>
                Buyer: <strong>{selectedMarketForRequest.buyerName}</strong> (ID: <code>{selectedMarketForRequest.buyerId}</code>)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                📍 Location: {selectedMarketForRequest.location} | Mobile: {selectedMarketForRequest.buyerMobileNumber}
              </div>
            </div>

            {/* Request Parameters Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-grid">
                <div>
                  <label className="form-label">Farmer Name</label>
                  <input type="text" className="form-control" value={user?.name || 'Kamaleshwaran Farmer'} readOnly style={{ background: '#F1F5F9' }} />
                </div>
                <div>
                  <label className="form-label">Crop Name</label>
                  <input type="text" className="form-control" value={selectedCrop.cropName} readOnly style={{ background: '#F1F5F9' }} />
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <label className="form-label">Quantity ({selectedCrop.unit})</label>
                  <input type="text" className="form-control" value={`${selectedCrop.quantity} ${selectedCrop.unit}`} readOnly style={{ background: '#F1F5F9' }} />
                </div>
                <div>
                  <label className="form-label">Quality Grade</label>
                  <input type="text" className="form-control" value={selectedCrop.qualityGrade} readOnly style={{ background: '#F1F5F9' }} />
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <label className="form-label">Expected Price (₹ / {selectedCrop.unit}) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Farmer Location</label>
                  <input type="text" className="form-control" value={selectedCrop.location} readOnly style={{ background: '#F1F5F9' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Harvest Notes / Remarks for Buyer</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Fresh organic harvest available for immediate dispatch..."
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                />
              </div>

              <div style={{ background: '#DCFCE7', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #86EFAC', fontSize: '0.85rem', color: '#166534' }}>
                🔒 <strong>Privacy Assurance:</strong> This request will be routed <em>strictly</em> to {selectedMarketForRequest.buyerName}'s account ID (<code>{selectedMarketForRequest.buyerId}</code>). Other buyers cannot view this request.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedMarketForRequest(null)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleFinalSubmitRequest}
                  disabled={loading}
                  style={{ flex: 2, gap: '0.5rem', justifyContent: 'center' }}
                >
                  <Send size={18} /> {loading ? 'Sending Request...' : 'Submit Request to Selected Buyer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MarketAnalysis;
