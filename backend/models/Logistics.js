const mongoose = require('mongoose');

const logisticsSchema = new mongoose.Schema({
  type: { type: String, enum: ['transport', 'storage'], required: true },
  name: { type: String, required: true },
  provider: { type: String, required: true },
  vehicleType: { type: String },
  capacity: { type: String },
  availableCapacity: { type: String },
  estimatedCost: { type: String },
  storageCost: { type: String },
  location: { type: String, required: true },
  status: { type: String, default: 'Available' },
  contact: { type: String }
});

module.exports = mongoose.model('Logistics', logisticsSchema);
