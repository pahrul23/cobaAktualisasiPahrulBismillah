const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

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

    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

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

    // Debug logging
    console.log('JWT_SECRET from env:', process.env.JWT_SECRET);
    console.log('JWT_EXPIRES_IN from env:', process.env.JWT_EXPIRES_IN);

    const jwtSecret = process.env.JWT_SECRET || 'supersecretkey_ri7_2025';
    const jwtExpires = process.env.JWT_EXPIRES_IN || '10d';

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      jwtSecret,
      { expiresIn: jwtExpires }
    );

    const { password: _, ...userWithoutPassword } = user;
    console.log(`Login successful: ${user.email} (${user.role}) - Token expires in ${jwtExpires}`);

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
        expiresIn: jwtExpires
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

const getMe = async (req, res) => {
  try {
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