// Path: /backend/src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        error: 'NO_TOKEN'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ri7_secret_key')
    
    // Add user info to request
    req.user = decoded
    
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        error: 'TOKEN_EXPIRED'
      })
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: 'INVALID_TOKEN'
      })
    }
    
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: 'AUTH_FAILED'
    })
  }
}

module.exports = authMiddleware