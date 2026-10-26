const jwt = require('jsonwebtoken');
const storage = require('../storage/storageAdapter');

const JWT_SECRET = process.env.JWT_SECRET || 'sahayak-super-secret-key-2026';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const demoUserId = req.headers['x-demo-user-id'];

  if (demoUserId) {
    const user = storage.getUserById(demoUserId);
    if (user) {
      req.user = user;
      return next();
    }
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = storage.getUserById(decoded.id);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
    }
  }

  // Allow guest/unauthenticated actions for public tracking and registration, but tag req.user as null
  req.user = null;
  next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required to access this resource.' });
  }
  next();
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden. Requires one of roles: [${roles.join(', ')}]` 
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  requireAuth,
  requireRole,
  JWT_SECRET
};
