// Path: /backend/src/routes/users.routes.js
// User Management Routes - Profile, Change Password, User CRUD

const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/database')

// ============================================
// MIDDLEWARE: JWT Authentication
// ============================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Token tidak ditemukan' 
    })
  }

  // IMPORTANT: Use same JWT_SECRET as in your .env
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_ri7_2025_12hour_expiry'

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT Verify Error:', err.message)
      return res.status(403).json({ 
        success: false,
        message: 'Token tidak valid atau sudah expired' 
      })
    }
    req.user = user
    next()
  })
}

// ============================================
// ENDPOINT 1: GET Current User Profile
// ============================================
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    console.log('=== GET PROFILE ===')
    console.log('User ID:', userId)

    const [users] = await db.query(
      `SELECT id, name, email, role, created_at, updated_at 
       FROM users 
       WHERE id = ?`,
      [userId]
    )

    if (users.length === 0) {
      console.error('User not found for ID:', userId)
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      })
    }

    console.log('Profile found:', users[0].email)

    res.json({
      success: true,
      message: 'Data user berhasil diambil',
      data: users[0]
    })

  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data user',
      error: error.message
    })
  }
})

// ============================================
// ENDPOINT 2: PUT Update User Profile
// ============================================
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { name, email } = req.body

    console.log('=== UPDATE PROFILE ===')
    console.log('User ID:', userId)
    console.log('New Data:', { name, email })

    // Validasi input
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan email harus diisi'
      })
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid'
      })
    }

    // Cek apakah email sudah digunakan user lain
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId]
    )

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah digunakan oleh user lain'
      })
    }

    // Update profile
    await db.query(
      `UPDATE users 
       SET name = ?, email = ?, updated_at = NOW() 
       WHERE id = ?`,
      [name, email, userId]
    )

    // Get updated data
    const [updatedUser] = await db.query(
      `SELECT id, name, email, role, created_at, updated_at 
       FROM users 
       WHERE id = ?`,
      [userId]
    )

    console.log('Profile updated successfully')

    res.json({
      success: true,
      message: 'Profile berhasil diupdate',
      data: updatedUser[0]
    })

  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat update profile',
      error: error.message
    })
  }
})

// ============================================
// ENDPOINT 3: POST Change Password
// ============================================
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user.id

    console.log('=== CHANGE PASSWORD ===')
    console.log('User ID:', userId)
    console.log('User from token:', { id: req.user.id, email: req.user.email })

    // Validasi input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password saat ini dan password baru harus diisi'
      })
    }

    // Validasi password baru
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 8 karakter'
      })
    }

    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password harus mengandung minimal 1 huruf besar'
      })
    }

    if (!/[a-z]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password harus mengandung minimal 1 huruf kecil'
      })
    }

    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password harus mengandung minimal 1 angka'
      })
    }

    // Cari user dari database
    console.log('Searching user with ID:', userId)
    const [users] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    )

    console.log('Query result:', users.length, 'user(s) found')

    if (users.length === 0) {
      console.error('ERROR: User tidak ditemukan di database!')
      console.error('User ID yang dicari:', userId)
      console.error('Tipe data user ID:', typeof userId)
      
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      })
    }

    const user = users[0]
    console.log('User found:', { id: user.id, name: user.name, email: user.email })

    // Verifikasi password lama
    console.log('Verifying current password...')
    const validPassword = await bcrypt.compare(currentPassword, user.password)

    if (!validPassword) {
      console.log('Current password incorrect')
      return res.status(401).json({
        success: false,
        message: 'Password saat ini tidak sesuai'
      })
    }

    console.log('Current password verified ✓')

    // Cek apakah password baru sama dengan password lama
    const samePassword = await bcrypt.compare(newPassword, user.password)
    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: 'Password baru tidak boleh sama dengan password lama'
      })
    }

    // Hash password baru
    console.log('Hashing new password...')
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password di database
    console.log('Updating password in database...')
    await db.query(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, userId]
    )

    console.log('Password updated successfully ✓')

    // Optional: Log activity (jika tabel activity_logs ada)
    try {
      await db.query(
        `INSERT INTO activity_logs (user_id, action, description, created_at) 
         VALUES (?, ?, ?, NOW())`,
        [userId, 'CHANGE_PASSWORD', 'User mengubah password']
      )
      console.log('Activity logged ✓')
    } catch (logError) {
      // Ignore if activity_logs table doesn't exist
      console.log('Activity log skipped (table may not exist)')
    }

    res.json({
      success: true,
      message: 'Password berhasil diubah'
    })

  } catch (error) {
    console.error('=== CHANGE PASSWORD ERROR ===')
    console.error('Error detail:', error)
    console.error('Error stack:', error.stack)
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengubah password',
      error: error.message
    })
  }
})

