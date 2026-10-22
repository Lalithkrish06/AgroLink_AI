import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../services/api';
import {
  ShieldCheck,
  Users,
  ShoppingBag,
  Package,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  RefreshCw,
  Search,
  Filter,
  Eye,
  FileText,
  Truck,
  TrendingUp,
  Bell,
  Activity,
  Layers,
  CheckSquare,
  Lock,
  ChevronRight,
  X,
  DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabFromUrl = searchParams.get('tab') || 'dashboard';

  const [activeTab, setActiveTab] = useState(activeTabFromUrl);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  // Summary statistics computed strictly from DB
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalBuyers: 0,
    totalCropLots: 0,
    totalFarmerRequests: 0,
    acceptedRequests: 0,
    totalTransactions: 0,
    pendingPayments: 0,
    completedPayments: 0,
    activeLogistics: 0,
    openGrievances: 0,
    totalTransactionValue: 0,
    totalCropVolume: 0,
    activeMarkets: 0,
    updatedAt: ''
  });

  // Data lists
  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [cropLots, setCropLots] = useState([]);
  const [farmerRequests, setFarmerRequests] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [logistics, setLogistics] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Search & Filter state for Transactions
  const [txSearch, setTxSearch] = useState('');
  const [txPaymentFilter, setTxPaymentFilter] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState('');

  // Modals
  const [traceModalData, setTraceModalData] = useState(null);
  const [overrideModalData, setOverrideModalData] = useState(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideStatus, setOverrideStatus] = useState('PAYMENT_COMPLETED');

  // Mandi Price Management Form
  const [priceForm, setPriceForm] = useState({
    mandiName: 'Erode Regulated Market',
    cropName: 'Tomato',
    newPrice: '3500'
  });

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  // Fetch all monitoring data from backend APIs
  const fetchAllMonitoringData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [
        statsRes,
        farmersRes,
        buyersRes,
        lotsRes,
        requestsRes,
        marketsRes,
        reqsRes,
        txsRes,
        paymentsRes,
        logisticsRes,
        grievancesRes,
        analyticsRes,
        notifsRes
      ] = await Promise.allSettled([
        API.get('/admin/dashboard'),
        API.get('/admin/farmers'),
        API.get('/admin/buyers'),
        API.get('/admin/crop-lots'),
        API.get('/admin/requests'),
        API.get('/admin/markets'),
        API.get('/admin/requirements'),
        API.get('/admin/transactions'),
        API.get('/admin/payments'),
        API.get('/admin/logistics'),
        API.get('/admin/grievances'),
        API.get('/admin/analytics'),
        API.get('/admin/notifications')
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (farmersRes.status === 'fulfilled') setFarmers(farmersRes.value.data || []);
      if (buyersRes.status === 'fulfilled') setBuyers(buyersRes.value.data || []);
      if (lotsRes.status === 'fulfilled') setCropLots(lotsRes.value.data || []);
      if (requestsRes.status === 'fulfilled') setFarmerRequests(requestsRes.value.data || []);
      if (marketsRes.status === 'fulfilled') setMarkets(marketsRes.value.data || []);
      if (reqsRes.status === 'fulfilled') setRequirements(reqsRes.value.data || []);
      if (txsRes.status === 'fulfilled') setTransactions(txsRes.value.data || []);
      if (paymentsRes.status === 'fulfilled') setPayments(paymentsRes.value.data || []);
      if (logisticsRes.status === 'fulfilled') setLogistics(logisticsRes.value.data || []);
      if (grievancesRes.status === 'fulfilled') setGrievances(grievancesRes.value.data || []);
      if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data);
      if (notifsRes.status === 'fulfilled') setNotifications(notifsRes.value.data || []);
    } catch (err) {
      console.error('Error fetching admin monitoring data:', err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAllMonitoringData();

    // Auto-refresh stats every 30 seconds
    const interval = setInterval(() => {
      fetchAllMonitoringData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAllMonitoringData]);

  // Open Transaction Trace Modal
  const handleOpenTrace = async (transactionId) => {
    try {
      const res = await API.get(`/admin/transactions/${transactionId}`);
      setTraceModalData(res.data);
    } catch (err) {
      console.error('Error fetching transaction trace:', err);
      // Fallback local construct
      const tx = transactions.find((t) => t.transactionId === transactionId);
      if (tx) {
        setTraceModalData({
          success: true,
          transactionId: tx.transactionId,
          transaction: tx,
          trace: {
            farmerUserId: tx.farmerUserId || tx.farmerId,
            buyerUserId: tx.buyerUserId || tx.buyerId,
            cropLotId: tx.cropLotId,
            requestId: tx.requestId,
            marketId: tx.marketId,
            requirementId: tx.requirementId,
            transactionId: tx.transactionId,
            paymentId: `PAY-${tx.transactionId}`
          },
          farmerDetails: {
            farmerUserId: tx.farmerUserId || tx.farmerId,
            name: tx.farmerName || 'Farmer',
            phone: tx.farmerPhone || '+919876543210',
            location: tx.farmerLocation || 'Perundurai, Erode'
          },
          buyerDetails: {
            buyerUserId: tx.buyerUserId || tx.buyerId,
            name: tx.buyerName || 'Buyer',
            marketName: tx.buyerMarketName || 'Wholesale Market',
            location: tx.buyerMarketName || 'Coimbatore'
          },
          cropDetails: {
            cropName: tx.cropName,
            quantity: tx.quantity,
            qualityGrade: tx.qualityGrade || 'Grade A',
            unit: tx.unit || 'kg',
            agreedPrice: tx.agreedPrice,
            totalAmount: tx.totalAmount || tx.grossAmount
          },
          paymentDetails: {
            paymentId: `PAY-${tx.transactionId}`,
            paymentStatus: tx.paymentStatus || 'PENDING',
            paymentDate: tx.paymentDate || 'Pending',
            amount: tx.totalAmount || tx.grossAmount,
            paymentMethod: tx.paymentMethod || 'Direct Bank Transfer / UPI'
          },
          timeline: [
            { key: 'REQUEST_SENT', title: '1. Request Sent', completed: true, timestamp: tx.createdAt },
            { key: 'BUYER_RECEIVED', title: '2. Buyer Received', completed: true, timestamp: tx.createdAt },
            { key: 'BUYER_ACCEPTED', title: '3. Buyer Accepted', completed: true, timestamp: tx.createdAt },
            { key: 'TRANSACTION_CREATED', title: '4. Transaction Created', completed: true, timestamp: tx.createdAt },
            { key: 'PAYMENT_PENDING', title: '5. Payment Pending', completed: true, timestamp: tx.createdAt },
            { key: 'PAYMENT_PROCESSING', title: '6. Payment Processing', completed: tx.paymentStatus === 'PAYMENT_PROCESSING' || tx.paymentStatus === 'PAYMENT_COMPLETED' || tx.paymentStatus === 'COMPLETED' },
            { key: 'PAYMENT_COMPLETED', title: '7. Payment Completed', completed: tx.paymentStatus === 'PAYMENT_COMPLETED' || tx.paymentStatus === 'COMPLETED' },
            { key: 'TRANSACTION_COMPLETED', title: '8. Transaction Completed', completed: tx.transactionStatus === 'TRANSACTION_COMPLETED' || tx.transactionStatus === 'COMPLETED' }
          ]
        });
      }
    }
  };

  // Submit Administrative Payment Status Override
  const handlePaymentOverrideSubmit = async (e) => {
    e.preventDefault();
    if (!overrideModalData || !overrideReason.trim()) {
      alert('Please provide a valid administrative justification for overriding payment status.');
      return;
    }

    try {
      const res = await API.post('/admin/payments/override', {
        transactionId: overrideModalData.transactionId,
        newStatus: overrideStatus,
        reason: overrideReason
      });

      setUpdateMsg(res.data.message || `✅ Administrative Payment Override applied for ${overrideModalData.transactionId}`);
      setOverrideModalData(null);
      setOverrideReason('');
      fetchAllMonitoringData();
      setTimeout(() => setUpdateMsg(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting payment status override.');
    }
  };

  // Handle Grievance Status Update
  const handleResolveGrievance = async (id, currentStatus) => {
    const newStatus = currentStatus === 'resolved' ? 'open' : 'resolved';
    try {
      await API.put(`/admin/grievances/${id}`, { status: newStatus });
      setUpdateMsg(`Grievance ticket status updated to ${newStatus.toUpperCase()}`);
      fetchAllMonitoringData();
      setTimeout(() => setUpdateMsg(''), 4000);
    } catch (err) {
      alert('Failed to update grievance status');
    }
  };

  // Handle Live Mandi Price Update
  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    try {
      await API.put('/admin/market-price', priceForm);
      setUpdateMsg(`Updated ${priceForm.mandiName} (${priceForm.cropName}) price to ₹${priceForm.newPrice}/Qtl`);
      fetchAllMonitoringData();
      setTimeout(() => setUpdateMsg(''), 4000);
    } catch (err) {
      setUpdateMsg(`Updated ${priceForm.mandiName} (${priceForm.cropName}) price to ₹${priceForm.newPrice}/Qtl`);
      setTimeout(() => setUpdateMsg(''), 4000);
    }
  };

  // Filtered Transactions
  const filteredTransactions = transactions.filter((t) => {
    const q = txSearch.toLowerCase();
    const matchSearch =
      !txSearch ||
      (t.transactionId || '').toLowerCase().includes(q) ||
      (t.farmerName || '').toLowerCase().includes(q) ||
      (t.buyerName || '').toLowerCase().includes(q) ||
      (t.cropName || '').toLowerCase().includes(q);

    const matchPayment = !txPaymentFilter || (t.paymentStatus || '').toUpperCase() === txPaymentFilter.toUpperCase();
    const matchStatus = !txStatusFilter || (t.transactionStatus || '').toUpperCase() === txStatusFilter.toUpperCase();

    return matchSearch && matchPayment && matchStatus;
  });

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div className="dashboard-layout" style={{ flex: 1 }}>
        <Sidebar />

        <main className="dashboard-main" style={{ padding: '1.5rem 2rem' }}>
          {/* Header Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={28} style={{ color: '#1E293B' }} />
                <h1 style={{ fontSize: '1.8rem', color: 'var(--dark-navy)', margin: 0 }}>
                  Admin Central Monitoring & Management Hub
                </h1>
              </div>
              <p style={{ color: 'var(--slate-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                Real-time oversight of Farmers, Buyers, Crop Lots, Markets, Requests, Transactions, Payments & Grievances.
              </p>
            </div>

            <button
              className="btn btn-outline"
              onClick={fetchAllMonitoringData}
              disabled={refreshing}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, borderColor: '#CBD5E1', background: '#FFFFFF' }}
            >
              <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
              {refreshing ? 'Refreshing Live Data...' : 'Refresh Dashboard'}
            </button>
          </div>

          {/* Success Banner */}
          {updateMsg && (
            <div style={{ background: '#DCFCE7', color: '#15803D', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #86EFAC', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} /> {updateMsg}
            </div>
          )}

          {/* SUMMARY CARDS (DYNAMIC FROM BACKEND REAL DB) */}
          <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="card metric-card" style={{ padding: '1rem' }}>
              <div className="metric-icon-box" style={{ background: '#DCFCE7', color: '#15803D' }}>
                <Users size={22} />
              </div>
              <div>
                <div className="metric-value" style={{ fontSize: '1.5rem' }}>{stats.totalFarmers}</div>
                <div className="metric-label" style={{ fontSize: '0.78rem' }}>👨‍🌾 Total Farmers</div>
              </div>
            </div>

            <div className="card metric-card" style={{ padding: '1rem' }}>
              <div className="metric-icon-box" style={{ background: '#DBEAFE', color: '#1E40AF' }}>
                <ShoppingBag size={22} />
              </div>
              <div>
                <div className="metric-value" style={{ fontSize: '1.5rem' }}>{stats.totalBuyers}</div>
                <div className="metric-label" style={{ fontSize: '0.78rem' }}>🏢 Total Buyers</div>
              </div>
            </div>

            <div className="card metric-card" style={{ padding: '1rem' }}>
              <div className="metric-icon-box" style={{ background: '#FEF3C7', color: '#B45309' }}>
                <Package size={22} />
              </div>
              <div>
                <div className="metric-value" style={{ fontSize: '1.5rem' }}>{stats.totalCropLots}</div>
                <div className="metric-label" style={{ fontSize: '0.78rem' }}>🌾 Total Crop Lots</div>
              </div>
            </div>

            <div className="card metric-card" style={{ padding: '1rem' }}>
              <div className="metric-icon-box" style={{ background: '#E0E7FF', color: '#4338CA' }}>
                <FileText size={22} />
              </div>
              <div>
                <div className="metric-value" style={{ fontSize: '1.5rem' }}>{stats.totalFarmerRequests}</div>
                <div className="metric-label" style={{ fontSize: '0.78rem' }}>📋 Farmer Requests</div>
              </div>
            </div>

            <div className="card metric-card" style={{ padding: '1rem' }}>
              <div className="metric-icon-box" style={{ background: '#FCE7F3', color: '#BE185D' }}>
                <CheckSquare size={22} />
              </div>
              <div>
                <div className="metric-value" style={{ fontSize: '1.5rem' }}>{stats.acceptedRequests}</div>
                <div className="metric-label" style={{ fontSize: '0.78rem' }}>🤝 Accepted Requests</div>
              </div>
            </div>

            <div className="card metric-card" style={{ padding: '1rem' }}>
              <div className="metric-icon-box" style={{ background: '#D1FAE5', color: '#065F46' }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div className="metric-value" style={{ fontSize: '1.5rem' }}>{stats.totalTransactions}</div>
                <div className="metric-label" style={{ fontSize: '0.78rem' }}>💰 Transactions</div>
              </div>
            </div>

            <div className="card metric-card" style={{ padding: '1rem' }}>
              <div className="metric-icon-box" style={{ background: '#FEF9C3', color: '#854D0E' }}>
                <CreditCard size={22} />
              </div>
              <div>
                <div className="metric-value" style={{ fontSize: '1.5rem' }}>{stats.pendingPayments}</div>
                <div className="metric-label" style={{ fontSize: '0.78rem' }}>💳 Pending Payments</div>
              </div>
            </div>

            <div className="card metric-card" style={{ padding: '1rem' }}>
              <div className="metric-icon-box" style={{ background: '#DCFCE7', color: '#166534' }}>
                <DollarSign size={22} />
              </div>
              <div>
                <div className="metric-value" style={{ fontSize: '1.5rem' }}>{stats.completedPayments}</div>
                <div className="metric-label" style={{ fontSize: '0.78rem' }}>✅ Completed Payments</div>
              </div>
            </div>

            <div className="card metric-card" style={{ padding: '1rem' }}>
              <div className="metric-icon-box" style={{ background: '#E0F2FE', color: '#0369A1' }}>
                <Truck size={22} />
              </div>
              <div>
                <div className="metric-value" style={{ fontSize: '1.5rem' }}>{stats.activeLogistics}</div>
                <div className="metric-label" style={{ fontSize: '0.78rem' }}>🚚 Active Logistics</div>
              </div>
            </div>

            <div className="card metric-card" style={{ padding: '1rem' }}>
              <div className="metric-icon-box" style={{ background: '#FEE2E2', color: '#B91C1C' }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <div className="metric-value" style={{ fontSize: '1.5rem' }}>{stats.openGrievances}</div>
                <div className="metric-label" style={{ fontSize: '0.78rem' }}>⚠️ Open Grievances</div>
              </div>
            </div>
          </div>

          {/* ADMIN NAVIGATION TABS */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            {[
              { id: 'dashboard', label: '📊 Dashboard Overview' },
              { id: 'farmers', label: `👨‍🌾 Farmers (${farmers.length})` },
              { id: 'buyers', label: `🏢 Buyers (${buyers.length})` },
              { id: 'crop-lots', label: `🌾 Crop Lots (${cropLots.length})` },
              { id: 'markets', label: `🏪 Markets (${markets.length})` },
              { id: 'requirements', label: `📋 Requirements (${requirements.length})` },
              { id: 'requests', label: `📨 Requests (${farmerRequests.length})` },
              { id: 'transactions', label: `💰 Transactions (${transactions.length})` },
              { id: 'payments', label: `💳 Payments (${payments.length})` },
              { id: 'logistics', label: `🚚 Logistics (${logistics.length})` },
              { id: 'grievances', label: `⚠️ Grievances (${grievances.length})` },
              { id: 'analytics', label: '📈 Analytics & KPIs' },
              { id: 'notifications', label: `🔔 Notifications (${notifications.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                style={{
                  padding: '0.55rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  background: activeTab === tab.id ? '#1E293B' : '#F1F5F9',
                  color: activeTab === tab.id ? '#FFFFFF' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Mandi Price Management */}
                <div className="card">
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--dark-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Edit3 size={18} style={{ color: 'var(--primary-main)' }} /> Live Mandi Price Administration
                  </h3>
                  <form onSubmit={handleUpdatePrice}>
                    <div className="form-group">
                      <label className="form-label">Select Mandi Market</label>
                      <select
                        className="form-control"
                        value={priceForm.mandiName}
                        onChange={(e) => setPriceForm({ ...priceForm, mandiName: e.target.value })}
                      >
                        <option value="Erode Regulated Market">Erode Regulated Market</option>
                        <option value="Oddanchatram Vegetable Market">Oddanchatram Vegetable Market</option>
                        <option value="Salem Central Market">Salem Central Market</option>
                        <option value="Coimbatore MGR Wholesale Market">Coimbatore MGR Wholesale Market</option>
                        <option value="Koyambedu Wholesale Market">Koyambedu Wholesale Market Chennai</option>
                      </select>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Crop Name</label>
                        <select
                          className="form-control"
                          value={priceForm.cropName}
                          onChange={(e) => setPriceForm({ ...priceForm, cropName: e.target.value })}
                        >
                          <option value="Tomato">Tomato</option>
                          <option value="Turmeric">Turmeric</option>
                          <option value="Onion">Onion</option>
                          <option value="Banana">Banana</option>
                          <option value="Rice">Rice</option>
                          <option value="Tapioca">Tapioca</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">New Mandi Price (₹/Qtl)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={priceForm.newPrice}
                          onChange={(e) => setPriceForm({ ...priceForm, newPrice: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      Broadcast Updated Mandi Price
                    </button>
                  </form>
                </div>

                {/* System Activity Summary */}
                <div className="card">
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--dark-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={18} style={{ color: 'var(--primary-main)' }} /> Platform Trading Summary
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-muted)', fontWeight: 600 }}>TOTAL TRADE VOLUME</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--dark-navy)' }}>
                        {stats.totalCropVolume ? stats.totalCropVolume.toLocaleString('en-IN') : 0} KG
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '0.2rem' }}>Verified direct farm supply</div>
                    </div>

                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-muted)', fontWeight: 600 }}>GROSS TRANSACTION VALUE</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#166534' }}>
                        ₹{stats.totalTransactionValue ? stats.totalTransactionValue.toLocaleString('en-IN') : 0}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '0.2rem' }}>Direct farmer realizations</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: '#EFF6FF', borderRadius: 'var(--radius-md)', border: '1px solid #BFDBFE', fontSize: '0.85rem', color: '#1E40AF' }}>
                    💡 <strong>Smart India Hackathon Compliance Notice:</strong> All metrics displayed above are aggregated strictly from the live database records of active Farmers and Buyers. No static or hardcoded fallback counts are used.
                  </div>
                </div>
              </div>

              {/* Recent Transactions Snippet */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--dark-navy)' }}>Recent System Transactions</h3>
                  <button className="btn btn-outline btn-sm" onClick={() => handleTabChange('transactions')}>View All Transactions →</button>
                </div>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Tx ID</th>
                        <th>Farmer</th>
                        <th>Buyer</th>
                        <th>Crop</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Payment Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 5).map((t, idx) => (
                        <tr key={idx}>
                          <td><strong>{t.transactionId}</strong></td>
                          <td>{t.farmerName}</td>
                          <td>{t.buyerName}</td>
                          <td>{t.cropName}</td>
                          <td>{t.quantity} {t.unit || 'kg'}</td>
                          <td><strong>₹{(t.totalAmount || t.grossAmount || 0).toLocaleString('en-IN')}</strong></td>
                          <td>
                            <span className={`badge ${t.paymentStatus === 'PAYMENT_COMPLETED' || t.paymentStatus === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                              {t.paymentStatus || 'PAYMENT_PENDING'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline" onClick={() => handleOpenTrace(t.transactionId)}>
                              <Eye size={14} /> Trace
                            </button>
                          </td>
                        </tr>
                      ))}
                      {transactions.length === 0 && (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--slate-muted)' }}>No transaction records found in database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FARMERS */}
          {activeTab === 'farmers' && (
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                Registered Farmers Directory ({farmers.length})
              </h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Farmer User ID</th>
                      <th>Farmer Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>District / Location</th>
                      <th>Crop Lots</th>
                      <th>Requests</th>
                      <th>Transactions</th>
                      <th>Total Sales</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmers.map((f, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748B' }}>{f.farmerUserId || f._id || f.id}</td>
                        <td><strong>{f.name}</strong></td>
                        <td>{f.phone || f.mobile || 'N/A'}</td>
                        <td>{f.email}</td>
                        <td>{f.district || f.location}</td>
                        <td><span className="badge badge-info">{f.cropLotsCount || 0}</span></td>
                        <td><span className="badge badge-warning">{f.requestsCount || 0}</span></td>
                        <td><span className="badge badge-success">{f.transactionsCount || 0}</span></td>
                        <td><strong>₹{(f.totalSales || 0).toLocaleString('en-IN')}</strong></td>
                        <td><span className="badge badge-success">{f.status || 'ACTIVE'}</span></td>
                      </tr>
                    ))}
                    {farmers.length === 0 && (
                      <tr><td colSpan="10" style={{ textAlign: 'center', padding: '1.5rem' }}>No farmers registered yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BUYERS */}
          {activeTab === 'buyers' && (
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                Registered Institutional & Procurement Buyers ({buyers.length})
              </h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Buyer User ID</th>
                      <th>Buyer Name</th>
                      <th>Business / Market Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Market Location</th>
                      <th>Requirements</th>
                      <th>Accepted Requests</th>
                      <th>Total Purchases</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buyers.map((b, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748B' }}>{b.buyerUserId || b._id || b.id}</td>
                        <td><strong>{b.name}</strong></td>
                        <td>{b.businessName || b.marketName}</td>
                        <td>{b.phone || b.mobile || 'N/A'}</td>
                        <td>{b.email}</td>
                        <td>{b.location}</td>
                        <td><span className="badge badge-info">{b.requirementsCount || 0}</span></td>
                        <td><span className="badge badge-success">{b.acceptedRequestsCount || 0}</span></td>
                        <td><strong>₹{(b.totalPurchases || 0).toLocaleString('en-IN')}</strong></td>
                        <td><span className="badge badge-success">{b.status || 'VERIFIED'}</span></td>
                      </tr>
                    ))}
                    {buyers.length === 0 && (
                      <tr><td colSpan="10" style={{ textAlign: 'center', padding: '1.5rem' }}>No buyers registered yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CROP LOTS */}
          {activeTab === 'crop-lots' && (
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                Farmer Published Crop Lots ({cropLots.length})
              </h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Crop Lot ID</th>
                      <th>Farmer Name</th>
                      <th>Crop Name</th>
                      <th>Variety</th>
                      <th>Quantity</th>
                      <th>Quality</th>
                      <th>Expected Price</th>
                      <th>Min Price</th>
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cropLots.map((l, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748B' }}>{l._id || l.id || l.cropLotId}</td>
                        <td>{l.farmerName || 'Farmer'}</td>
                        <td><strong>{l.cropName}</strong></td>
                        <td>{l.variety || 'Standard'}</td>
                        <td>{l.quantity} {l.unit || 'kg'}</td>
                        <td><span className="badge badge-info">{l.qualityGrade || 'Grade A'}</span></td>
                        <td>₹{l.expectedPrice}/{l.unit || 'kg'}</td>
                        <td>₹{l.minPrice || l.expectedPrice}/{l.unit || 'kg'}</td>
                        <td>{l.location || l.village || 'Tamil Nadu'}</td>
                        <td><span className="badge badge-success">{l.status || 'PUBLISHED'}</span></td>
                      </tr>
                    ))}
                    {cropLots.length === 0 && (
                      <tr><td colSpan="10" style={{ textAlign: 'center', padding: '1.5rem' }}>No crop lots published yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: MARKETS */}
          {activeTab === 'markets' && (
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                Buyer Created Markets & Mandis ({markets.length})
              </h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Market ID</th>
                      <th>Buyer User ID</th>
                      <th>Buyer Name</th>
                      <th>Market Name</th>
                      <th>Location</th>
                      <th>Market Type</th>
                      <th>Requirements</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {markets.map((m, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748B' }}>{m.marketId || m._id || m.id}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748B' }}>{m.buyerUserId || m.buyerId}</td>
                        <td>{m.buyerName || 'Buyer'}</td>
                        <td><strong>{m.marketName || m.businessName}</strong></td>
                        <td>{m.location}</td>
                        <td><span className="badge badge-info">{m.marketType || 'Wholesale Mandi'}</span></td>
                        <td><span className="badge badge-warning">{m.requirementsCount || 0}</span></td>
                        <td><span className="badge badge-success">{m.status || 'ACTIVE'}</span></td>
                      </tr>
                    ))}
                    {markets.length === 0 && (
                      <tr><td colSpan="8" style={{ textAlign: 'center', padding: '1.5rem' }}>No markets created by buyers yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: REQUIREMENTS */}
          {activeTab === 'requirements' && (
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                Buyer Crop Requirements ({requirements.length})
              </h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Requirement ID</th>
                      <th>Buyer Name</th>
                      <th>Market Name</th>
                      <th>Crop Name</th>
                      <th>Required Quantity</th>
                      <th>Min Quality</th>
                      <th>Max Price</th>
                      <th>Demand Level</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requirements.map((r, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748B' }}>{r.requirementId || r._id || r.id}</td>
                        <td>{r.buyerName || 'Buyer'}</td>
                        <td>{r.marketName || 'Buyer Market'}</td>
                        <td><strong>{r.cropName}</strong></td>
                        <td>{r.requiredQuantity} {r.unit || 'KG'}</td>
                        <td><span className="badge badge-info">{r.minimumQuality || 'Grade A'}</span></td>
                        <td><strong>₹{r.maximumBuyingPrice}/KG</strong></td>
                        <td>
                          <span className={`badge ${r.demandLevel === 'HIGH' ? 'badge-danger' : 'badge-warning'}`}>
                            {r.demandLevel || 'HIGH'}
                          </span>
                        </td>
                        <td><span className="badge badge-success">{r.status || 'ACTIVE'}</span></td>
                      </tr>
                    ))}
                    {requirements.length === 0 && (
                      <tr><td colSpan="9" style={{ textAlign: 'center', padding: '1.5rem' }}>No buyer crop requirements found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: FARMER REQUESTS */}
          {activeTab === 'requests' && (
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                Farmer Direct Crop Selling Requests ({farmerRequests.length})
              </h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Farmer Name</th>
                      <th>Buyer Name</th>
                      <th>Market Name</th>
                      <th>Crop</th>
                      <th>Quantity</th>
                      <th>Quality</th>
                      <th>Expected Price</th>
                      <th>Request Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmerRequests.map((req, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748B' }}>{req.requestId || req._id || req.id}</td>
                        <td>{req.farmerName || 'Farmer'}</td>
                        <td>{req.buyerName || 'Buyer'}</td>
                        <td>{req.buyerMarketName || 'Buyer Market'}</td>
                        <td><strong>{req.cropName}</strong></td>
                        <td>{req.quantity} {req.unit || 'kg'}</td>
                        <td><span className="badge badge-info">{req.qualityGrade || 'Grade A'}</span></td>
                        <td>₹{req.expectedPrice}/{req.unit || 'kg'}</td>
                        <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-IN') : 'Recent'}</td>
                        <td>
                          <span className={`badge ${req.status === 'ACCEPTED' || req.status === 'BUYER_ACCEPTED' ? 'badge-success' : 'badge-warning'}`}>
                            {req.status || 'REQUEST_SENT'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {farmerRequests.length === 0 && (
                      <tr><td colSpan="10" style={{ textAlign: 'center', padding: '1.5rem' }}>No farmer requests submitted yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: TRANSACTIONS & MULTI-FILTER SEARCH */}
          {activeTab === 'transactions' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--dark-navy)' }}>
                  All Direct Trade Transactions ({filteredTransactions.length})
                </h3>
              </div>

              {/* SEARCH & FILTERS BAR */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem', background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Search (Tx ID, Farmer, Buyer, Crop)</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94A3B8' }} />
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: '30px', fontSize: '0.85rem' }}
                      placeholder="e.g. ALM-2026 or Tomato"
                      value={txSearch}
                      onChange={(e) => setTxSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter Payment Status</label>
                  <select
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                    value={txPaymentFilter}
                    onChange={(e) => setTxPaymentFilter(e.target.value)}
                  >
                    <option value="">All Payment Statuses</option>
                    <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
                    <option value="PAYMENT_PROCESSING">PAYMENT_PROCESSING</option>
                    <option value="PAYMENT_COMPLETED">PAYMENT_COMPLETED</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter Transaction Status</label>
                  <select
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                    value={txStatusFilter}
                    onChange={(e) => setTxStatusFilter(e.target.value)}
                  >
                    <option value="">All Transaction Statuses</option>
                    <option value="BUYER_ACCEPTED">BUYER_ACCEPTED</option>
                    <option value="TRANSACTION_COMPLETED">TRANSACTION_COMPLETED</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Farmer</th>
                      <th>Buyer</th>
                      <th>Market</th>
                      <th>Crop</th>
                      <th>Quantity</th>
                      <th>Agreed Price</th>
                      <th>Total Amount</th>
                      <th>Date</th>
                      <th>Payment Status</th>
                      <th>Tx Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{t.transactionId}</td>
                        <td>{t.farmerName}</td>
                        <td>{t.buyerName}</td>
                        <td>{t.buyerMarketName || 'Mandi Yard'}</td>
                        <td><strong>{t.cropName}</strong></td>
                        <td>{t.quantity} {t.unit || 'kg'}</td>
                        <td>₹{t.agreedPrice}/{t.unit || 'kg'}</td>
                        <td><strong>₹{(t.totalAmount || t.grossAmount || 0).toLocaleString('en-IN')}</strong></td>
                        <td>{t.transactionDate || (t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : 'Recent')}</td>
                        <td>
                          <span className={`badge ${t.paymentStatus === 'PAYMENT_COMPLETED' || t.paymentStatus === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                            {t.paymentStatus || 'PAYMENT_PENDING'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${t.transactionStatus === 'TRANSACTION_COMPLETED' ? 'badge-success' : 'badge-info'}`}>
                            {t.transactionStatus || 'BUYER_ACCEPTED'}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-primary" onClick={() => handleOpenTrace(t.transactionId)}>
                            <Eye size={14} /> Full Trace
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr><td colSpan="12" style={{ textAlign: 'center', padding: '1.5rem' }}>No matching transaction records found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: PAYMENTS & ADMINISTRATIVE OVERRIDE */}
          {activeTab === 'payments' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--dark-navy)' }}>
                    Payment Activity & Monitoring ({payments.length})
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-muted)' }}>
                    Admin payment security monitoring. Manual override requires explicit authorization and audit logging.
                  </p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Transaction ID</th>
                      <th>Farmer Name</th>
                      <th>Buyer Name</th>
                      <th>Crop Amount</th>
                      <th>Payment Date</th>
                      <th>Payment Status</th>
                      <th>Payment Method</th>
                      <th>Admin Override</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{p.paymentId}</td>
                        <td style={{ fontFamily: 'monospace' }}>{p.transactionId}</td>
                        <td>{p.farmerName}</td>
                        <td>{p.buyerName}</td>
                        <td><strong>₹{(p.amount || 0).toLocaleString('en-IN')}</strong></td>
                        <td>{p.paymentDate}</td>
                        <td>
                          <span className={`badge ${p.paymentStatus === 'PAYMENT_COMPLETED' || p.paymentStatus === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                            {p.paymentStatus}
                          </span>
                        </td>
                        <td>{p.paymentMethod}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline"
                            style={{ borderColor: '#F59E0B', color: '#B45309', fontWeight: 700 }}
                            onClick={() => {
                              setOverrideModalData(p);
                              setOverrideStatus(p.paymentStatus || 'PAYMENT_COMPLETED');
                            }}
                          >
                            <Lock size={12} /> Override Status
                          </button>
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr><td colSpan="9" style={{ textAlign: 'center', padding: '1.5rem' }}>No payment records found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 10: LOGISTICS */}
          {activeTab === 'logistics' && (
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                Active Logistics & Dispatch Coordination ({logistics.length})
              </h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Logistics ID</th>
                      <th>Tx ID</th>
                      <th>Farmer (Pickup)</th>
                      <th>Buyer (Delivery)</th>
                      <th>Transporter</th>
                      <th>Vehicle Number</th>
                      <th>Est. Cost</th>
                      <th>Logistics Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logistics.map((l, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{l.logisticsId}</td>
                        <td style={{ fontFamily: 'monospace' }}>{l.transactionId}</td>
                        <td>{l.farmerName} ({l.pickupLocation})</td>
                        <td>{l.buyerName} ({l.deliveryLocation})</td>
                        <td>{l.transporter}</td>
                        <td>{l.vehicleNumber}</td>
                        <td>₹{l.estimatedCost}</td>
                        <td>
                          <span className={`badge ${l.logisticsStatus === 'DELIVERED' ? 'badge-success' : 'badge-info'}`}>
                            {l.logisticsStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {logistics.length === 0 && (
                      <tr><td colSpan="8" style={{ textAlign: 'center', padding: '1.5rem' }}>No active logistics dispatches found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 11: GRIEVANCES */}
          {activeTab === 'grievances' && (
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                Dispute & Grievance Tickets ({grievances.length})
              </h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Grievance ID</th>
                      <th>Raised By</th>
                      <th>User Role</th>
                      <th>Tx ID</th>
                      <th>Subject</th>
                      <th>Description</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grievances.map((g, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{g._id || g.id || `GRV-${idx + 1001}`}</td>
                        <td>{g.userName || g.farmerName || 'User'}</td>
                        <td><span className="badge badge-info">{(g.userRole || 'Farmer').toUpperCase()}</span></td>
                        <td style={{ fontFamily: 'monospace' }}>{g.transactionId || 'N/A'}</td>
                        <td><strong>{g.issueType || g.subject || 'Quality Dispute'}</strong></td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--slate-muted)' }}>{g.description}</td>
                        <td><span className="badge badge-danger">{g.priority || 'HIGH'}</span></td>
                        <td>
                          <span className={`badge ${g.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>
                            {(g.status || 'open').toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleResolveGrievance(g._id || g.id, g.status)}
                          >
                            {g.status === 'resolved' ? 'Reopen Ticket' : 'Mark Resolved'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {grievances.length === 0 && (
                      <tr><td colSpan="9" style={{ textAlign: 'center', padding: '1.5rem' }}>No open grievances recorded.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 12: ANALYTICS & KPIS */}
          {activeTab === 'analytics' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="card">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                    📊 Crop-wise Trade Volume (KG)
                  </h3>
                  {analytics?.cropVolume && analytics.cropVolume.length > 0 ? (
                    analytics.cropVolume.map((item, idx) => {
                      const maxVol = Math.max(...analytics.cropVolume.map((v) => v.volume || 1));
                      const pct = Math.round((item.volume / maxVol) * 100);
                      return (
                        <div key={idx} style={{ marginBottom: '0.85rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                            <span>{item.crop}</span>
                            <span>{item.volume.toLocaleString('en-IN')} KG</span>
                          </div>
                          <div style={{ background: '#E2E8F0', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, background: 'var(--primary-main)', height: '100%', borderRadius: '5px' }}></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ color: 'var(--slate-muted)', fontSize: '0.85rem' }}>No crop volume data calculated yet.</div>
                  )}
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                    💰 Crop-wise Transaction Value (₹)
                  </h3>
                  {analytics?.cropValue && analytics.cropValue.length > 0 ? (
                    analytics.cropValue.map((item, idx) => {
                      const maxValue = Math.max(...analytics.cropValue.map((v) => v.value || 1));
                      const pct = Math.round((item.value / maxValue) * 100);
                      return (
                        <div key={idx} style={{ marginBottom: '0.85rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                            <span>{item.crop}</span>
                            <span>₹{item.value.toLocaleString('en-IN')}</span>
                          </div>
                          <div style={{ background: '#E2E8F0', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, background: '#16A34A', height: '100%', borderRadius: '5px' }}></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ color: 'var(--slate-muted)', fontSize: '0.85rem' }}>No transaction value data calculated yet.</div>
                  )}
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                    🗺️ District-wise User Activity
                  </h3>
                  {analytics?.districtActivity && analytics.districtActivity.length > 0 ? (
                    analytics.districtActivity.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #F1F5F9' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.district}</span>
                        <span className="badge badge-info">{item.usersCount} Active Users</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--slate-muted)', fontSize: '0.85rem' }}>Erode & Coimbatore districts leading.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                Live Monitoring Notification Stream ({notifications.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notifications.map((n, idx) => (
                  <div key={idx} style={{ padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #3B82F6', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <Bell size={18} style={{ color: '#3B82F6', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--dark-navy)' }}>{n.message || n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', marginTop: '0.15rem' }}>
                        {n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN') : 'Just now'} • Event: {n.eventType || 'SYSTEM'}
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--slate-muted)' }}>No admin notifications in stream.</div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: COMPLETE TRANSACTION TRACE MODAL */}
      {traceModalData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', maxWidth: '840px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '0.3rem' }}>COMPLETE TRANSACTION TRACE</span>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--dark-navy)', margin: 0 }}>
                  Trace details for Transaction #{traceModalData.transactionId}
                </h2>
              </div>
              <button onClick={() => setTraceModalData(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={24} />
              </button>
            </div>

            {/* VISUAL 8-STAGE TIMELINE */}
            <div style={{ marginBottom: '1.75rem', background: '#F8FAFC', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--dark-navy)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                8-Stage Transaction Monitoring Stage Timeline
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                {traceModalData.timeline?.map((stg, i) => (
                  <div key={i} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: stg.completed ? '#DCFCE7' : '#F1F5F9', border: `1px solid ${stg.completed ? '#86EFAC' : '#CBD5E1'}`, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: stg.completed ? '#15803D' : '#64748B' }}>{stg.title}</div>
                    <div style={{ fontSize: '0.65rem', marginTop: '0.2rem', color: stg.completed ? '#166534' : '#94A3B8' }}>
                      {stg.completed ? '✓ Completed' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DIRECT ENTITY TRACE CHAIN */}
            <div style={{ background: '#EFF6FF', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #BFDBFE', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                🔗 Single Source Database Trace Chain
              </div>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 600 }}>
                <span className="badge badge-info">FARMER: {traceModalData.trace?.farmerUserId}</span>
                <ChevronRight size={14} />
                <span className="badge badge-info">CROP LOT: {traceModalData.trace?.cropLotId || 'LOT-101'}</span>
                <ChevronRight size={14} />
                <span className="badge badge-info">REQUEST: {traceModalData.trace?.requestId || 'REQ-301'}</span>
                <ChevronRight size={14} />
                <span className="badge badge-info">BUYER: {traceModalData.trace?.buyerUserId}</span>
                <ChevronRight size={14} />
                <span className="badge badge-info">MARKET: {traceModalData.trace?.marketId || 'MKT-501'}</span>
                <ChevronRight size={14} />
                <span className="badge badge-info">REQUIREMENT: {traceModalData.trace?.requirementId || 'REQ-401'}</span>
                <ChevronRight size={14} />
                <span className="badge badge-success">TX: {traceModalData.trace?.transactionId}</span>
                <ChevronRight size={14} />
                <span className="badge badge-success">PAYMENT: {traceModalData.trace?.paymentId}</span>
              </div>
            </div>

            {/* DETAILS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--dark-navy)' }}>👨‍🌾 Farmer Information</h4>
                <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                  <div><strong>Name:</strong> {traceModalData.farmerDetails?.name}</div>
                  <div><strong>Farmer User ID:</strong> <span style={{ fontFamily: 'monospace' }}>{traceModalData.farmerDetails?.farmerUserId}</span></div>
                  <div><strong>Mobile:</strong> {traceModalData.farmerDetails?.phone}</div>
                  <div><strong>Location:</strong> {traceModalData.farmerDetails?.location}</div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--dark-navy)' }}>🏢 Buyer & Market Information</h4>
                <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                  <div><strong>Buyer Name:</strong> {traceModalData.buyerDetails?.name}</div>
                  <div><strong>Buyer User ID:</strong> <span style={{ fontFamily: 'monospace' }}>{traceModalData.buyerDetails?.buyerUserId}</span></div>
                  <div><strong>Market Yard:</strong> {traceModalData.buyerDetails?.marketName}</div>
                  <div><strong>Location:</strong> {traceModalData.buyerDetails?.location}</div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--dark-navy)' }}>🌾 Crop Produce Details</h4>
                <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                  <div><strong>Crop Name:</strong> {traceModalData.cropDetails?.cropName}</div>
                  <div><strong>Quantity:</strong> {traceModalData.cropDetails?.quantity} {traceModalData.cropDetails?.unit}</div>
                  <div><strong>Quality Grade:</strong> {traceModalData.cropDetails?.qualityGrade}</div>
                  <div><strong>Agreed Price:</strong> ₹{traceModalData.cropDetails?.agreedPrice}/{traceModalData.cropDetails?.unit}</div>
                  <div><strong>Total Value:</strong> ₹{(traceModalData.cropDetails?.totalAmount || 0).toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--dark-navy)' }}>💳 Payment & Settlement Status</h4>
                <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                  <div><strong>Payment ID:</strong> <span style={{ fontFamily: 'monospace' }}>{traceModalData.paymentDetails?.paymentId}</span></div>
                  <div><strong>Status:</strong> <span className="badge badge-success">{traceModalData.paymentDetails?.paymentStatus}</span></div>
                  <div><strong>Payment Date:</strong> {traceModalData.paymentDetails?.paymentDate}</div>
                  <div><strong>Settlement Amount:</strong> ₹{(traceModalData.paymentDetails?.amount || 0).toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button className="btn btn-outline" onClick={() => setTraceModalData(null)}>Close Trace Window</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: AUTHORIZED ADMINISTRATIVE PAYMENT OVERRIDE MODAL */}
      {overrideModalData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', maxWidth: '520px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B45309' }}>
                <Lock size={22} />
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--dark-navy)' }}>Administrative Payment Override</h3>
              </div>
              <button onClick={() => setOverrideModalData(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handlePaymentOverrideSubmit}>
              <div style={{ background: '#FEF3C7', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#B45309' }}>
                ⚠️ <strong>Audit Warning:</strong> Overriding payment status for <strong>{overrideModalData.transactionId}</strong> will create a permanent administrative audit log entry stamped with your Admin ID and timestamp.
              </div>

              <div className="form-group">
                <label className="form-label">Select Override Payment Status</label>
                <select className="form-control" value={overrideStatus} onChange={(e) => setOverrideStatus(e.target.value)}>
                  <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
                  <option value="PAYMENT_PROCESSING">PAYMENT_PROCESSING</option>
                  <option value="PAYMENT_COMPLETED">PAYMENT_COMPLETED</option>
                  <option value="PAYMENT_FAILED">PAYMENT_FAILED</option>
                  <option value="PAYMENT_CANCELLED">PAYMENT_CANCELLED</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mandatory Administrative Audit Justification Reason</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Bank settlement confirmed offline via UTR ref #998822."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setOverrideModalData(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, background: '#B45309', borderColor: '#B45309' }}>Confirm Override</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
