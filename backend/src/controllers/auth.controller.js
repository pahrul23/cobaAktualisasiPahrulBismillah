// Path: /backend/src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createConnection } = require('../config/database');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email dan password wajib diisi'
        }
      });
    }

    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    await connection.end();
    
    if (rows.length === 0) {
      console.log(`Login failed: user ${email} not found`);
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email atau password tidak valid'
        }
      });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log(`Login failed: invalid password for ${email}`);
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email atau password tidak valid'
        }
      });
    }

    // Generate token dengan expiry 10 hari
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '10d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    console.log(`Login successful: ${user.email} (${user.role}) - Token expires in 10 days`);

    res.json({
      success: true,
      data: { 
        user: userWithoutPassword, 
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '10d'
      },
      message: `Login berhasil sebagai ${user.role}`
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan pada server' }
    });
  }
};

// Add /me endpoint untuk verify token
const getMe = async (req, res) => {
  try {
    // req.user sudah ada dari authGuard middleware
    res.json({
      success: true,
      data: req.user,
      message: 'User data retrieved successfully'
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan pada server' }
    });
  }
};

module.exports = { login, getMe };