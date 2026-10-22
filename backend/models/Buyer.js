const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  company: { type: String, required: true },
  cropsRequired: [{ type: String }],
  quantityRequired: { type: String },
  offeredPrice: { type: String },
  qualityRequirement: { type: String },
  reliabilityScore: { type: Number, default: 90 }, // 0 to 100
  location: { type: String, required: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Buyer', buyerSchema);
