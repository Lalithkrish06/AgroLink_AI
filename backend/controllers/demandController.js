const DailyCropDemand = require('../models/DailyCropDemand');

let inMemoryDemands = [];

exports.getDemands = async (req, res) => {
  try {
    const { buyerId, cropName } = req.query;
    let list = [];
    try {
      list = await DailyCropDemand.find().sort({ createdAt: -1 });
    } catch (e) {}

    if (!list || list.length === 0) {
      list = inMemoryDemands;
    }

    // Filter by buyerId if specified
    let filtered = list;
    if (buyerId) {
      filtered = filtered.filter((d) => d.buyerId === buyerId);
    }
    if (cropName) {
      filtered = filtered.filter((d) => d.cropName.toLowerCase().includes(cropName.toLowerCase()));
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDemand = async (req, res) => {
  try {
    const {
      cropName,
      cropCategory,
      requiredQuantity,
      unit,
      requiredQuality,
      maximumPrice,
      demandLevel,
      requiredDate,
      expiryDate,
      location,
      marketName
    } = req.body;

    const buyerId = req.user ? req.user.id : req.body.buyerId;
    const buyerName = req.user ? req.user.name : req.body.buyerName || 'Buyer';

    const newDemand = {
      _id: 'demand_' + Date.now(),
      buyerId,
      buyerName,
      buyerMobileNumber: req.user?.phone || req.user?.mobileNumber || '+919876543210',
      buyerEmail: req.user?.email || '',
      marketName: marketName || 'APMC Mandi Market',
      location: location || 'Erode, Tamil Nadu',
      cropName: cropName || 'Tomato',
      cropCategory: cropCategory || 'Vegetables',
      requiredQuantity: Number(requiredQuantity) || 1000,
      unit: unit || 'kg',
      requiredQuality: requiredQuality || 'Grade A',
      maximumPrice: Number(maximumPrice) || 40,
      demandLevel: demandLevel || 'High',
      requiredDate: requiredDate || '10 September 2026',
      expiryDate: expiryDate || '20 September 2026',
      status: 'ACTIVE',
      createdAt: new Date()
    };

    inMemoryDemands.unshift(newDemand);

    try {
      const doc = new DailyCropDemand(newDemand);
      await doc.save();
    } catch (e) {}

    res.status(201).json({
      message: 'Daily Crop Demand created successfully!',
      demand: newDemand
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDemand = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await DailyCropDemand.findByIdAndDelete(id);
    } catch (e) {}

    inMemoryDemands = inMemoryDemands.filter((d) => d._id !== id && d.id !== id);
    res.json({ message: 'Demand removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
