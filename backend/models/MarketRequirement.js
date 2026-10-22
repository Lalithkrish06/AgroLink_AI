const mongoose = require('mongoose');

const marketRequirementSchema = new mongoose.Schema({
  requirementId: { type: String },
  buyerUserId: { type: String, required: true },
  buyerId: { type: String },
  marketId: { type: String, required: true },
  marketName: { type: String },
  buyerName: { type: String },
  buyerMobileNumber: { type: String },
  cropName: { type: String, required: true },
  crop: { type: String },
  category: { type: String, default: 'Vegetables' },
  requiredQuantity: { type: Number, required: true },
  requiredQuantityMin: { type: Number },
  requiredQuantityMax: { type: Number },
  unit: { type: String, default: 'KG' },
  minimumQuality: { type: String, default: 'Grade A' },
  requiredQualityGrade: { type: String, default: 'Grade A' },
  maximumBuyingPrice: { type: Number, required: true },
  maximumPrice: { type: Number },
  expectedPriceMin: { type: Number },
  expectedPriceMax: { type: Number },
  demandLevel: { type: String, default: 'High' },
  status: { type: String, default: 'ACTIVE' },
  requirementStatus: { type: String, default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MarketRequirement', marketRequirementSchema);

