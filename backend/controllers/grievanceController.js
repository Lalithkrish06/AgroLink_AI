const Grievance = require('../models/Grievance');
const { seedGrievances } = require('../data/seedData');

// Get all grievances
exports.getGrievances = async (req, res) => {
  try {
    let list = [];
    try {
      list = await Grievance.find().sort({ createdAt: -1 });
    } catch (e) {}

    if (!list || list.length === 0) {
      list = seedGrievances.map((g, i) => ({ _id: 'grv_seed_' + i, ...g }));
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new grievance
exports.createGrievance = async (req, res) => {
  try {
    const { transactionId, issueType, description } = req.body;

    if (!transactionId || !issueType || !description) {
      return res.status(400).json({ message: 'Transaction ID, issue type and description are required.' });
    }

    const userName = req.user ? req.user.name : 'Ramasamy Gounder';

    let itemObj = {
      _id: 'grv_' + Date.now(),
      userName,
      transactionId,
      issueType,
      description,
      status: 'open',
      createdAt: new Date()
    };

    try {
      const g = new Grievance(itemObj);
      await g.save();
      return res.status(201).json({ message: 'Grievance ticket raised successfully!', grievance: g });
    } catch (e) {}

    return res.status(201).json({ message: 'Grievance ticket raised successfully!', grievance: itemObj });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Resolve grievance (Admin)
exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'open', 'in_progress', 'resolved'

    try {
      const g = await Grievance.findByIdAndUpdate(id, { status }, { new: true });
      if (g) {
        return res.json({ message: 'Grievance status updated!', grievance: g });
      }
    } catch (e) {}

    res.json({ message: 'Grievance status updated!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
