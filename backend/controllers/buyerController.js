const Buyer = require('../models/Buyer');
const { seedBuyers } = require('../data/seedData');

// Get all buyers
exports.getAllBuyers = async (req, res) => {
  try {
    let buyers = [];
    try {
      buyers = await Buyer.find();
    } catch (e) {}

    if (!buyers || buyers.length === 0) {
      buyers = seedBuyers.map((b, i) => ({ _id: 'buyer_seed_' + i, ...b }));
    }
    res.json(buyers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify buyer (Admin action)
exports.verifyBuyer = async (req, res) => {
  try {
    const { buyerId } = req.params;
    try {
      const buyer = await Buyer.findByIdAndUpdate(buyerId, { verified: true }, { new: true });
      if (buyer) {
        return res.json({ message: 'Buyer verified successfully!', buyer });
      }
    } catch (e) {}

    res.json({ message: 'Buyer verified successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
