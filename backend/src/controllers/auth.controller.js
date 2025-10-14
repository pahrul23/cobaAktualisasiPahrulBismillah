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
        id: user.id,
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

// ... kode login dan getMe yang sudah ada di atas ...

// ============================================
// METHOD BARU: Check Email
// ============================================
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email harus diisi' }
      });
    }

    // Cek email di database
    const [rows] = await pool.execute(
      'SELECT id, name, email FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.json({
        success: false,
        error: { message: 'Email tidak ditemukan di sistem.' }
      });
    }

    res.json({
      success: true,
      message: 'Email ditemukan',
      data: { email: rows[0].email, name: rows[0].name }
    });

  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Terjadi kesalahan saat memeriksa email' }
    });
  }
};

// ============================================
// METHOD BARU: Reset Password
// ============================================
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email dan password baru harus diisi' }
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'Password minimal 6 karakter' }
      });
    }

    // Cek email
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Email tidak ditemukan' }
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.execute(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?',
      [hashedPassword, email]
    );

    console.log('Password reset successfully for:', email);

    res.json({
      success: true,
      message: 'Password berhasil direset'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Terjadi kesalahan saat mereset password' }
    });
  }
};

// UPDATE module.exports - TAMBAHKAN 2 method baru
module.exports = { 
  login, 
  getMe,
  checkEmail,      // BARU
  resetPassword    // BARU
};