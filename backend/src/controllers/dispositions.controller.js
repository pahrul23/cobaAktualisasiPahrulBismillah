// Path: /backend/src/controllers/dispositions.controller.js
const db = require("../config/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Setup multer untuk handle file upload
const upload = multer({ dest: "uploads/disposisi/" });

const getAllDispositions = async (req, res) => {
  try {
    // Tambahkan parameter pencarian
    const { search } = req.query;
    
    let query = `
      SELECT
        d.*,
        l.perihal,
        l.asal_surat,
        l.jenis,
        l.tanggal_terima,
        l.tanggal_surat
      FROM dispositions d
      LEFT JOIN letters l ON d.letter_id = l.id
    `;
    
    let queryParams = [];
    
    // Jika ada parameter pencarian
    if (search) {
      query += ` WHERE (
        d.no_surat LIKE ? OR 
        d.disposisi_kepada LIKE ? OR 
        l.perihal LIKE ? OR 
        l.asal_surat LIKE ?
      )`;
      const searchParam = `%${search}%`;
      queryParams = [searchParam, searchParam, searchParam, searchParam];
    }
    
    query += ` ORDER BY d.created_at DESC`;
    
    const [rows] = await db.query(query, queryParams);
    
    console.log("Fetched dispositions count:", rows.length);
    
    res.json({
      success: true,
      message: "Dispositions retrieved successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching dispositions:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

const createDisposition = async (req, res) => {
  try {
    console.log("POST /api/dispositions called");
    console.log("Request body:", req.body);
    console.log("Request files:", req.file);

    const {
      letter_id,
      no_surat,
      disposisi_kepada,
      instruksi,
      catatan,
      disposisi_kepada_lainnya,
    } = req.body;

    if (!letter_id || !no_surat || !disposisi_kepada) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap: letter_id, no_surat, disposisi_kepada wajib diisi",
      });
    }

    let parsedInstruksi = [];
    if (instruksi) {
      try {
        parsedInstruksi = typeof instruksi === "string" ? JSON.parse(instruksi) : instruksi;
      } catch (e) {
        console.log("Error parsing instruksi:", e);
        parsedInstruksi = [];
      }
    }

    const finalDisposisiKepada = disposisi_kepada === "Lainnya" ? disposisi_kepada_lainnya : disposisi_kepada;

    // Handle file upload
    let filePath = null;
    let fileName = null;
    if (req.file) {
      filePath = req.file.path;
      fileName = req.file.originalname;
      console.log("File uploaded:", fileName, "Path:", filePath);
    }

    const query = `
      INSERT INTO dispositions (letter_id, no_surat, disposisi_kepada, instruksi, catatan, file_path, file_name, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    const [result] = await db.query(query, [
      letter_id,
      no_surat,
      finalDisposisiKepada,
      JSON.stringify(parsedInstruksi),
      catatan || null,
      filePath,
      fileName,
    ]);

    res.status(201).json({
      success: true,
      message: "Disposisi berhasil dibuat",
      data: {
        id: result.insertId,
        letter_id,
        no_surat,
        disposisi_kepada: finalDisposisiKepada,
        instruksi: parsedInstruksi,
        file_name: fileName,
      },
    });
  } catch (error) {
    console.error("Error creating disposition:", error);
    res.status(500).json({
      success: false,
      message: "Gagal membuat disposisi: " + error.message,
    });
  }
};

// Function untuk delete disposisi
const deleteDisposition = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting disposition with ID:', id);
    
    // Cek apakah disposisi exists dan ambil info file
    const checkQuery = 'SELECT * FROM dispositions WHERE id = ?';
    const [existing] = await db.query(checkQuery, [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Disposisi tidak ditemukan'
      });
    }
    
    // Hapus file jika ada
    if (existing[0].file_path && fs.existsSync(existing[0].file_path)) {
      try {
        fs.unlinkSync(existing[0].file_path);
        console.log('File deleted:', existing[0].file_path);
      } catch (error) {
        console.log('Error deleting file:', error);
      }
    }
    
    // Hapus disposisi dari database
    const deleteQuery = 'DELETE FROM dispositions WHERE id = ?';
    await db.query(deleteQuery, [id]);
    
    res.json({
      success: true,
      message: 'Disposisi berhasil dihapus'
    });
    
  } catch (error) {
    console.error('Error deleting disposition:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus disposisi: ' + error.message
    });
  }
};

// Function untuk download file
const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ambil info file dari database
    const query = 'SELECT file_path, file_name FROM dispositions WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    
    if (rows.length === 0 || !rows[0].file_path) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan'
      });
    }
    
    const filePath = rows[0].file_path;
    const fileName = rows[0].file_name;
    
    // Cek apakah file masih ada di server
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File sudah tidak ada di server'
      });
    }
    
    // Set header untuk download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Stream file ke response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengunduh file: ' + error.message
    });
  }
};

module.exports = {
  getAllDispositions,
  createDisposition: [upload.single("file_disposisi"), createDisposition],
  deleteDisposition,
  downloadFile
};