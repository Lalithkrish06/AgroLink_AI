const mongoose = require('mongoose');

const dailyCropDemandSchema = new mongoose.Schema({
  buyerId: { type: String, required: true },
  buyerName: { type: String, required: true },
  buyerMobileNumber: { type: String, default: '+919876543210' },
  buyerEmail: { type: String },
  marketName: { type: String, default: 'Central Wholesale Market' },
  location: { type: String, default: 'Erode, Tamil Nadu' },
  cropName: { type: String, required: true },
  cropCategory: { type: String, default: 'Vegetables' },
  requiredQuantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  requiredQuality: { type: String, default: 'Grade A' },
  maximumPrice: { type: Number, required: true },
  demandLevel: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' },
  requiredDate: { type: String, default: '10 September 2026' },
  expiryDate: { type: String, default: '20 September 2026' },
  status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'FULFILLED'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DailyCropDemand', dailyCropDemandSchema);
