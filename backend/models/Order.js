const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, default: () => 'ORD-' + Date.now() },
  farmerId: { type: String, required: true },
  buyerId: { type: String, required: true },
  marketId: { type: String },
  cropLotId: { type: String, required: true },
  cropName: { type: String, default: 'Tomato' },
  quantity: { type: Number, required: true },
  agreedPrice: { type: Number, required: true },
  totalValue: { type: Number, required: true },
  status: {
    type: String,
    enum: ['CONFIRMED', 'DRIVER_ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'],
    default: 'CONFIRMED'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
