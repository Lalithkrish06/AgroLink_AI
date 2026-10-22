const mongoose = require('mongoose');

const driverLocationSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  driverId: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  heading: { type: Number, default: 0 },
  speed: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DriverLocation', driverLocationSchema);
