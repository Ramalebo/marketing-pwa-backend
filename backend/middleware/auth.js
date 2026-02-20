const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    // User.toJSON() already excludes password
    req.user = user.toJSON();
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

/**
 * Optional auth: if no token, attach first user (or create default) so app works without login.
 * Use this instead of auth when login is temporarily disabled.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      const user = await User.findByPk(decoded.userId);
      if (user && user.isActive) {
        req.user = user.toJSON();
        return next();
      }
    }
    // No token or invalid: use first user, or create default so DB saving works
    let user = await User.findOne({ order: [['id', 'ASC']] });
    if (!user) {
      try {
        user = await User.create({
          email: 'default@local.dev',
          password: 'default123',
          name: 'Default User',
          isMainUser: true,
          role: 'admin'
        });
      } catch (createErr) {
        // Race: another request may have created default user
        user = await User.findOne({ order: [['id', 'ASC']] });
        if (!user) throw createErr;
      }
    }
    req.user = user.toJSON();
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const isMainUser = (req, res, next) => {
  if (!req.user || !req.user.isMainUser) {
    return res.status(403).json({ message: 'Access denied. Main user privileges required.' });
  }
  next();
};

module.exports = { auth, optionalAuth, isMainUser };
