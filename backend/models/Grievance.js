const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true },
  transactionId: { type: String, required: true },
  issueType: { type: String, required: true }, // e.g. Payment Delay, Quality Mismatch, Transport Delay, Other
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grievance', grievanceSchema);
