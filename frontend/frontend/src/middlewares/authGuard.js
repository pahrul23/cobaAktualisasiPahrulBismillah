const jwt = require('jsonwebtoken');
const { createConnection } = require('../config/database');

const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    console.log('Auth header:', authHeader); // DEBUG
    
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
    console.log('Token received, length:', token.length); // DEBUG (jangan log full token)
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET); // DEBUG
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully for user:', decoded.userId); // DEBUG
    
    // Check if user still exists in database
    const connection = await createConnection();
    const [rows] = await connection.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?', 
      [decoded.userId]
    );
    await connection.end();
    
    if (rows.length === 0) {
      console.log('User not found in database:', decoded.userId); // DEBUG
      return res.status(401).json({
        success: false,
        error: { 
          code: 'USER_NOT_FOUND', 
          message: 'User tidak ditemukan' 
        }
      });
    }

    req.user = rows[0];
    console.log('Auth successful for:', req.user.email); // DEBUG
    next();
    
  } catch (error) {
    console.error('Auth guard error:', error.name, error.message); // DEBUG
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: { 
          code: 'TOKEN_EXPIRED', 
          message: 'Token sudah expired, silakan login ulang',
          expiredAt: error.expiredAt
        }
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: { 
          code: 'INVALID_TOKEN', 
          message: 'Token tidak valid' 
        }
      });
    }
    
    // Generic error
    return res.status(401).json({
      success: false,
      error: { 
        code: 'AUTH_ERROR', 
        message: 'Autentikasi gagal' 
      }
    });
  }
};

module.exports = { authGuard };