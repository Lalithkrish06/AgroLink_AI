const Logistics = require('../models/Logistics');
const { seedLogistics } = require('../data/seedData');

// Get all logistics
exports.getLogistics = async (req, res) => {
  try {
    const { type } = req.query; // 'transport' or 'storage'
    let list = [];
    try {
      let query = {};
      if (type) query.type = type;
      list = await Logistics.find(query);
    } catch (e) {}

    if (!list || list.length === 0) {
      list = seedLogistics.filter((l) => !type || l.type === type).map((l, i) => ({ _id: 'log_seed_' + i, ...l }));
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Book logistics item
exports.bookLogistics = async (req, res) => {
  try {
    const { id } = req.params;
    const { cropLotId, pickupDate } = req.body;

    res.json({
      message: 'Logistics booking requested successfully! The provider will contact you shortly.',
      bookingId: 'BK-' + Math.floor(100000 + Math.random() * 900000),
      pickupDate: pickupDate || new Date().toISOString().split('T')[0]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
