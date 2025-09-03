const { createConnection } = require('../config/database');
const multer = require('multer');
const path = require('path');

// Get all letters with filters
const getLetters = async (req, res) => {
  try {
    const { 
      jenis, 
      status, 
      label, 
      q, 
      page = 1, 
      limit = 10 
    } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    // Filter by jenis
    if (jenis && jenis !== 'all') {
      whereClause += ' AND jenis = ?';
      params.push(jenis);
    }

    // Filter by status
    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // Filter by label
    if (label && label !== 'all') {
      whereClause += ' AND label = ?';
      params.push(label);
    }

    // Search functionality
    if (q) {
      whereClause += ' AND (no_surat LIKE ? OR perihal LIKE ? OR asal_surat LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    // Pagination
    const offset = (page - 1) * limit;

    const connection = await createConnection();

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM letters ${whereClause}`,
      params
    );

    // Get letters with user info
    const [letters] = await connection.execute(
      `SELECT 
        l.*,
        u.name as created_by_name
      FROM letters l 
      LEFT JOIN users u ON l.created_by = u.id 
      ${whereClause}
      ORDER BY l.created_at DESC 
      LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    await connection.end();

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        letters,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      }
    });

  } catch (error) {
    console.error('Get letters error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Gagal mengambil data surat' }
    });
  }
};

// Create new letter
const createLetter = async (req, res) => {
  try {
    const {
      jenis,
      no_disposisi,
      no_surat,
      asal_surat,
      perihal,
      tanggal_terima,
      tanggal_surat,
      uraian,
      keterangan,
      label = 'hitam'
    } = req.body;

    // Validation
    if (!jenis || !no_disposisi || !no_surat || !asal_surat || !perihal || !tanggal_terima || !tanggal_surat || !uraian) {
      return res.status(400).json({
        success: false,
        error: { message: 'Field wajib tidak boleh kosong' }
      });
    }

    // Validate jenis
    const validJenis = ['pengaduan', 'pemberitahuan', 'undangan', 'audiensi', 'proposal'];
    if (!validJenis.includes(jenis)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Jenis surat tidak valid' }
      });
    }

    // Validate label
    const validLabels = ['merah', 'kuning', 'hijau', 'hitam'];
    if (!validLabels.includes(label)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Label warna tidak valid' }
      });
    }

    const connection = await createConnection();

    const [result] = await connection.execute(
      `INSERT INTO letters (
        jenis, no_disposisi, no_surat, asal_surat, perihal,
        tanggal_terima, tanggal_surat, uraian, keterangan, 
        label, status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'baru', ?)`,
      [
        jenis, no_disposisi, no_surat, asal_surat, perihal,
        tanggal_terima, tanggal_surat, uraian, keterangan,
        label, req.user.id
      ]
    );

    // Get the created letter
    const [newLetter] = await connection.execute(
      'SELECT * FROM letters WHERE id = ?',
      [result.insertId]
    );

    await connection.end();

    console.log(`Letter created: ${no_surat} by ${req.user.name}`);

    res.status(201).json({
      success: true,
      data: newLetter[0],
      message: 'Surat berhasil dibuat'
    });

  } catch (error) {
    console.error('Create letter error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Gagal membuat surat' }
    });
  }
};

// Get letter by ID
const getLetterById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await createConnection();

    const [letters] = await connection.execute(
      `SELECT 
        l.*,
        u.name as created_by_name
      FROM letters l 
      LEFT JOIN users u ON l.created_by = u.id 
      WHERE l.id = ?`,
      [id]
    );

    if (letters.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        error: { message: 'Surat tidak ditemukan' }
      });
    }

    await connection.end();

    res.json({
      success: true,
      data: letters[0]
    });

  } catch (error) {
    console.error('Get letter by ID error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Gagal mengambil data surat' }
    });
  }
};

// Update letter
const updateLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates.id;
    delete updates.created_by;
    delete updates.created_at;

    const connection = await createConnection();

    // Check if letter exists
    const [existing] = await connection.execute(
      'SELECT * FROM letters WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        error: { message: 'Surat tidak ditemukan' }
      });
    }

    // Build update query
    const updateFields = Object.keys(updates);
    const updateValues = Object.values(updates);
    
    if (updateFields.length === 0) {
      await connection.end();
      return res.status(400).json({
        success: false,
        error: { message: 'Tidak ada data untuk diupdate' }
      });
    }

    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    
    await connection.execute(
      `UPDATE letters SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...updateValues, id]
    );

    // Get updated letter
    const [updatedLetter] = await connection.execute(
      'SELECT * FROM letters WHERE id = ?',
      [id]
    );

    await connection.end();

    console.log(`Letter updated: ID ${id} by ${req.user.name}`);

    res.json({
      success: true,
      data: updatedLetter[0],
      message: 'Surat berhasil diupdate'
    });

  } catch (error) {
    console.error('Update letter error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Gagal mengupdate surat' }
    });
  }
};

// Delete letter
const deleteLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await createConnection();

    // Check if letter exists
    const [existing] = await connection.execute(
      'SELECT * FROM letters WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        error: { message: 'Surat tidak ditemukan' }
      });
    }

    await connection.execute('DELETE FROM letters WHERE id = ?', [id]);
    await connection.end();

    console.log(`Letter deleted: ID ${id} by ${req.user.name}`);

    res.json({
      success: true,
      message: 'Surat berhasil dihapus'
    });

  } catch (error) {
    console.error('Delete letter error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Gagal menghapus surat' }
    });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/letters/') // pastikan folder ini ada
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File type not supported'));
    }
  }
});

module.exports = {
  getLetters,
  createLetter,
  getLetterById,
  updateLetter,
  deleteLetter
};