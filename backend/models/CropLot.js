const mongoose = require('mongoose');

const cropLotSchema = new mongoose.Schema({
  cropLotId: { type: String },
  farmerUserId: { type: String, required: true },
  farmerId: { type: String },
  farmerName: { type: String },
  farmerMobile: { type: String },
  cropName: { type: String, required: true },
  cropCategory: { type: String, default: 'Vegetables' },
  variety: { type: String, default: 'Hybrid Red' },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  qualityGrade: { type: String, default: 'Grade A' },
  quality: { type: String, default: 'Grade A' },
  freshness: { type: String, default: 'Fresh Harvest (1 Day)' },
  expectedPrice: { type: Number, required: true },
  minimumAcceptablePrice: { type: Number },
  minPrice: { type: Number },
  estimatedValue: { type: Number },
  totalCropValue: { type: Number },
  location: { type: String, default: 'Erode, Tamil Nadu' },
  district: { type: String, default: 'Erode' },
  village: { type: String, default: 'Perundurai' },
  state: { type: String, default: 'Tamil Nadu' },
  latitude: { type: Number, default: 11.341 },
  longitude: { type: Number, default: 77.7172 },
  availableDate: { type: String },
  description: { type: String },
  selectedMarketId: { type: String },
  selectedMarketName: { type: String },
  targetBuyerId: { type: String },
  targetBuyerEmail: { type: String },
  status: {
    type: String,
    enum: ['PUBLISHED', 'Available', 'MARKET SELECTED', 'BUYER ACCEPTED', 'Sold'],
    default: 'PUBLISHED'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CropLot', cropLotSchema);

