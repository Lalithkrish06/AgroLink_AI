const Notification = require('../models/Notification');
const { getDB, saveDB } = require('../services/dbStore');

exports.getNotifications = async (req, res) => {
  try {
    const { role, userId, userEmail } = req.query;
    const currentUserId = userId || (req.user ? (req.user.id || req.user._id) : null);

    let list = [];
    try {
      list = await Notification.find().sort({ createdAt: -1 });
    } catch (e) {}

    const db = getDB();
    if (!list || list.length === 0) {
      list = db.notifications || [];
    }

    const filtered = list.filter((n) => {
      // Direct recipient matching
      if (currentUserId && (String(n.recipientId) === String(currentUserId) || String(n.userId) === String(currentUserId))) {
        return true;
      }
      if (userEmail && n.recipientEmail && n.recipientEmail.toLowerCase() === userEmail.toLowerCase()) {
        return true;
      }
      // If notification has explicit recipientId set to someone else, do not show to current user
      if (n.recipientId && String(n.recipientId) !== String(currentUserId)) {
        return false;
      }
      // Role broadcast
      if (n.userRole === role || n.userRole === 'all') {
        return true;
      }
      return false;
    });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Notification.findByIdAndUpdate(id, { read: true, isRead: true });
    } catch (e) {}

    const db = getDB();
    db.notifications = (db.notifications || []).map((n) =>
      (n._id === id || n.id === id) ? { ...n, read: true, isRead: true } : n
    );
    saveDB(db);

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addNotification = async (notifObj) => {
  const notif = {
    _id: 'notif_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    recipientId: String(notifObj.recipientId),
    senderId: notifObj.senderId ? String(notifObj.senderId) : 'system',
    userRole: notifObj.userRole || 'all',
    type: notifObj.type || 'info',
    title: notifObj.title,
    message: notifObj.message,
    cropLotId: notifObj.cropLotId || null,
    transactionId: notifObj.transactionId || null,
    offerId: notifObj.offerId || null,
    read: false,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  const db = getDB();
  db.notifications.unshift(notif);
  saveDB(db);

  try {
    const doc = new Notification(notif);
    await doc.save();
  } catch (e) {}

  return notif;
};
