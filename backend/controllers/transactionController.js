const Transaction = require('../models/Transaction');
const { addNotification } = require('./notificationController');
const { getDB, saveDB } = require('../services/dbStore');

exports.getTransactions = async (req, res) => {
  try {
    const { farmerId, buyerId } = req.query;
    const currentUserId = req.user ? (req.user.id || req.user._id) : null;
    const currentUserRole = req.user ? req.user.role : null;

    let list = [];
    try {
      list = await Transaction.find().sort({ createdAt: -1 });
    } catch (e) {}

    const db = getDB();
    if (!list || list.length === 0) {
      list = db.transactions || [];
    }

    const filtered = list.filter((tx) => {
      const txFarmer = String(tx.farmerId || tx.farmerUserId);
      const txBuyer = String(tx.buyerId || tx.buyerUserId);
      const txDriver = String(tx.driverId || tx.driverUserId);

      if (farmerId && txFarmer === String(farmerId)) return true;
      if (buyerId && txBuyer === String(buyerId)) return true;

      if (currentUserRole === 'farmer' && currentUserId) {
        return txFarmer === String(currentUserId);
      }
      if (currentUserRole === 'buyer' && currentUserId) {
        return txBuyer === String(currentUserId);
      }
      if (currentUserRole === 'driver' && currentUserId) {
        return txDriver === String(currentUserId) || !tx.driverUserId;
      }
      if (currentUserRole === 'admin') return true;
      if (!farmerId && !buyerId && !currentUserId) return true;
      return false;
    });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    let tx = (db.transactions || []).find((t) => t._id === id || t.id === id || t.transactionId === id || t.orderId === id);

    if (!tx) {
      try {
        const dbTx = await Transaction.findOne({ $or: [{ _id: id }, { transactionId: id }, { orderId: id }] });
        if (dbTx) tx = dbTx;
      } catch (e) {}
    }

    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { step, transactionStatus, paymentStatus, driverStatus } = req.body;

    const db = getDB();
    let tx = (db.transactions || []).find((t) => t._id === id || t.id === id || t.transactionId === id);

    if (tx) {
      if (step) tx.currentStep = Number(step);
      if (transactionStatus) tx.transactionStatus = transactionStatus;
      if (paymentStatus) tx.paymentStatus = paymentStatus;
      if (driverStatus) tx.driverStatus = driverStatus;
      saveDB(db);
    }

    try {
      await Transaction.findByIdAndUpdate(id, {
        currentStep: Number(step),
        transactionStatus,
        paymentStatus,
        driverStatus
      });
    } catch (e) {}

    res.json({
      message: 'Transaction progress updated!',
      step: Number(step),
      transactionStatus,
      paymentStatus
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    const db = getDB();
    let tx = (db.transactions || []).find((t) => t._id === id || t.id === id || t.transactionId === id);

    if (tx) {
      tx.currentStep = 6;
      tx.transactionStatus = 'TRANSACTION_COMPLETED';
      tx.paymentStatus = 'PAYMENT_COMPLETED';
      tx.paymentDate = today;
      saveDB(db);
    }

    try {
      await Transaction.findByIdAndUpdate(id, {
        currentStep: 6,
        transactionStatus: 'TRANSACTION_COMPLETED',
        paymentStatus: 'PAYMENT_COMPLETED',
        paymentDate: today
      });
    } catch (e) {}

    // Send notifications to Farmer AND Buyer
    if (tx && (tx.farmerId || tx.farmerUserId)) {
      await addNotification({
        recipientId: String(tx.farmerId || tx.farmerUserId),
        userRole: 'farmer',
        type: 'PAYMENT_RECEIVED',
        title: 'Payment Completed Successfully.',
        message: `Payment of ₹${(tx.totalAmount || tx.grossAmount || 40000).toLocaleString()} completed for ${tx.cropName} (Transaction ${tx.transactionId}).`,
        transactionId: tx.transactionId
      });
    }

    if (tx && (tx.buyerId || tx.buyerUserId)) {
      await addNotification({
        recipientId: String(tx.buyerId || tx.buyerUserId),
        userRole: 'buyer',
        type: 'PAYMENT_COMPLETED',
        title: 'Payment Completed Successfully.',
        message: `Payment of ₹${(tx.totalAmount || tx.grossAmount || 40000).toLocaleString()} completed for ${tx.cropName} (Transaction ${tx.transactionId}).`,
        transactionId: tx.transactionId
      });
    }

    res.json({
      message: 'Payment Completed Successfully.',
      paymentStatus: 'PAYMENT_COMPLETED',
      transactionStatus: 'TRANSACTION_COMPLETED',
      paymentDate: today,
      transaction: tx
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.processPay = exports.updatePayment;

exports.getBill = async (req, res) => {
  return exports.getTransactionById(req, res);
};

exports.getBillPdf = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    let tx = (db.transactions || []).find((t) => t._id === id || t.id === id || t.transactionId === id || t.orderId === id);

    if (!tx) {
      try {
        const dbTx = await Transaction.findOne({ $or: [{ _id: id }, { transactionId: id }, { orderId: id }] });
        if (dbTx) tx = dbTx;
      } catch (e) {}
    }

    if (!tx) return res.status(404).json({ message: 'Transaction not found for PDF bill generation' });

    const pdfBillData = {
      header: 'Agro Link Market Official Financial Receipt',
      transactionId: tx.transactionId || id,
      transactionDate: tx.transactionDate || tx.createdAt || new Date().toISOString(),
      farmerDetails: {
        farmerName: tx.farmerName || tx.farmerDetails?.name || 'Farmer',
        farmerMobile: tx.farmerPhone || tx.farmerDetails?.phone || '+91 9876543210',
        farmerLocation: tx.farmerLocation || tx.farmerDetails?.location || 'Erode, Tamil Nadu',
        farmerUserId: tx.farmerUserId || tx.farmerId
      },
      buyerDetails: {
        buyerName: tx.buyerName || tx.buyerDetails?.name || 'Buyer Market',
        marketName: tx.buyerMarketName || tx.marketName || tx.buyerDetails?.marketName || 'Wholesale Mandi',
        buyerPhone: tx.buyerPhone || tx.buyerDetails?.phone || '+91 9876543211',
        buyerUserId: tx.buyerUserId || tx.buyerId
      },
      cropDetails: {
        cropName: tx.cropName || tx.cropDetails?.cropName || 'Tomato',
        quantity: tx.quantity || tx.cropDetails?.quantity || 1000,
        unit: tx.unit || tx.cropDetails?.unit || 'kg',
        qualityGrade: tx.qualityGrade || tx.quality || tx.cropDetails?.qualityGrade || 'Grade A',
        agreedPrice: tx.agreedPrice || 35,
        totalAmount: tx.totalAmount || tx.grossAmount || (tx.quantity * tx.agreedPrice) || 35000
      },
      financialBreakdown: {
        grossAmount: tx.grossAmount || tx.totalAmount || 35000,
        transportCost: tx.transportCost || 1800,
        platformFee: tx.platformFee || 700,
        otherCharges: tx.otherCharges || 100,
        finalNetPayment: tx.finalNetPayment || tx.netAmountToFarmer || 32400
      },
      paymentStatus: tx.paymentStatus || 'PENDING',
      transactionStatus: tx.transactionStatus || 'TRANSACTION_CREATED',
      generatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Payment Bill PDF data generated successfully',
      bill: pdfBillData
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generatePaymentLink = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    let tx = (db.transactions || []).find((t) => t._id === id || t.id === id || t.transactionId === id || t.orderId === id);

    if (!tx) {
      try {
        const dbTx = await Transaction.findOne({ $or: [{ _id: id }, { transactionId: id }, { orderId: id }] });
        if (dbTx) tx = dbTx;
      } catch (e) {}
    }

    if (!tx) return res.status(404).json({ message: 'Transaction not found for payment link' });

    const totalAmt = tx.totalAmount || tx.grossAmount || (tx.quantity * tx.agreedPrice) || 35000;

    res.json({
      success: true,
      transactionId: tx.transactionId || id,
      paymentUrl: `/payment/${tx.transactionId || id}`,
      amount: totalAmt,
      paymentStatus: tx.paymentStatus || 'PENDING',
      isPrototype: true,
      message: 'Demo/Prototype Payment Link Generated Successfully. Payment status is controlled by backend.'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

