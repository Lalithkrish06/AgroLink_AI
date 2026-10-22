const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, trim: true },
  mobile: { type: String, trim: true },
  mobileNumber: { type: String, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'buyer', 'driver', 'admin'], required: true },
  location: { type: String, default: 'Erode, Tamil Nadu' },
  district: { type: String, default: 'Erode' },
  latitude: { type: Number, default: 11.341 },
  longitude: { type: Number, default: 77.7172 },
  verified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound unique index allowing the same phone number for different roles (e.g. phone+farmer AND phone+buyer), but rejecting duplicate phone+role
userSchema.index({ phone: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
