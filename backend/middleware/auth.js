// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate and attach user
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.startsWith('Bearer ')
      ? req.header('Authorization').slice(7)
      : req.header('Authorization');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try finding user by ID (backward compatible with older payloads)
    const userId = decoded.user?.id || decoded.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid. User not found.'
      });
    }

    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Middleware to check if user is a seller
const isSeller = (req, res, next) => {
  if (req.user.userType !== 'seller') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Seller privileges required.'
    });
  }
  next();
};

// Middleware to check if user is a buyer
const isBuyer = (req, res, next) => {
  if (req.user.userType !== 'buyer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Buyer privileges required.'
    });
  }
  next();
};

module.exports = {
  authenticate,
  isSeller,
  isBuyer
};
