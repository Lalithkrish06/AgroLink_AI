const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  buyerId: { type: String, required: true },
  marketName: { type: String, required: true },
  businessName: { type: String, default: 'AgroLink Buyer Trading Co' },
  location: { type: String, required: true },
  district: { type: String, default: 'Erode' },
  state: { type: String, default: 'Tamil Nadu' },
  address: { type: String, default: 'Central APMC Market Complex' },
  latitude: { type: Number, default: 11.341 },
  longitude: { type: Number, default: 77.7172 },
  marketType: { type: String, default: 'Wholesale APMC / Private Market' },
  modalPrice: { type: Number, default: 35 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Market', marketSchema);
