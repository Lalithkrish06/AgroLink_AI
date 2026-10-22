import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CROPS_DATA } from '../utils/crops';
import API from '../services/api';
import {
  BarChart2,
  Building2,
  Mic,
  Camera,
  ShieldCheck,
  TrendingUp,
  Send,
  PlusCircle,
  CheckCircle2,
  Sliders,
  DollarSign,
  Truck,
  Package,
  Award,
  Globe,
  Smartphone,
  Lock,
  FileText,
  X
} from 'lucide-react';

const UnifiedMarketHub = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { t, getCropName, getCategoryName, language, setLanguage } = useLanguage();

  // Determine initial active tab based on URL path
  const getInitialTab = () => {
    if (location.pathname.includes('/buyer')) return 'buyer-markets';
    if (location.pathname.includes('/voice') || location.pathname.includes('/escrow')) return 'voice-escrow';
    return 'farmer-analysis';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  // --- TAB 1: FARMER MARKET ANALYSIS & RECOMMENDATIONS STATE ---
  const [farmerCrop, setFarmerCrop] = useState({
    cropName: 'Tomato',
    quantity: 1000,
    unit: 'kg',
    qualityGrade: 'Grade A',
    expectedPrice: 35,
    location: 'Erode, Tamil Nadu'
  });
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [reqSuccessMsg, setReqSuccessMsg] = useState('');
  const [selectedMktModal, setSelectedMktModal] = useState(null);

  // --- TAB 2: BUYER MARKET MANAGEMENT STATE ---
  const [markets, setMarkets] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [marketForm, setMarketForm] = useState({
    buyerName: user?.name || '',
    businessName: '',
    marketName: '',
    mobileNumber: user?.mobileNumber || user?.phone || '',
    email: user?.email || '',
    location: user?.location || 'Erode, Tamil Nadu',
    marketType: 'Wholesale Market'
  });
  const [reqForm, setReqForm] = useState({
    cropName: 'Tomato',
    requiredQuantity: 1000,
    minimumQuality: 'Grade A',
    maximumBuyingPrice: 40,
    demandLevel: 'High Demand',
    status: 'ACTIVE'
  });
  const [bMktSuccessMsg, setBMktSuccessMsg] = useState('');

  // --- TAB 3: FORMLESS VOICE & AI QUALITY GRADING STATE ---
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [qualityGradeResult, setQualityGradeResult] = useState({
    grade: 'Grade A',
    code: 'GRADE_A_GREEN',
    score: 94,
    moisture: '11.2% (Optimal)',
    defects: '0.5% (Negligible)',
    color: '#2d6a4f',
    message: 'Grade A Premium Quality: +15% Price Discovery Premium Applied'
  });

  // --- TAB 4: MULTI-SIG ESCROW & LEDGER STATE ---
  const [escrowSignatures, setEscrowSignatures] = useState({
    buyerSigned: false,
    systemSigned: false,
    released: false
  });
  const [blocksChain, setBlocksChain] = useState([
    {
      index: 0,
      timestamp: '2026-09-09 14:30 UTC',
      eventType: 'GENESIS_BLOCK',
      hash: '0x8f3a9d12c8b74e...a91e',
      prevHash: '0x00000000000000...0000'
    },
    {
      index: 1,
      timestamp: '2026-09-09 14:35 UTC',
      eventType: 'ESCROW_FUNDS_LOCKED',
      hash: '0x3e91a44f88219c...b401',
      prevHash: '0x8f3a9d12c8b74e...a91e'
    }
  ]);
  const [smsLogs, setSmsLogs] = useState([
    {
      time: '14:35 UTC',
      phone: '+91 98765 43210',
      msg: '[AgroLink Escrow] ₹23,000 locked in Escrow for 500kg Paddy Rice. Pending delivery signature.'
    }
  ]);

  // Fetch real market recommendations for farmer
  const fetchFarmerRecommendations = async () => {
    setRecLoading(true);
    try {
      const queryStr = `cropName=${encodeURIComponent(farmerCrop.cropName)}&quantity=${farmerCrop.quantity}&qualityGrade=${encodeURIComponent(farmerCrop.qualityGrade)}&expectedPrice=${farmerCrop.expectedPrice}&location=${encodeURIComponent(farmerCrop.location)}`;
      const res = await API.get(`/crop-lots/recommendations/lot_active?${queryStr}`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setRecommendations(res.data);
      } else {
        setRecommendations(defaultRecommendations);
      }
    } catch (e) {
      console.error(e);
      setRecommendations(defaultRecommendations);
    }
    setRecLoading(false);
  };

  // Fetch buyer markets and requirements
  const fetchBuyerData = async () => {
    try {
      const bId = user?.id || user?._id || '';
      const [mRes, rRes] = await Promise.all([
        API.get(`/markets?buyerId=${bId}`),
        API.get(`/markets/requirements?buyerId=${bId}`)
      ]);
      setMarkets(mRes.data || []);
      setRequirements(rRes.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchFarmerRecommendations();
    fetchBuyerData();
  }, [farmerCrop.cropName]);

  // Voice recognition handling
  const handleVoiceInput = (sampleText) => {
    const text = sampleText || (language === 'ta' ? 'எனக்கு ஈரோட்டில் 500 கிலோ அரிசி உள்ளது 45 ரூபாய்' : 'I have 500kg of Rice in Erode for 45 rupees');
    setVoiceTranscript(text);

    // Auto-parse
    setFarmerCrop((prev) => ({
      ...prev,
      cropName: text.toLowerCase().includes('turmeric') || text.includes('மஞ்சள்') ? 'Turmeric' : 'Paddy Rice',
      quantity: 500,
      expectedPrice: 45
    }));
    setActiveTab('farmer-analysis');
  };

  // CV Quality grading simulation
  const handleQualityGrade = () => {
    const grades = [
      { grade: 'Grade A', code: 'GRADE_A_GREEN', score: 96, moisture: '11.0%', defects: '0.3%', color: '#2d6a4f', message: 'Grade A Premium Quality: +15% Price Premium Applied' },
      { grade: 'Grade B', code: 'GRADE_B_YELLOW', score: 82, moisture: '13.2%', defects: '2.5%', color: '#d97706', message: 'Grade B Standard Quality: Eligible for Standard APMC Rate' }
    ];
    const chosen = grades[Math.floor(Math.random() * grades.length)];
    setQualityGradeResult(chosen);
  };

  // Send Crop Request to Buyer Market
  const handleSendCropRequest = async (mkt) => {
    try {
      const targetMktId = mkt.marketId || mkt.demandId || mkt._id || 'mkt_def';
      const payload = {
        buyerUserId: mkt.buyerUserId || mkt.buyerId || 'usr_1788673791617',
        buyerId: mkt.buyerUserId || mkt.buyerId || 'usr_1788673791617',
        buyerName: mkt.buyerName || 'Registered Buyer',
        marketId: targetMktId,
        marketName: mkt.marketName || 'Wholesale Market',
        requirementId: mkt.requirementId || mkt.demandId,
        cropLotId: 'lot_active',
        farmerName: user?.name || 'Farmer Selvam',
        cropName: farmerCrop.cropName,
        quantity: farmerCrop.quantity,
        qualityGrade: farmerCrop.qualityGrade,
        expectedPrice: mkt.maximumPrice || farmerCrop.expectedPrice,
        location: farmerCrop.location
      };
      await API.post('/offers', payload);
      setSentRequestsMap(prev => ({ ...prev, [targetMktId]: true }));
      setReqSuccessMsg(`🎉 Crop Request submitted successfully to ${mkt.buyerName} (${mkt.marketName})! Real-time notification dispatched to Buyer inbox.`);
      setSelectedMktModal(null);
      setTimeout(() => setReqSuccessMsg(''), 5000);
    } catch (e) {
      alert('Failed to send crop request to buyer.');
    }
  };

  // Create Wholesale Market Profile
  const handleCreateMarket = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/markets', marketForm);
      if (res.status === 201 || res.data?.market) {
        setBMktSuccessMsg('✓ Wholesale Market Profile Created Successfully!');
        fetchBuyerData();
        setTimeout(() => setBMktSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert('Failed to create market profile');
    }
  };

  // Add Crop Requirement
  const handleAddRequirement = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/markets/requirements', reqForm);
      if (res.status === 201 || res.data?.requirement) {
        setBMktSuccessMsg('✓ Crop Requirement added & published to Farmers live!');
        fetchBuyerData();
        fetchFarmerRecommendations();
        setTimeout(() => setBMktSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert('Failed to add requirement');
    }
  };

  // Escrow Digital Signatures
  const handleSignEscrow = (role) => {
    if (role === 'BUYER') {
      setEscrowSignatures(prev => ({ ...prev, buyerSigned: true }));
    } else {
      setEscrowSignatures(prev => ({ ...prev, systemSigned: true, released: true }));
    }

    const newHash = '0x' + Math.random().toString(16).substring(2, 14) + '...';
    setBlocksChain(prev => [
      ...prev,
      {
        index: prev.length,
        timestamp: new Date().toLocaleTimeString() + ' UTC',
        eventType: role === 'BUYER' ? 'ESCROW_BUYER_SIGNED' : 'ESCROW_48H_AUTONOMOUS_RELEASED',
        hash: newHash,
        prevHash: prev[prev.length - 1].hash
      }
    ]);

    setSmsLogs(prev => [
      {
        time: new Date().toLocaleTimeString(),
        phone: '+91 98765 43210',
        msg: `[AgroLink Escrow] ${role} Signature Confirmed. Funds transfer initiated to Aadhaar Bank Account.`
      },
      ...prev
    ]);
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <div className="dashboard-content">
          
          {/* UNIFIED HUB HEADER BANNER */}
          <div style={{ background: 'linear-gradient(135deg, #1b4332, #2d6a4f)', color: 'white', padding: '1.5rem 2rem', borderRadius: '16px', marginBottom: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  🌾 AgroLink Combined Market Hub
                </h1>
                <p style={{ color: '#d8f3dc', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                  Unified Market Analysis, Wholesale Buyer Requirements, Formless Voice AI & Bank-Grade Escrow Ledger
                </p>
              </div>

              {/* Permanent Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                style={{ backgroundColor: '#ffffff', color: '#1b4332', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '30px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
              >
                <Globe size={18} />
                <span>{language === 'en' ? 'தமிழ் (Tamil)' : 'English'}</span>
              </button>
            </div>

            {/* UNIFIED TAB NAVIGATION */}
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              <button
                onClick={() => setActiveTab('farmer-analysis')}
                style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'farmer-analysis' ? '#ffffff' : 'rgba(255,255,255,0.15)', color: activeTab === 'farmer-analysis' ? '#1b4332' : '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <BarChart2 size={18} />
                <span>1. Farmer Market Analysis</span>
              </button>

              <button
                onClick={() => setActiveTab('buyer-markets')}
                style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'buyer-markets' ? '#ffffff' : 'rgba(255,255,255,0.15)', color: activeTab === 'buyer-markets' ? '#1b4332' : '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Building2 size={18} />
                <span>2. Buyer Wholesale Markets & Requirements</span>
              </button>

              <button
                onClick={() => setActiveTab('voice-escrow')}
                style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'voice-escrow' ? '#ffffff' : 'rgba(255,255,255,0.15)', color: activeTab === 'voice-escrow' ? '#1b4332' : '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Mic size={18} />
                <span>3. Voice AI, Quality & Multi-Sig Escrow</span>
              </button>
            </div>
          </div>

          {reqSuccessMsg && (
            <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '1rem 1.2rem', borderRadius: '10px', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={20} />
              <span>{reqSuccessMsg}</span>
            </div>
          )}

          {bMktSuccessMsg && (
            <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '1rem 1.2rem', borderRadius: '10px', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={20} />
              <span>{bMktSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: FARMER MARKET ANALYSIS */}
          {activeTab === 'farmer-analysis' && (
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart2 size={20} />
                    <span>Farmer Market Analysis & Matching Buyers</span>
                  </h3>
                  <span className="badge badge-success">Live DB Matched</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Crop Name</label>
                    <select
                      className="form-control"
                      value={farmerCrop.cropName}
                      onChange={(e) => setFarmerCrop({ ...farmerCrop, cropName: e.target.value })}
                      style={{ padding: '0.5rem', fontWeight: 700 }}
                    >
                      <option value="Tomato">Tomato (தக்காளி)</option>
                      <option value="Paddy Rice">Paddy Rice (அரிசி)</option>
                      <option value="Turmeric">Turmeric (மஞ்சள்)</option>
                      <option value="Onion">Onion (வெங்காயம்)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Quantity (kg)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={farmerCrop.quantity}
                      onChange={(e) => setFarmerCrop({ ...farmerCrop, quantity: Number(e.target.value) })}
                      style={{ padding: '0.5rem', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Quality Grade</label>
                    <select
                      className="form-control"
                      value={farmerCrop.qualityGrade}
                      onChange={(e) => setFarmerCrop({ ...farmerCrop, qualityGrade: e.target.value })}
                      style={{ padding: '0.5rem', fontWeight: 700 }}
                    >
                      <option value="Grade A">Grade A (Premium)</option>
                      <option value="Grade B">Grade B (Standard)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                  {recommendations.map((rec, idx) => (
                    <div key={idx} style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{rec.marketName}</span>
                        <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>{rec.matchScore}% Match</span>
                      </div>

                      <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.8rem' }}>
                        <div>👤 Buyer: <strong>{rec.buyerName}</strong></div>
                        <div>📍 Location: <strong>{rec.location}</strong></div>
                        <div>💰 Buying Price: <strong style={{ color: 'var(--green-color)' }}>₹{rec.maximumPrice} / kg</strong></div>
                        <div>📦 Total Value: <strong>₹{(rec.totalCropValue || (farmerCrop.quantity * rec.maximumPrice)).toLocaleString()}</strong></div>
                      </div>

                      <button
                        onClick={() => setSelectedMktModal(rec)}
                        disabled={sentRequestsMap[rec.marketId || rec.demandId]}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          backgroundColor: sentRequestsMap[rec.marketId || rec.demandId] ? '#166534' : '#2d6a4f',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          cursor: sentRequestsMap[rec.marketId || rec.demandId] ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}
                      >
                        {sentRequestsMap[rec.marketId || rec.demandId] ? (
                          <>
                            <CheckCircle2 size={18} />
                            <span>✓ Request Sent to Buyer</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>🤝 Send Request to Buyer</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUYER MARKET MANAGEMENT & REQUIREMENTS */}
          {activeTab === 'buyer-markets' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {/* Create Wholesale Market Profile */}
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={20} />
                  <span>1. Create Wholesale Market Profile</span>
                </h3>

                <form onSubmit={handleCreateMarket}>
                  <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Buyer / Business Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={marketForm.buyerName}
                      onChange={(e) => setMarketForm({ ...marketForm, buyerName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Wholesale Market Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Erode Wholesale Market Yard"
                      value={marketForm.marketName}
                      onChange={(e) => setMarketForm({ ...marketForm, marketName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Location / City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={marketForm.location}
                      onChange={(e) => setMarketForm({ ...marketForm, location: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontWeight: 800 }}>
                    Save Wholesale Market Profile
                  </button>
                </form>
              </div>

              {/* Add Crop Requirement */}
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PlusCircle size={20} />
                  <span>2. Add Crop Buying Requirement</span>
                </h3>

                <form onSubmit={handleAddRequirement}>
                  <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Crop Name</label>
                    <select
                      className="form-control"
                      value={reqForm.cropName}
                      onChange={(e) => setReqForm({ ...reqForm, cropName: e.target.value })}
                    >
                      <option value="Tomato">Tomato</option>
                      <option value="Paddy Rice">Paddy Rice</option>
                      <option value="Turmeric">Turmeric</option>
                      <option value="Onion">Onion</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Required Quantity (kg)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={reqForm.requiredQuantity}
                      onChange={(e) => setReqForm({ ...reqForm, requiredQuantity: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Maximum Buying Price (₹/kg)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={reqForm.maximumBuyingPrice}
                      onChange={(e) => setReqForm({ ...reqForm, maximumBuyingPrice: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '0.8rem', fontWeight: 800 }}>
                    Publish Buying Requirement to Farmers
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: VOICE AI, QUALITY GRADING & MULTI-SIG ESCROW */}
          {activeTab === 'voice-escrow' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              
              {/* Formless Voice Input Card */}
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mic size={20} />
                  <span>Formless Voice Input (Tamil & English)</span>
                </h3>

                <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '2px dashed #52b788', marginBottom: '1rem' }}>
                  <button
                    onClick={() => handleVoiceInput()}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#2d6a4f', color: 'white', border: 'none', fontSize: '2rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(45,106,79,0.3)', marginBottom: '0.8rem' }}
                  >
                    🎤
                  </button>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1b4332' }}>
                    {lang === 'ta' ? 'குரல் கொடுக்க மைக்கை அழுத்தவும்' : 'Click Mic for Formless Voice Input'}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button onClick={() => handleVoiceInput('I have 500kg of Rice in Erode for 45 rupees')} className="btn btn-outline" style={{ textAlign: 'left', fontWeight: 700 }}>
                    🎙️ "I have 500kg of Rice in Erode for 45 rupees"
                  </button>
                  <button onClick={() => handleVoiceInput('எனக்கு ஈரோட்டில் 500 கிலோ அரிசி உள்ளது 45 ரூபாய்')} className="btn btn-outline" style={{ textAlign: 'left', fontWeight: 700 }}>
                    🎙️ "எனக்கு ஈரோட்டில் 500 கிலோ அரிசி உள்ளது 45 ரூபாய்"
                  </button>
                </div>
              </div>

              {/* AI Image Quality Assessor */}
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Camera size={20} />
                  <span>Computer Vision Image Quality Assessor</span>
                </h3>

                <button onClick={handleQualityGrade} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontWeight: 800, marginBottom: '1rem' }}>
                  📷 Run AI Harvest Image Analysis
                </button>

                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ backgroundColor: qualityGradeResult.color, color: 'white', padding: '0.8rem 1rem', borderRadius: '8px', fontWeight: 900, fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <span>{qualityGradeResult.grade}</span>
                    <span>SCORE: {qualityGradeResult.score}/100</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 700 }}>
                    <div>Moisture Level: <strong>{qualityGradeResult.moisture}</strong></div>
                    <div>Defect Rate: <strong>{qualityGradeResult.defects}</strong></div>
                    <div style={{ marginTop: '0.5rem', color: '#1b4332', fontWeight: 800 }}>{qualityGradeResult.message}</div>
                  </div>
                </div>
              </div>

              {/* Bank-Grade Multi-Sig Escrow Tracker */}
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={20} />
                  <span>Bank-Grade Multi-Sig Escrow Ledger & SHA-256 Audit Trail</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                  <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #52b788', padding: '1.2rem', borderRadius: '12px' }}>
                    <h4 style={{ margin: '0 0 0.8rem 0', color: '#1b4332', fontWeight: 800 }}>Multi-Sig 2-Signature Release Timeline</h4>
                    
                    <div style={{ marginBottom: '0.8rem', padding: '0.6rem', backgroundColor: escrowSignatures.buyerSigned ? '#dcfce7' : '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Signature 1: Buyer Delivery Inspection</div>
                      <button
                        onClick={() => handleSignEscrow('BUYER')}
                        disabled={escrowSignatures.buyerSigned}
                        className="btn btn-success"
                        style={{ marginTop: '0.5rem', width: '100%', fontWeight: 800 }}
                      >
                        {escrowSignatures.buyerSigned ? '✓ Signed by Buyer' : '✍️ Confirm Physical Inspection Signature'}
                      </button>
                    </div>

                    <div style={{ padding: '0.6rem', backgroundColor: escrowSignatures.systemSigned ? '#dcfce7' : '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Signature 2: Autonomous 48H Release</div>
                      <button
                        onClick={() => handleSignEscrow('SYSTEM_AUTO_48H')}
                        disabled={escrowSignatures.released}
                        className="btn btn-primary"
                        style={{ marginTop: '0.5rem', width: '100%', fontWeight: 800 }}
                      >
                        {escrowSignatures.released ? '✓ Funds Released to Aadhaar Account' : '⚡ Simulate 48H Auto-Release'}
                      </button>
                    </div>
                  </div>

                  {/* SHA-256 Blockchain Audit Log */}
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '1.2rem', borderRadius: '12px' }}>
                    <h4 style={{ margin: '0 0 0.8rem 0', color: '#1b4332', fontWeight: 800 }}>Immutable Cryptographic Block Chain</h4>
                    <div style={{ maxHeight: '180px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                      {blocksChain.map((blk, idx) => (
                        <div key={idx} style={{ backgroundColor: '#ffffff', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.5rem', borderLeft: '3px solid #2d6a4f' }}>
                          <div><strong>BLOCK #{blk.index}</strong> [{blk.eventType}]</div>
                          <div style={{ color: '#2d6a4f', wordBreak: 'break-all' }}>Hash: {blk.hash}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* DEDICATED FARMER CROP REQUEST MODAL */}
      {selectedMktModal && (
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
              maxWidth: '540px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div>
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Direct Buyer Crop Offer</span>
                <h3 style={{ fontSize: '1.3rem', color: '#1b4332', margin: '0.2rem 0', fontWeight: 800 }}>
                  Submit Crop Request to Buyer
                </h3>
              </div>
              <button onClick={() => setSelectedMktModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 800, color: '#1b4332', fontSize: '1.05rem' }}>
                🏢 {selectedMktModal.marketName}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#334155', marginTop: '0.2rem' }}>
                Buyer: <strong>{selectedMktModal.buyerName}</strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                📍 Location: {selectedMktModal.location} | Buying Price: <strong>₹{selectedMktModal.maximumPrice} / kg</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Crop & Quantity</label>
                <input type="text" className="form-control" value={`${farmerCrop.cropName} (${farmerCrop.quantity} kg - ${farmerCrop.qualityGrade})`} readOnly style={{ background: '#f1f5f9', fontWeight: 700 }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Offered Price (₹ / kg)</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedMktModal.maximumPrice || farmerCrop.expectedPrice}
                  onChange={(e) => setSelectedMktModal({ ...selectedMktModal, maximumPrice: Number(e.target.value) })}
                  style={{ fontWeight: 700 }}
                />
              </div>

              <div style={{ background: '#dcfce7', padding: '0.85rem', borderRadius: '10px', border: '1px solid #86efac', fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>
                🔒 <strong>Direct Dispatch:</strong> Crop offer will be sent directly to {selectedMktModal.buyerName}'s inbox.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedMktModal(null)}
                  style={{ flex: 1, fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSendCropRequest(selectedMktModal)}
                  style={{ flex: 2, fontWeight: 800, gap: '0.5rem', justifyContent: 'center' }}
                >
                  <Send size={18} /> Confirm & Send Request
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

export default UnifiedMarketHub;
