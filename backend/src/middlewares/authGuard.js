// Path: /backend/src/middlewares/authGuard.js
const jwt = require('jsonwebtoken');
const { createConnection } = require('../config/database');

const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { 
          code: 'UNAUTHORIZED', 
          message: 'Token tidak ditemukan' 
        }
      });
    }

    const token = authHeader.substring(7);
    console.log('Token verification - User attempting access:', new Date().toISOString());
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token valid for user ID:', decoded.userId, '- Expires:', new Date(decoded.exp * 1000).toISOString());
    
    // Check if user still exists in database
    const connection = await createConnection();
    const [rows] = await connection.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?', 
      [decoded.userId]
    );
    await connection.end();
    
    if (rows.length === 0) {
      console.log('User not found in database:', decoded.userId);
      return res.status(401).json({
        success: false,
        error: { 
          code: 'USER_NOT_FOUND', 
          message: 'User tidak ditemukan' 
        }
      });
    }

    req.user = rows[0];
    console.log('Auth successful for:', req.user.email, '(' + req.user.role + ')');
    next();
    
  } catch (error) {
    console.error('Auth guard error:', error.name, '-', error.message);
    
    if (error.name === 'TokenExpiredError') {
      console.log('Token expired at:', error.expiredAt);
      return res.status(401).json({
        success: false,
        error: { 
          code: 'TOKEN_EXPIRED', 
          message: 'Token sudah expired, silakan login ulang',
          expiredAt: error.expiredAt,
          requiresReauth: true
        }
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: { 
          code: 'INVALID_TOKEN', 
          message: 'Token tidak valid',
          requiresReauth: true
        }
      });
    }
    
    // Generic error
    return res.status(401).json({
      success: false,
      error: { 
        code: 'AUTH_ERROR', 
        message: 'Autentikasi gagal',
        requiresReauth: true
      }
    });
  }
};

module.exports = { authGuard };