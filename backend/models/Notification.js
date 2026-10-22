const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: { type: String, required: true },
  senderId: { type: String },
  userRole: { type: String, enum: ['farmer', 'buyer', 'all'], default: 'all' },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  cropLotId: { type: String },
  offerId: { type: String },
  transactionId: { type: String },
  read: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
