const Market = require('../models/Market');
const MarketRequirement = require('../models/MarketRequirement');
const { analyzeCropOptions } = require('../services/recommendationService');
const { getDB, saveDB } = require('../services/dbStore');

exports.getMarkets = async (req, res) => {
  try {
    const { buyerId } = req.query;
    let list = [];
    try {
      list = await Market.find();
    } catch (e) {}

    const db = getDB();
    if (!list || list.length === 0) {
      list = db.markets || [];
    }

    if (buyerId) {
      list = list.filter((m) => String(m.buyerId || m.buyerUserId) === String(buyerId));
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMarket = async (req, res) => {
  try {
    const {
      buyerName,
      businessName,
      marketName,
      mobileNumber,
      email,
      location,
      district,
      state,
      address,
      latitude,
      longitude,
      marketType
    } = req.body;

    const buyerId = req.user ? (req.user.id || req.user._id) : (req.body.buyerUserId || req.body.buyerId || 'usr_buyer');

    const newMkt = {
      _id: 'mkt_' + Date.now(),
      id: 'mkt_' + Date.now(),
      buyerId: String(buyerId),
      buyerUserId: String(buyerId),
      buyerName: buyerName || (req.user ? req.user.name : 'Buyer'),
      mobileNumber: mobileNumber || (req.user ? (req.user.phone || req.user.mobile) : '+919876543210'),
      email: email || (req.user ? req.user.email : ''),
      marketName: marketName || 'Wholesale APMC Market',
      businessName: businessName || 'Agro Wholesale Pvt Ltd',
      location: location || 'Erode, Tamil Nadu',
      district: district || 'Erode',
      state: state || 'Tamil Nadu',
      address: address || 'Main APMC Market Complex',
      latitude: Number(latitude) || 11.341,
      longitude: Number(longitude) || 77.7172,
      marketType: marketType || 'Wholesale Market',
      modalPrice: 35,
      createdAt: new Date().toISOString()
    };

    const db = getDB();
    db.markets.unshift(newMkt);
    saveDB(db);

    try {
      const m = new Market(newMkt);
      await m.save();
    } catch (e) {}

    res.status(201).json({ message: 'Buyer Market created successfully!', market: newMkt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRequirements = async (req, res) => {
  try {
    const { id: marketId } = req.params;
    const { buyerId, status } = req.query;
    const currentUserId = req.user ? (req.user.id || req.user._id) : null;
    const targetBuyerId = buyerId || currentUserId;

    let list = [];
    try {
      list = await MarketRequirement.find();
    } catch (e) {}

    const db = getDB();
    if (!list || list.length === 0) {
      list = db.requirements || [];
    }

    if (targetBuyerId) {
      list = list.filter((r) => String(r.buyerId || r.buyerUserId) === String(targetBuyerId));
    } else if (marketId && marketId !== 'all') {
      list = list.filter((r) => r.marketId === marketId);
    }

    if (status) {
      list = list.filter((r) => (r.status === status || r.requirementStatus === status));
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addRequirement = async (req, res) => {
  try {
    const { id: marketIdParam } = req.params;
    const { crop, cropName, category, requiredQuantity, requiredQuantityMin, requiredQuantityMax, requiredQualityGrade, minimumQuality, maximumPrice, maximumBuyingPrice, expectedPriceMin, expectedPriceMax, demandLevel, status, requirementStatus, unit } = req.body;

    const buyerId = req.user ? (req.user.id || req.user._id) : (req.body.buyerUserId || req.body.buyerId);
    if (!buyerId) {
      return res.status(401).json({ message: '401 Unauthorized: Authentication token required to add crop requirements.' });
    }

    const db = getDB();
    const userMarket = (db.markets || []).find((m) => String(m.buyerId || m.buyerUserId) === String(buyerId));
    const finalMarketId = marketIdParam || (userMarket ? (userMarket._id || userMarket.id) : `mkt_${buyerId}`);
    const finalMarketName = userMarket ? userMarket.marketName : (req.body.marketName || 'Wholesale APMC Market');
    const finalBuyerName = req.user ? req.user.name : (userMarket ? userMarket.buyerName : 'Buyer');

    const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const generatedId = 'req_' + Date.now();

    const maxPriceVal = Number(maximumPrice) || Number(maximumBuyingPrice) || Number(expectedPriceMax) || 40;
    const qtyVal = Number(requiredQuantity) || Number(requiredQuantityMin) || 1000;
    const qualVal = minimumQuality || requiredQualityGrade || 'Grade A';
    const statusVal = status || requirementStatus || 'ACTIVE'; // Must default to ACTIVE

    const reqObj = {
      _id: generatedId,
      id: generatedId,
      marketId: finalMarketId,
      marketName: finalMarketName,
      buyerId: String(buyerId),
      buyerUserId: String(buyerId),
      buyerName: finalBuyerName,
      buyerMobileNumber: req.user ? (req.user.phone || req.user.mobile || req.user.mobileNumber) : '+919876543211',
      crop: crop || cropName || 'Tomato',
      cropName: cropName || crop || 'Tomato',
      category: category || 'Vegetables',
      requiredQuantity: qtyVal,
      requiredQuantityMin: qtyVal,
      requiredQuantityMax: Number(requiredQuantityMax) || qtyVal * 2,
      unit: unit || 'KG',
      minimumQuality: qualVal,
      requiredQualityGrade: qualVal,
      maximumPrice: maxPriceVal,
      maximumBuyingPrice: maxPriceVal,
      expectedPriceMin: Number(expectedPriceMin) || maxPriceVal * 0.85,
      expectedPriceMax: maxPriceVal,
      demandLevel: demandLevel || 'High Demand',
      status: statusVal,
      requirementStatus: statusVal,
      dateAdded: todayStr,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.requirements.unshift(reqObj);
    saveDB(db);

    try {
      const r = new MarketRequirement(reqObj);
      await r.save();
    } catch (e) {}

    res.status(201).json({ message: 'Requirement added successfully!', requirement: reqObj });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRequirement = async (req, res) => {
  try {
    const { reqId } = req.params;
    const currentUserId = req.user ? (req.user.id || req.user._id) : null;

    const db = getDB();
    let item = (db.requirements || []).find((r) => r._id === reqId || r.id === reqId);
    if (!item) {
      try {
        item = await MarketRequirement.findById(reqId);
      } catch (e) {}
    }

    if (!item) {
      return res.status(404).json({ message: 'Requirement not found' });
    }

    // Ownership authorization check
    if (currentUserId && String(item.buyerId || item.buyerUserId) !== String(currentUserId)) {
      return res.status(403).json({ message: '403 Access Denied: You can manage only your own market requirements.' });
    }

    const { crop, cropName, requiredQuantity, minimumQuality, requiredQualityGrade, maximumPrice, maximumBuyingPrice, demandLevel, status, requirementStatus } = req.body;

    if (crop || cropName) {
      item.crop = crop || cropName;
      item.cropName = cropName || crop;
    }
    if (requiredQuantity) item.requiredQuantity = Number(requiredQuantity);
    if (minimumQuality || requiredQualityGrade) {
      item.minimumQuality = minimumQuality || requiredQualityGrade;
      item.requiredQualityGrade = minimumQuality || requiredQualityGrade;
    }
    if (maximumPrice || maximumBuyingPrice) {
      item.maximumPrice = Number(maximumPrice || maximumBuyingPrice);
      item.maximumBuyingPrice = Number(maximumPrice || maximumBuyingPrice);
    }
    if (demandLevel) item.demandLevel = demandLevel;
    if (status || requirementStatus) {
      item.status = status || requirementStatus;
      item.requirementStatus = status || requirementStatus;
    }
    item.updatedAt = new Date().toISOString();

    const itemIdx = db.requirements.findIndex((r) => r._id === reqId || r.id === reqId);
    if (itemIdx !== -1) {
      db.requirements[itemIdx] = item;
      saveDB(db);
    }

    try {
      await MarketRequirement.findByIdAndUpdate(reqId, item);
    } catch (e) {}

    res.json({ message: 'Requirement updated successfully!', requirement: item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRequirement = async (req, res) => {
  try {
    const { reqId } = req.params;
    const currentUserId = req.user ? (req.user.id || req.user._id) : null;

    const db = getDB();
    let idx = (db.requirements || []).findIndex((r) => r._id === reqId || r.id === reqId);
    if (idx !== -1) {
      const item = db.requirements[idx];
      if (currentUserId && String(item.buyerId || item.buyerUserId) !== String(currentUserId)) {
        return res.status(403).json({ message: '403 Access Denied: You can delete only your own market requirements.' });
      }
      db.requirements.splice(idx, 1);
      saveDB(db);
    }

    try {
      await MarketRequirement.findByIdAndDelete(reqId);
    } catch (e) {}

    res.json({ message: 'Requirement deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAIRecommendation = (req, res) => {
  try {
    const { cropName = 'Turmeric', quantity = 10, expectedPrice = 3000, location = 'Erode' } = req.body;
    const result = analyzeCropOptions(cropName, quantity, expectedPrice, location);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
