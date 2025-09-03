

// Path: /backend/src/controllers/dispositions.controller.js
const PDFDocument = require('pdfkit');
const { createConnection } = require('../config/database');

const generateDisposisiPDF = async (req, res) => {
  try {
    const { letterId } = req.params;

    const connection = await createConnection();
    
    // Get letter details with dispositions
    const [letters] = await connection.execute(
      `SELECT 
        l.*,
        u.name as created_by_name
      FROM letters l 
      LEFT JOIN users u ON l.created_by = u.id 
      WHERE l.id = ?`,
      [letterId]
    );

    if (letters.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        error: { message: 'Surat tidak ditemukan' }
      });
    }

    const letter = letters[0];

    // Get dispositions for this letter
    const [dispositions] = await connection.execute(
      `SELECT 
        d.*,
        u.name as disposer_name
      FROM dispositions d
      LEFT JOIN users u ON d.created_by = u.id
      WHERE d.letter_id = ?
      ORDER BY d.created_at DESC`,
      [letterId]
    );

    await connection.end();

    // Create PDF
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition', 
      `attachment; filename="Disposisi-${letter.no_surat.replace(/\//g, '-')}.pdf"`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Helper functions
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long', 
        year: 'numeric'
      });
    };

    const addLine = (y) => {
      doc.moveTo(50, y)
         .lineTo(550, y)
         .stroke('#cccccc');
    };

    // PDF Content
    let currentY = 70;

    // Header
    doc.font('Helvetica-Bold')
       .fontSize(18)
       .text('LEMBAR DISPOSISI', 0, currentY, { align: 'center' });
    
    currentY += 25;
    
    doc.font('Helvetica-Bold')
       .fontSize(14)
       .text('SEKRETARIAT KETUA DPD RI', 0, currentY, { align: 'center' });
    
    currentY += 40;
    addLine(currentY);
    currentY += 30;

    // Letter Information
    doc.font('Helvetica-Bold')
       .fontSize(12)
       .text('INFORMASI SURAT', 50, currentY);
    
    currentY += 25;

    const letterInfo = [
      ['No. Disposisi', letter.no_disposisi],
      ['No. Surat', letter.no_surat],
      ['Asal Surat', letter.asal_surat],
      ['Perihal', letter.perihal],
      ['Tanggal Surat', formatDate(letter.tanggal_surat)],
      ['Tanggal Terima', formatDate(letter.tanggal_terima)],
      ['Jenis Surat', letter.jenis.charAt(0).toUpperCase() + letter.jenis.slice(1)]
    ];

    letterInfo.forEach(([label, value]) => {
      doc.font('Helvetica')
         .fontSize(10)
         .text(`${label}:`, 70, currentY, { width: 120 })
         .text(value || '-', 190, currentY, { width: 300 });
      currentY += 18;
    });

    currentY += 10;

    // Uraian
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .text('Uraian:', 70, currentY);
    
    currentY += 15;
    
    const uraianText = letter.uraian || 'Tidak ada uraian';
    const uraianHeight = doc.heightOfString(uraianText, { width: 420 });
    
    doc.font('Helvetica')
       .fontSize(10)
       .text(uraianText, 70, currentY, { 
         width: 420, 
         align: 'justify' 
       });
    
    currentY += uraianHeight + 20;

    // Keterangan (if exists)
    if (letter.keterangan) {
      doc.font('Helvetica-Bold')
         .fontSize(10)
         .text('Keterangan:', 70, currentY);
      
      currentY += 15;
      
      const keteranganHeight = doc.heightOfString(letter.keterangan, { width: 420 });
      
      doc.font('Helvetica')
         .fontSize(10)
         .text(letter.keterangan, 70, currentY, { 
           width: 420, 
           align: 'justify' 
         });
      
      currentY += keteranganHeight + 20;
    }

    // Dispositions Section
    if (dispositions.length > 0) {
      addLine(currentY);
      currentY += 20;
      
      doc.font('Helvetica-Bold')
         .fontSize(12)
         .text('DISPOSISI', 50, currentY);
      
      currentY += 25;

      dispositions.forEach((disp, index) => {
        doc.font('Helvetica-Bold')
           .fontSize(10)
           .text(`${index + 1}. ${formatDate(disp.created_at)} - ${disp.disposer_name}:`, 70, currentY);
        
        currentY += 15;
        
        const dispHeight = doc.heightOfString(disp.disposisi_arah, { width: 400 });
        
        doc.font('Helvetica')
           .fontSize(10)
           .text(disp.disposisi_arah, 90, currentY, { 
             width: 400, 
             align: 'justify' 
           });
        
        currentY += dispHeight + 15;
      });
    }

    // Signature Section
    currentY += 40;
    
    if (currentY > 700) {
      doc.addPage();
      currentY = 70;
    }
    
    addLine(currentY);
    currentY += 30;

    // Date and Place
    const today = new Date();
    const jakartaDate = formatDate(today);
    
    doc.font('Helvetica')
       .fontSize(10)
       .text(`Jakarta, ${jakartaDate}`, 350, currentY);
    
    currentY += 20;
    
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .text('Ketua DPD RI', 350, currentY);
    
    currentY += 80; // Space for signature
    
    doc.font('Helvetica')
       .fontSize(10)
       .text('( _________________________ )', 300, currentY);

    // Footer
    const footerY = doc.page.height - 80;
    addLine(footerY - 10);
    
    doc.font('Helvetica')
       .fontSize(8)
       .fillColor('#666666')
       .text('Dokumen ini dibuat secara otomatis oleh Sistem Informasi Surat DPD RI', 
             0, footerY, { align: 'center' });

    // Finalize PDF
    doc.end();

    console.log(`PDF disposisi generated for letter ${letter.no_surat} by ${req.user.name}`);

  } catch (error) {
    console.error('Generate disposisi PDF error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Gagal generate disposisi PDF' }
    });
  }
};

