const Order = require('../models/Order');
const CropLot = require('../models/CropLot');
const { addNotification } = require('./notificationController');

let defaultOrders = [
  {
    _id: 'ord_demo_1',
    orderId: 'ORD-2026-001',
    farmerId: 'usr_farmer_kamalesh',
    buyerId: 'usr_buyer_kamalesh',
    marketId: 'mkt_erode_01',
    cropLotId: 'lot_demo_1',
    cropName: 'Tomato',
    quantity: 1000,
    agreedPrice: 35,
    totalValue: 35000,
    status: 'CONFIRMED',
    createdAt: new Date()
  }
];

exports.acceptProduct = async (req, res) => {
  try {
    const { cropLotId, agreedPrice, quantity, marketId } = req.body;
    const buyerId = req.user ? req.user.id : 'usr_buyer_kamalesh';

    let cropLot;
    try {
      cropLot = await CropLot.findById(cropLotId);
    } catch (e) {}

    const qty = Number(quantity) || (cropLot ? cropLot.quantity : 1000);
    const price = Number(agreedPrice) || (cropLot ? cropLot.expectedPrice : 35);
    const total = qty * price;

    const newOrder = {
      _id: 'ord_' + Date.now(),
      orderId: 'ORD-' + Date.now(),
      farmerId: cropLot ? cropLot.farmerId : 'usr_farmer_kamalesh',
      buyerId,
      marketId: marketId || (cropLot ? cropLot.selectedMarketId : 'mkt_erode_01'),
      cropLotId: cropLotId || 'lot_demo_1',
      cropName: cropLot ? cropLot.cropName : 'Tomato',
      quantity: qty,
      agreedPrice: price,
      totalValue: total,
      status: 'CONFIRMED',
      createdAt: new Date()
    };

    defaultOrders.unshift(newOrder);

    try {
      const o = new Order(newOrder);
      await o.save();
    } catch (e) {}

    // Update Crop Lot status to BUYER ACCEPTED
    if (cropLot) cropLot.status = 'BUYER ACCEPTED';
    try {
      await CropLot.findByIdAndUpdate(cropLotId, { status: 'BUYER ACCEPTED' });
    } catch (e) {}

    // Send Notification to Farmer Account
    await addNotification({
      recipientId: newOrder.farmerId,
      userRole: 'farmer',
      type: 'PRODUCT_ACCEPTED',
      title: '🔔 Product Accepted',
      message: `Kamalesh Buyer accepted your ${newOrder.cropName} crop lot (${newOrder.quantity} kg @ ₹${newOrder.agreedPrice}/kg). Order # ${newOrder.orderId} CONFIRMED!`,
      relatedCropLotId: newOrder.cropLotId,
      relatedOrderId: newOrder._id
    });

    res.status(201).json({
      message: 'Product accepted & Order confirmed successfully!',
      order: newOrder
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    let list = [];
    try {
      list = await Order.find().sort({ createdAt: -1 });
    } catch (e) {}

    if (!list || list.length === 0) {
      list = defaultOrders;
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
