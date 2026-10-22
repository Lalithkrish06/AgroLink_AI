const User = require('../models/User');
const CropLot = require('../models/CropLot');
const Offer = require('../models/Offer');
const Market = require('../models/Market');
const MarketRequirement = require('../models/MarketRequirement');
const Transaction = require('../models/Transaction');
const Grievance = require('../models/Grievance');
const Notification = require('../models/Notification');
const { getDB, saveDB } = require('../services/dbStore');
const mongoose = require('mongoose');

const isMongo = () => mongoose.connection.readyState === 1;

// Helper to fetch all records from DB / store
const getDBData = () => {
  return getDB();
};

// 1. GET Admin Dashboard Summary Statistics (100% computed from real DB records)
exports.getDashboardStats = async (req, res) => {
  try {
    const db = getDBData();

    const users = db.users || [];
    const cropLots = db.cropLots || [];
    const offers = db.offers || [];
    const transactions = db.transactions || [];
    const grievances = db.grievances || [];
    const markets = db.markets || [];

    const totalFarmers = users.filter((u) => (u.role || '').toLowerCase() === 'farmer').length;
    const totalBuyers = users.filter((u) => (u.role || '').toLowerCase() === 'buyer').length;
    const totalCropLots = cropLots.length;
    const totalFarmerRequests = offers.length;
    const acceptedRequests = offers.filter((o) => o.status === 'ACCEPTED' || o.status === 'BUYER_ACCEPTED').length;
    const totalTransactions = transactions.length;

    const pendingPayments = transactions.filter((t) => {
      const s = (t.paymentStatus || '').toUpperCase();
      return s === 'PENDING' || s === 'PAYMENT_PENDING' || s === 'PROCESSING' || s === 'PAYMENT_PROCESSING';
    }).length;

    const completedPayments = transactions.filter((t) => {
      const s = (t.paymentStatus || '').toUpperCase();
      return s === 'PAID' || s === 'PAYMENT_COMPLETED' || s === 'COMPLETED';
    }).length;

    const activeLogistics = transactions.filter((t) => {
      const s = (t.transactionStatus || '').toUpperCase();
      return s !== 'TRANSACTION_COMPLETED' && s !== 'COMPLETED' && s !== 'CANCELLED';
    }).length;

    const openGrievances = grievances.filter((g) => (g.status || '').toLowerCase() !== 'resolved').length;

    const totalTransactionValue = transactions.reduce((sum, t) => sum + (Number(t.totalAmount || t.grossAmount) || 0), 0);
    const totalCropVolume = transactions.reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);

    res.json({
      success: true,
      totalFarmers,
      totalBuyers,
      totalCropLots,
      totalFarmerRequests,
      acceptedRequests,
      totalTransactions,
      pendingPayments,
      completedPayments,
      activeLogistics,
      openGrievances,
      totalTransactionValue,
      totalCropVolume,
      activeMarkets: markets.length,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStats = exports.getDashboardStats;

// 2. GET Farmers list with real computed database metrics
exports.getFarmers = async (req, res) => {
  try {
    const db = getDBData();
    const farmers = (db.users || []).filter((u) => (u.role || '').toLowerCase() === 'farmer');
    const cropLots = db.cropLots || [];
    const offers = db.offers || [];
    const transactions = db.transactions || [];

    const result = farmers.map((f) => {
      const fId = String(f._id || f.id);
      const fLots = cropLots.filter((l) => String(l.farmerId || l.farmerUserId) === fId);
      const fRequests = offers.filter((o) => String(o.farmerId || o.farmerUserId) === fId);
      const fTx = transactions.filter((t) => String(t.farmerId || t.farmerUserId) === fId);

      const totalSales = fTx.reduce((sum, t) => sum + (Number(t.finalNetPayment || t.totalAmount || t.grossAmount) || 0), 0);

      return {
        farmerUserId: fId,
        _id: fId,
        id: fId,
        name: f.name || 'Farmer',
        email: f.email || '',
        phone: f.phone || f.mobile || f.mobileNumber || '',
        location: f.location || 'Erode, Tamil Nadu',
        district: f.district || 'Erode',
        registrationDate: f.createdAt || new Date().toISOString(),
        cropLotsCount: fLots.length,
        requestsCount: fRequests.length,
        transactionsCount: fTx.length,
        totalSales,
        status: 'ACTIVE'
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. GET Buyers list with real computed database metrics
exports.getBuyers = async (req, res) => {
  try {
    const db = getDBData();
    const buyers = (db.users || []).filter((u) => (u.role || '').toLowerCase() === 'buyer');
    const markets = db.markets || [];
    const reqs = db.requirements || [];
    const offers = db.offers || [];
    const transactions = db.transactions || [];

    const result = buyers.map((b) => {
      const bId = String(b._id || b.id);
      const bMarket = markets.find((m) => String(m.buyerId || m.buyerUserId) === bId);
      const bReqs = reqs.filter((r) => String(r.buyerId || r.buyerUserId) === bId);
      const incomingReqs = offers.filter((o) => String(o.buyerId || o.buyerUserId) === bId);
      const acceptedReqs = incomingReqs.filter((o) => o.status === 'ACCEPTED' || o.status === 'BUYER_ACCEPTED');
      const bTx = transactions.filter((t) => String(t.buyerId || t.buyerUserId) === bId);

      const totalPurchases = bTx.reduce((sum, t) => sum + (Number(t.totalAmount || t.grossAmount) || 0), 0);

      return {
        buyerUserId: bId,
        _id: bId,
        id: bId,
        name: b.name || 'Buyer',
        businessName: bMarket ? (bMarket.businessName || bMarket.marketName) : 'Agro Wholesale Corp',
        marketName: bMarket ? bMarket.marketName : `${b.name} Market Yard`,
        email: b.email || '',
        phone: b.phone || b.mobile || b.mobileNumber || '',
        location: bMarket ? bMarket.location : (b.location || 'Coimbatore, Tamil Nadu'),
        district: b.district || 'Coimbatore',
        requirementsCount: bReqs.length,
        incomingRequestsCount: incomingReqs.length,
        acceptedRequestsCount: acceptedReqs.length,
        transactionsCount: bTx.length,
        totalPurchases,
        status: 'VERIFIED'
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. GET Crop Lots list
exports.getCropLots = async (req, res) => {
  try {
    const db = getDBData();
    res.json(db.cropLots || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. GET Farmer Requests list
exports.getFarmerRequests = async (req, res) => {
  try {
    const db = getDBData();
    res.json(db.offers || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. GET Buyer Markets list
exports.getMarkets = async (req, res) => {
  try {
    const db = getDBData();
    const markets = db.markets || [];
    const reqs = db.requirements || [];

    const result = markets.map((m) => {
      const mktId = m._id || m.id;
      const bId = String(m.buyerId || m.buyerUserId);
      const mReqs = reqs.filter((r) => r.marketId === mktId || String(r.buyerId || r.buyerUserId) === bId);

      return {
        ...m,
        marketId: mktId,
        buyerUserId: bId,
        requirementsCount: mReqs.length,
        status: 'ACTIVE'
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 7. GET Buyer Requirements list
exports.getRequirements = async (req, res) => {
  try {
    const db = getDBData();
    res.json(db.requirements || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 8. GET Transactions list with filtering/search support
exports.getTransactions = async (req, res) => {
  try {
    const { search, farmer, buyer, crop, paymentStatus, transactionStatus, date } = req.query;
    const db = getDBData();
    let txs = db.transactions || [];

    if (search) {
      const q = search.toLowerCase();
      txs = txs.filter((t) =>
        (t.transactionId || '').toLowerCase().includes(q) ||
        (t.farmerName || '').toLowerCase().includes(q) ||
        (t.buyerName || '').toLowerCase().includes(q) ||
        (t.cropName || '').toLowerCase().includes(q)
      );
    }

    if (farmer) {
      txs = txs.filter((t) => (t.farmerName || '').toLowerCase().includes(farmer.toLowerCase()) || String(t.farmerUserId || t.farmerId) === farmer);
    }

    if (buyer) {
      txs = txs.filter((t) => (t.buyerName || '').toLowerCase().includes(buyer.toLowerCase()) || String(t.buyerUserId || t.buyerId) === buyer);
    }

    if (crop) {
      txs = txs.filter((t) => (t.cropName || '').toLowerCase().includes(crop.toLowerCase()));
    }

    if (paymentStatus) {
      txs = txs.filter((t) => (t.paymentStatus || '').toLowerCase() === paymentStatus.toLowerCase());
    }

    if (transactionStatus) {
      txs = txs.filter((t) => (t.transactionStatus || '').toLowerCase() === transactionStatus.toLowerCase());
    }

    if (date) {
      txs = txs.filter((t) => (t.transactionDate || t.createdAt || '').startsWith(date));
    }

    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 9. GET Complete Transaction Trace (Farmer -> Crop Lot -> Request -> Buyer -> Market -> Requirement -> Transaction -> Payment)
exports.getTransactionTrace = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const db = getDBData();
    const tx = (db.transactions || []).find((t) => t.transactionId === transactionId || t._id === transactionId || t.id === transactionId);

    if (!tx) {
      return res.status(404).json({ message: '404 Not Found: Transaction record not found.' });
    }

    const farmer = (db.users || []).find((u) => String(u._id || u.id) === String(tx.farmerUserId || tx.farmerId));
    const buyer = (db.users || []).find((u) => String(u._id || u.id) === String(tx.buyerUserId || tx.buyerId));
    const cropLot = (db.cropLots || []).find((l) => l._id === tx.cropLotId || l.id === tx.cropLotId || l.cropLotId === tx.cropLotId);
    const request = (db.offers || []).find((o) => o._id === tx.requestId || o.id === tx.requestId || o.requestId === tx.requestId);
    const market = (db.markets || []).find((m) => m._id === tx.marketId || m.id === tx.marketId || String(m.buyerId || m.buyerUserId) === String(tx.buyerUserId || tx.buyerId));
    const requirement = (db.requirements || []).find((r) => r._id === tx.requirementId || r.id === tx.requirementId);

    const stages = [
      { key: 'REQUEST_SENT', title: '1. Request Sent', completed: true, timestamp: request ? request.createdAt : tx.createdAt },
      { key: 'BUYER_RECEIVED', title: '2. Buyer Received', completed: true, timestamp: request ? request.createdAt : tx.createdAt },
      { key: 'BUYER_ACCEPTED', title: '3. Buyer Accepted', completed: true, timestamp: tx.createdAt },
      { key: 'TRANSACTION_CREATED', title: '4. Transaction Created', completed: true, timestamp: tx.createdAt },
      { key: 'PAYMENT_PENDING', title: '5. Payment Pending', completed: true, timestamp: tx.createdAt },
      { key: 'PAYMENT_PROCESSING', title: '6. Payment Processing', completed: tx.paymentStatus === 'PROCESSING' || tx.paymentStatus === 'PAYMENT_PROCESSING' || tx.paymentStatus === 'PAYMENT_COMPLETED' || tx.paymentStatus === 'COMPLETED' || tx.paymentStatus === 'PAID' },
      { key: 'PAYMENT_COMPLETED', title: '7. Payment Completed', completed: tx.paymentStatus === 'PAYMENT_COMPLETED' || tx.paymentStatus === 'COMPLETED' || tx.paymentStatus === 'PAID', timestamp: tx.paymentDate },
      { key: 'TRANSACTION_COMPLETED', title: '8. Transaction Completed', completed: tx.transactionStatus === 'TRANSACTION_COMPLETED' || tx.transactionStatus === 'COMPLETED', timestamp: tx.paymentDate }
    ];

    res.json({
      success: true,
      transactionId: tx.transactionId,
      transaction: tx,
      trace: {
        farmerUserId: tx.farmerUserId || tx.farmerId,
        buyerUserId: tx.buyerUserId || tx.buyerId,
        cropLotId: tx.cropLotId || cropLot?._id || null,
        requestId: tx.requestId || request?._id || null,
        marketId: tx.marketId || market?._id || null,
        requirementId: tx.requirementId || requirement?._id || null,
        transactionId: tx.transactionId,
        paymentId: `PAY-${tx.transactionId}`
      },
      farmerDetails: {
        farmerUserId: tx.farmerUserId || tx.farmerId,
        name: tx.farmerName || farmer?.name || 'Farmer',
        phone: tx.farmerPhone || farmer?.phone || '+919876543210',
        location: tx.farmerLocation || farmer?.location || 'Erode, Tamil Nadu'
      },
      buyerDetails: {
        buyerUserId: tx.buyerUserId || tx.buyerId,
        name: tx.buyerName || buyer?.name || 'Buyer',
        marketName: tx.buyerMarketName || market?.marketName || 'Wholesale Mandi',
        location: market?.location || buyer?.location || 'Erode, Tamil Nadu'
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
        paymentMethod: tx.paymentMethod || 'UPI / NetBanking Prototype'
      },
      timeline: stages
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 10. GET Payments monitoring list
exports.getPayments = async (req, res) => {
  try {
    const db = getDBData();
    const txs = db.transactions || [];

    const payments = txs.map((t) => ({
      paymentId: `PAY-${t.transactionId}`,
      transactionId: t.transactionId,
      farmerUserId: t.farmerUserId || t.farmerId,
      farmerName: t.farmerName || 'Farmer',
      buyerUserId: t.buyerUserId || t.buyerId,
      buyerName: t.buyerName || 'Buyer',
      cropName: t.cropName,
      amount: t.totalAmount || t.grossAmount,
      netPayment: t.finalNetPayment || t.netAmountToFarmer || t.totalAmount,
      paymentDate: t.paymentDate || (t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : 'Pending'),
      paymentStatus: t.paymentStatus || 'PAYMENT_PENDING',
      paymentMethod: t.paymentMethod || 'Direct Bank Transfer / UPI'
    }));

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 11. POST Administrative Authorized Payment Status Override with Audit Logging
exports.overridePayment = async (req, res) => {
  try {
    const { transactionId, newStatus, reason } = req.body;
    const adminUserId = req.user ? (req.user.id || req.user._id) : 'usr_demo_admin';
    const adminName = req.user ? req.user.name : 'System Administrator';

    if (!transactionId || !newStatus || !reason) {
      return res.status(400).json({ message: '400 Bad Request: transactionId, newStatus, and audit reason are required.' });
    }

    const validStatuses = ['PAYMENT_PENDING', 'PAYMENT_PROCESSING', 'PAYMENT_COMPLETED', 'PAYMENT_FAILED', 'PAYMENT_CANCELLED'];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ message: `400 Bad Request: Invalid payment status. Allowed: ${validStatuses.join(', ')}` });
    }

    const db = getDBData();
    const txIndex = (db.transactions || []).findIndex((t) => t.transactionId === transactionId || t._id === transactionId || t.id === transactionId);

    if (txIndex === -1) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const oldStatus = db.transactions[txIndex].paymentStatus || 'PAYMENT_PENDING';
    db.transactions[txIndex].paymentStatus = newStatus;
    if (newStatus === 'PAYMENT_COMPLETED') {
      db.transactions[txIndex].transactionStatus = 'TRANSACTION_COMPLETED';
      db.transactions[txIndex].paymentDate = new Date().toLocaleDateString('en-IN');
    }

    // Save Audit Log
    if (!db.auditLogs) db.auditLogs = [];
    const auditLog = {
      _id: 'audit_' + Date.now(),
      action: 'PAYMENT_OVERRIDE',
      adminUserId,
      adminName,
      transactionId,
      oldStatus,
      newStatus,
      reason,
      timestamp: new Date().toISOString()
    };
    db.auditLogs.unshift(auditLog);
    saveDB(db);

    if (isMongo()) {
      try {
        await Transaction.findOneAndUpdate(
          { transactionId },
          { paymentStatus: newStatus, ...(newStatus === 'PAYMENT_COMPLETED' ? { transactionStatus: 'TRANSACTION_COMPLETED' } : {}) }
        );
      } catch (e) {}
    }

    res.json({
      success: true,
      message: `✅ Authorized Administrative Override Applied for ${transactionId}. Payment status updated to ${newStatus}.`,
      auditLog,
      transaction: db.transactions[txIndex]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 12. GET Grievances list & status management
exports.getGrievances = async (req, res) => {
  try {
    const db = getDBData();
    res.json(db.grievances || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = getDBData();

    const idx = (db.grievances || []).findIndex((g) => g._id === id || g.id === id);
    if (idx !== -1) {
      db.grievances[idx].status = status || 'resolved';
      saveDB(db);
    }

    if (isMongo()) {
      try {
        await Grievance.findByIdAndUpdate(id, { status: status || 'resolved' });
      } catch (e) {}
    }

    res.json({ message: `Grievance ticket status updated to ${status || 'resolved'}`, status: status || 'resolved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 13. GET Logistics monitoring list
exports.getLogistics = async (req, res) => {
  try {
    const db = getDBData();
    const txs = db.transactions || [];

    const logisticsList = txs.map((t, idx) => ({
      logisticsId: `LOG-${t.transactionId}`,
      transactionId: t.transactionId,
      farmerUserId: t.farmerUserId || t.farmerId,
      farmerName: t.farmerName || 'Farmer',
      buyerUserId: t.buyerUserId || t.buyerId,
      buyerName: t.buyerName || 'Buyer',
      pickupLocation: t.pickupLocation || t.farmerLocation || 'Perundurai, Erode',
      deliveryLocation: t.deliveryLocation || t.buyerMarketName || 'Salem Central Market',
      transporter: t.transportCompany || 'FastAgro Logistics Express',
      driverName: t.transportPersonName || 'Rajesh Kumar',
      vehicleType: t.vehicleType || 'Eicher 14ft Covered Truck',
      vehicleNumber: t.vehicleNumber || 'TN-33-AB-1234',
      estimatedCost: t.transportCost || 1800,
      logisticsStatus: t.transactionStatus === 'TRANSACTION_COMPLETED' ? 'DELIVERED' : (t.currentStep >= 3 ? 'IN_TRANSIT' : 'ASSIGNED'),
      createdAt: t.createdAt || new Date().toISOString()
    }));

    res.json(logisticsList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 14. GET Dynamic Analytics (Crop-wise volume, value, district activity, registrations)
exports.getAnalytics = async (req, res) => {
  try {
    const db = getDBData();
    const txs = db.transactions || [];
    const users = db.users || [];
    const cropLots = db.cropLots || [];

    // Crop-wise Aggregation
    const cropVolumeMap = {};
    const cropValueMap = {};

    txs.forEach((t) => {
      const c = t.cropName || 'Other';
      const q = Number(t.quantity) || 0;
      const v = Number(t.totalAmount || t.grossAmount) || 0;

      cropVolumeMap[c] = (cropVolumeMap[c] || 0) + q;
      cropValueMap[c] = (cropValueMap[c] || 0) + v;
    });

    const cropVolumeArray = Object.keys(cropVolumeMap).map((crop) => ({ crop, volume: cropVolumeMap[crop] }));
    const cropValueArray = Object.keys(cropValueMap).map((crop) => ({ crop, value: cropValueMap[crop] }));

    // District-wise activity
    const districtMap = {};
    users.forEach((u) => {
      const d = u.district || 'Erode';
      districtMap[d] = (districtMap[d] || 0) + 1;
    });
    const districtActivity = Object.keys(districtMap).map((district) => ({ district, usersCount: districtMap[district] }));

    res.json({
      success: true,
      cropVolume: cropVolumeArray,
      cropValue: cropValueArray,
      districtActivity,
      totalFarmers: users.filter((u) => (u.role || '').toLowerCase() === 'farmer').length,
      totalBuyers: users.filter((u) => (u.role || '').toLowerCase() === 'buyer').length,
      totalTransactions: txs.length,
      totalCropLots: cropLots.length,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 15. GET Admin Monitoring Notification Feed
exports.getNotifications = async (req, res) => {
  try {
    const db = getDBData();
    const notifs = db.notifications || [];
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update live market price
exports.updateMarketPrice = async (req, res) => {
  try {
    const { mandiName, cropName, newPrice } = req.body;
    const db = getDBData();

    if (!db.marketPrices) db.marketPrices = [];
    const item = { mandiName, cropName, newPrice: Number(newPrice), updatedAt: new Date().toISOString() };
    db.marketPrices.unshift(item);
    saveDB(db);

    if (isMongo()) {
      try {
        await Market.findOneAndUpdate(
          { marketName: mandiName, cropName },
          { modalPrice: Number(newPrice) },
          { upsert: true }
        );
      } catch (e) {}
    }

    res.json({ message: `Live Mandi Price updated for ${mandiName} (${cropName}): ₹${newPrice}/Qtl`, price: item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
