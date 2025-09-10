// const db = require('../../config/database');
const db = require('../config/database')


const getAllDispositions = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Dispositions endpoint',
      data: []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createDisposition = async (req, res) => {
  try {
    console.log('POST /api/dispositions called');
    console.log('Request body:', req.body);
    
    const { letter_id, no_surat, disposisi_kepada, instruksi, catatan } = req.body;

    // Basic validation
    if (!letter_id || !no_surat || !disposisi_kepada) {
      return res.status(400).json({
        success: false,
        message: 'Data tidak lengkap: letter_id, no_surat, disposisi_kepada wajib diisi'
      });
    }

    // Parse instruksi
    let parsedInstruksi;
    try {
      parsedInstruksi = typeof instruksi === 'string' ? JSON.parse(instruksi) : instruksi;
    } catch (e) {
      parsedInstruksi = [];
    }

    // Insert ke database
    const query = `
      INSERT INTO dispositions (letter_id, no_surat, disposisi_kepada, instruksi, catatan, status, created_at) 
      VALUES (?, ?, ?, ?, ?, 'pending', NOW())
    `;
    
    const [result] = await db.promise().query(query, [
      letter_id,
      no_surat, 
      disposisi_kepada,
      JSON.stringify(parsedInstruksi),
      catatan || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Disposisi berhasil dibuat',
      data: {
        id: result.insertId,
        letter_id,
        no_surat,
        disposisi_kepada,
        instruksi: parsedInstruksi
      }
    });

  } catch (error) {
    console.error('Error creating disposition:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat disposisi: ' + error.message
    });
  }
};

module.exports = {
  getAllDispositions,
  createDisposition
};