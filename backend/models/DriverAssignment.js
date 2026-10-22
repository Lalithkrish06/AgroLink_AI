const mongoose = require('mongoose');

const driverAssignmentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  farmerId: { type: String, required: true },
  buyerId: { type: String, required: true },
  cropLotId: { type: String },
  driverName: { type: String, required: true },
  driverPhone: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  vehicleType: { type: String, default: 'Mini Truck' },
  pickupDate: { type: String, default: '10 September 2026' },
  status: {
    type: String,
    enum: ['Driver Assigned', 'Driver On The Way', 'Arrived At Farm', 'Product Picked Up', 'In Transit', 'Reached Buyer Market', 'Delivery Completed'],
    default: 'Driver Assigned'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DriverAssignment', driverAssignmentSchema);
