const DriverAssignment = require('../models/DriverAssignment');
const DriverLocation = require('../models/DriverLocation');
const Transaction = require('../models/Transaction');
const { addNotification } = require('./notificationController');

let inMemoryAssignments = [];
let inMemoryLocations = {};

exports.assignDriver = async (req, res) => {
  try {
    const { transactionId, orderId, driverName, driverPhone, vehicleNumber, vehicleType, pickupDate } = req.body;

    const targetTxId = transactionId || orderId;
    if (!driverName || !driverPhone || !vehicleNumber) {
      return res.status(400).json({ message: 'Driver Name, Driver Mobile Number, and Vehicle Number are required.' });
    }

    let tx = null;
    try {
      tx = await Transaction.findOne({ $or: [{ _id: targetTxId }, { transactionId: targetTxId }] });
    } catch (e) {}

    const farmerId = tx ? tx.farmerId : req.body.farmerId;
    const buyerId = tx ? tx.buyerId : (req.user ? req.user.id : req.body.buyerId);

    const assignment = {
      _id: 'drv_' + Date.now(),
      transactionId: targetTxId || 'AGRO-TX-' + Date.now(),
      orderId: targetTxId || 'AGRO-TX-' + Date.now(),
      farmerId: farmerId || 'usr_farmer',
      buyerId: buyerId || 'usr_buyer',
      cropLotId: tx ? tx.cropLotId : null,
      driverName: driverName.trim(),
      driverPhone: driverPhone.trim(),
      vehicleNumber: vehicleNumber.trim(),
      vehicleType: vehicleType || 'Mini Truck 14ft',
      pickupDate: pickupDate || new Date().toLocaleDateString(),
      status: 'DRIVER_ASSIGNED',
      createdAt: new Date()
    };

    inMemoryAssignments.unshift(assignment);

    try {
      const d = new DriverAssignment(assignment);
      await d.save();
    } catch (e) {}

    // Update Transaction Step to 2 (Transport Arranged)
    try {
      if (tx) {
        tx.currentStep = 2;
        tx.transactionStatus = 'Driver Assigned';
        await tx.save();
      }
    } catch (e) {}

    // Send targeted Notifications to Farmer and Buyer
    if (farmerId) {
      await addNotification({
        recipientId: farmerId,
        userRole: 'farmer',
        type: 'DRIVER_ASSIGNED',
        title: '🚚 Driver Assigned for Pickup',
        message: `Driver ${assignment.driverName} (${assignment.vehicleNumber}, Mobile: ${assignment.driverPhone}) has been assigned for pickup.`,
        transactionId: assignment.transactionId
      });
    }

    if (buyerId) {
      await addNotification({
        recipientId: buyerId,
        userRole: 'buyer',
        type: 'DRIVER_ASSIGNED',
        title: '🚚 Driver Assigned for Transport',
        message: `Driver ${assignment.driverName} (${assignment.vehicleNumber}, Mobile: ${assignment.driverPhone}) is en route for pickup.`,
        transactionId: assignment.transactionId
      });
    }

    res.status(201).json({
      message: 'Delivery Driver assigned successfully! Pickup details dispatched.',
      assignment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDriverAssignment = async (req, res) => {
  try {
    const { orderId } = req.params;
    let assignment = inMemoryAssignments.find((a) => a.transactionId === orderId || a.orderId === orderId || a._id === orderId);

    try {
      const dbAssignment = await DriverAssignment.findOne({ $or: [{ transactionId: orderId }, { orderId }, { _id: orderId }] });
      if (dbAssignment) assignment = dbAssignment;
    } catch (e) {}

    res.json(assignment || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDriverStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let assignment = inMemoryAssignments.find((a) => a._id === id || a.transactionId === id || a.orderId === id);
    if (assignment) {
      assignment.status = status;
    }

    try {
      await DriverAssignment.findByIdAndUpdate(id, { status });
    } catch (e) {}

    if (assignment) {
      if (assignment.farmerId) {
        await addNotification({
          recipientId: assignment.farmerId,
          userRole: 'farmer',
          type: 'DRIVER_STATUS_UPDATE',
          title: `🚚 Delivery Update: ${status}`,
          message: `Driver ${assignment.driverName} status updated: "${status}".`,
          transactionId: assignment.transactionId
        });
      }
      if (assignment.buyerId) {
        await addNotification({
          recipientId: assignment.buyerId,
          userRole: 'buyer',
          type: 'DRIVER_STATUS_UPDATE',
          title: `🚚 Delivery Update: ${status}`,
          message: `Driver ${assignment.driverName} status updated: "${status}".`,
          transactionId: assignment.transactionId
        });
      }
    }

    res.json({
      message: `Driver status updated to ${status}!`,
      status,
      assignment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.postLiveLocation = async (req, res) => {
  try {
    const { orderId, transactionId, latitude, longitude, heading, speed } = req.body;
    const key = transactionId || orderId || 'default';

    const locObj = {
      transactionId: key,
      orderId: key,
      driverId: 'drv_active',
      latitude: Number(latitude) || 11.341,
      longitude: Number(longitude) || 77.7172,
      heading: Number(heading) || 0,
      speed: Number(speed) || 35,
      timestamp: new Date()
    };

    inMemoryLocations[key] = locObj;

    try {
      const loc = new DriverLocation(locObj);
      await loc.save();
    } catch (e) {}

    res.json({
      message: 'Live GPS location updated successfully!',
      location: locObj
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLiveLocation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const loc = inMemoryLocations[orderId] || inMemoryLocations['default'] || null;
    res.json(loc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
