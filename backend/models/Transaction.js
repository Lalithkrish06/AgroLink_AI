const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  requestId: { type: String },
  farmerUserId: { type: String, required: true },
  farmerId: { type: String },
  buyerUserId: { type: String, required: true },
  buyerId: { type: String },
  marketId: { type: String },
  requirementId: { type: String },
  cropLotId: { type: String },
  farmerName: { type: String, default: 'Farmer' },
  farmerPhone: { type: String },
  farmerLocation: { type: String },
  farmerDetails: {
    name: String,
    phone: String,
    location: String
  },
  buyerName: { type: String, default: 'Buyer' },
  buyerPhone: { type: String },
  buyerMarketName: { type: String },
  buyerDetails: {
    name: String,
    phone: String,
    marketName: String
  },
  marketName: { type: String },
  marketDetails: {
    marketName: String,
    location: String
  },
  cropName: { type: String, required: true },
  cropDetails: {
    cropName: String,
    quantity: Number,
    qualityGrade: String,
    unit: String
  },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  qualityGrade: { type: String, default: 'Grade A' },
  quality: { type: String, default: 'Grade A' },
  agreedPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  grossAmount: { type: Number },
  totalCropValue: { type: Number },
  pickupLocation: { type: String },
  deliveryLocation: { type: String },
  transportDistance: { type: Number, default: 45 },
  transportCost: { type: Number, default: 1800 },
  platformFee: { type: Number, default: 700 },
  otherCharges: { type: Number, default: 100 },
  finalNetPayment: { type: Number },
  netAmountToFarmer: { type: Number },
  currentStep: { type: Number, default: 1 },
  transactionStatus: { type: String, default: 'TRANSACTION_CREATED' },
  paymentStatus: { type: String, default: 'PENDING' },
  paymentDate: { type: String },
  transactionDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);

