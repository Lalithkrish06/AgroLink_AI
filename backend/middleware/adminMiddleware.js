const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: '401 Unauthorized: Authentication token required.' });
  }

  const role = (req.user.role || '').toLowerCase();
  if (role !== 'admin') {
    return res.status(403).json({ message: '403 Access Denied: Admin authorization required.' });
  }

  next();
};

module.exports = adminMiddleware;
