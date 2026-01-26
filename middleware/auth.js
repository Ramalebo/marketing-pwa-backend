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

const isMainUser = (req, res, next) => {
  if (!req.user.isMainUser) {
    return res.status(403).json({ message: 'Access denied. Main user privileges required.' });
  }
  next();
};

module.exports = { auth, isMainUser };
