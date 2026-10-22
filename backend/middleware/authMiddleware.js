const jwt = require('jsonwebtoken');
const { getDB } = require('../services/dbStore');

const JWT_SECRET = process.env.JWT_SECRET || 'agrolink_ai_secret_jwt_token_2026_sih';

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  if (!token) {
    if (req.method === 'GET') {
      req.user = null;
      return next();
    }
    return res.status(401).json({ message: '401 Unauthorized: Authentication token is missing.' });
  }

  // Handle Demo Tokens (e.g. token_buyer, jwt_token_buyer_123, token_farmer, etc.)
  if (token.startsWith('token_') || token.startsWith('jwt_token_')) {
    const parts = token.split('_');
    const role = parts.find((p) => ['buyer', 'farmer', 'admin', 'driver'].includes(p.toLowerCase())) || 'buyer';
    
    const db = getDB();
    let foundUser = null;
    if (role === 'buyer') {
      foundUser = (db.users || []).find((u) => (u._id || u.id) === 'usr_1788673791617' || (u.name && u.name.toLowerCase().includes('lalith')) || u.role === 'buyer');
    } else if (role === 'farmer') {
      foundUser = (db.users || []).find((u) => u.role === 'farmer');
    } else if (role === 'admin') {
      foundUser = (db.users || []).find((u) => u.role === 'admin');
    }

    req.user = {
      id: foundUser ? (foundUser._id || foundUser.id) : (role === 'buyer' ? 'usr_1788673791617' : `usr_${role}`),
      _id: foundUser ? (foundUser._id || foundUser.id) : (role === 'buyer' ? 'usr_1788673791617' : `usr_${role}`),
      name: foundUser ? foundUser.name : (role === 'buyer' ? 'Lalith' : 'User'),
      role: role.toLowerCase()
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (req.method === 'GET') {
      req.user = null;
      return next();
    }
    return res.status(401).json({ message: '401 Unauthorized: Invalid or expired authentication token.' });
  }
};

module.exports = authMiddleware;