const createDisposisi = async (req, res) => {
  try {
    const { letter_id, disposisi_arah } = req.body;

    if (!letter_id || !disposisi_arah) {
      return res.status(400).json({
        success: false,
        error: { message: 'Letter ID dan disposisi arah wajib diisi' }
      });
    }

    const connection = await createConnection();

    // Check if letter exists
    const [letters] = await connection.execute(
      'SELECT id FROM letters WHERE id = ?',
      [letter_id]
    );

    if (letters.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        error: { message: 'Surat tidak ditemukan' }
      });
    }

    // Create disposisi
    const [result] = await connection.execute(
      'INSERT INTO dispositions (letter_id, disposisi_arah, created_by) VALUES (?, ?, ?)',
      [letter_id, disposisi_arah, req.user.id]
    );

    // Get created disposisi
    const [newDisposisi] = await connection.execute(
      `SELECT 
        d.*,
        u.name as created_by_name,
        l.no_surat
      FROM dispositions d
      LEFT JOIN users u ON d.created_by = u.id
      LEFT JOIN letters l ON d.letter_id = l.id
      WHERE d.id = ?`,
      [result.insertId]
    );

    await connection.end();

    console.log(`Disposisi created for letter ${newDisposisi[0].no_surat} by ${req.user.name}`);

    res.status(201).json({
      success: true,
      data: newDisposisi[0],
      message: 'Disposisi berhasil dibuat'
    });

  } catch (error) {
    console.error('Create disposisi error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Gagal membuat disposisi' }
    });
  }
};

const getDispositions = async (req, res) => {
  try {
    const { letter_id } = req.query;

    const connection = await createConnection();

    let query = `
      SELECT 
        d.*,
        u.name as created_by_name,
        l.no_surat,
        l.perihal
      FROM dispositions d
      LEFT JOIN users u ON d.created_by = u.id
      LEFT JOIN letters l ON d.letter_id = l.id
    `;
    
    const params = [];

    if (letter_id) {
      query += ' WHERE d.letter_id = ?';
      params.push(letter_id);
    }

    query += ' ORDER BY d.created_at DESC';

    const [dispositions] = await connection.execute(query, params);
    await connection.end();

    res.json({
      success: true,
      data: dispositions
    });

  } catch (error) {
    console.error('Get dispositions error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Gagal mengambil data disposisi' }
    });
  }
};

module.exports = {
  generateDisposisiPDF,
  createDisposisi,
  getDispositions
};