// ============================================
// ENDPOINT 4: GET All Users (Admin/Ketua Only)
// ============================================
router.get('/all', authenticateToken, async (req, res) => {
  try {
    // Cek role user
    if (req.user.role !== 'ketua' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat semua user'
      })
    }

    const { page = 1, limit = 10, search = '', role = '' } = req.query
    const offset = (page - 1) * limit

    console.log('=== GET ALL USERS ===')
    console.log('Requester:', req.user.email, '(', req.user.role, ')')
    console.log('Filters:', { page, limit, search, role })

    // Build query
    let query = `
      SELECT id, name, email, role, created_at, updated_at 
      FROM users 
      WHERE 1=1
    `
    let queryParams = []

    // Filter by search
    if (search) {
      query += ` AND (name LIKE ? OR email LIKE ?)`
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    // Filter by role
    if (role) {
      query += ` AND role = ?`
      queryParams.push(role)
    }

    // Get total count
    const [countResult] = await db.query(
      query.replace('SELECT id, name, email, role, created_at, updated_at', 'SELECT COUNT(*) as total'),
      queryParams
    )
    const total = countResult[0].total

    // Get paginated data
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
    queryParams.push(parseInt(limit), parseInt(offset))

    const [users] = await db.query(query, queryParams)

    console.log(`Found ${users.length} users (total: ${total})`)

    res.json({
      success: true,
      message: 'Data users berhasil diambil',
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get all users error:', error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data users',
      error: error.message
    })
  }
})

// ============================================
// ENDPOINT 5: GET User by ID
// ============================================
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    console.log('=== GET USER BY ID ===')
    console.log('Requested ID:', id)
    console.log('Requester:', req.user.id, '(', req.user.role, ')')

    // Cek apakah user mengakses profile sendiri atau admin/ketua
    if (req.user.id !== parseInt(id) && req.user.role !== 'ketua' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melihat user ini'
      })
    }

    const [users] = await db.query(
      `SELECT id, name, email, role, created_at, updated_at 
       FROM users 
       WHERE id = ?`,
      [id]
    )

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      })
    }

    console.log('User found:', users[0].email)

    res.json({
      success: true,
      message: 'Data user berhasil diambil',
      data: users[0]
    })

  } catch (error) {
    console.error('Get user by ID error:', error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data user',
      error: error.message
    })
  }
})

// ============================================
// ENDPOINT 6: DELETE User (Admin/Ketua Only)
// ============================================
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    console.log('=== DELETE USER ===')
    console.log('Target ID:', id)
    console.log('Requester:', req.user.email, '(', req.user.role, ')')

    // Cek role user
    if (req.user.role !== 'ketua' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk menghapus user'
      })
    }

    // Tidak bisa hapus diri sendiri
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Anda tidak bisa menghapus akun sendiri'
      })
    }

    // Cek apakah user exists
    const [users] = await db.query('SELECT id, name FROM users WHERE id = ?', [id])

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      })
    }

    const deletedUserName = users[0].name

    // Hapus user
    await db.query('DELETE FROM users WHERE id = ?', [id])

    console.log('User deleted:', deletedUserName)

    // Log activity (optional)
    try {
      await db.query(
        `INSERT INTO activity_logs (user_id, action, description, created_at) 
         VALUES (?, ?, ?, NOW())`,
        [req.user.id, 'DELETE_USER', `Menghapus user: ${deletedUserName}`]
      )
    } catch (logError) {
      console.log('Activity log skipped (table may not exist)')
    }

    res.json({
      success: true,
      message: 'User berhasil dihapus'
    })

  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus user',
      error: error.message
    })
  }
})

// ============================================
// Export Router
// ============================================
module.exports = router