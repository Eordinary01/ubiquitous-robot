const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    console.log('Auth Check:', {
      path: req.path,
      method: req.method,
      headers: {
        authorization: req.header('Authorization')?.substring(0, 20) + '...'
      }
    });

    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Authorization header missing' 
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid authorization format. Expected Bearer token' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Token is empty' 
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured in environment');
      return res.status(500).json({ 
        success: false,
        message: 'Server authentication configuration error' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token structure' 
      });
    }

    console.log("Token verified:", {
      userId: decoded.userId,
      role: decoded.role,
      gymId: decoded.gymId || "N/A",
      expires: new Date(decoded.exp * 1000).toISOString()
    });

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
      gymId: decoded.gymId
    };

    next();
  } catch (error) {
    console.error('Auth Error:', {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    switch (error.name) {
      case 'TokenExpiredError':
        return res.status(401).json({ 
          success: false,
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED'
        });
      case 'JsonWebTokenError':
        return res.status(401).json({ 
          success: false,
          message: 'Invalid token format',
          code: 'INVALID_TOKEN'
        });
      case 'NotBeforeError':
        return res.status(401).json({ 
          success: false,
          message: 'Token not yet active',
          code: 'TOKEN_NOT_ACTIVE'
        });
      default:
        return res.status(401).json({ 
          success: false,
          message: 'Authentication failed',
          code: 'AUTH_FAILED'
        });
    }
  }
};