const { createConnection } = require('../config/database');

const generateDisposisiPDF = async (req, res) => {
  try {
    const { letterId } = req.params;

    const connection = await createConnection();
    
    // Get letter details
    const [letters] = await connection.execute(
      `SELECT l.*, u.name as created_by_name 
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
    
    // Simple HTML template untuk PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Disposisi Surat ${letter.no_surat}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .content { margin: 20px 0; }
          .signature { margin-top: 50px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>DISPOSISI SURAT</h2>
          <h3>SEKRETARIAT KETUA DPD RI</h3>
        </div>
        
        <div class="content">
          <table width="100%" cellpadding="5">
            <tr><td width="30%">No Disposisi</td><td>: ${letter.no_disposisi}</td></tr>
            <tr><td>No Surat</td><td>: ${letter.no_surat}</td></tr>
            <tr><td>Asal Surat</td><td>: ${letter.asal_surat}</td></tr>
            <tr><td>Perihal</td><td>: ${letter.perihal}</td></tr>
            <tr><td>Tanggal Terima</td><td>: ${new Date(letter.tanggal_terima).toLocaleDateString('id-ID')}</td></tr>
            <tr><td>Jenis Surat</td><td>: ${letter.jenis}</td></tr>
          </table>
          
          <div style="margin-top: 30px;">
            <strong>Uraian:</strong><br>
            ${letter.uraian}
          </div>
          
          ${letter.keterangan ? `
          <div style="margin-top: 20px;">
            <strong>Keterangan:</strong><br>
            ${letter.keterangan}
          </div>
          ` : ''}
        </div>
        
        <div class="signature">
          <p>Jakarta, ${new Date().toLocaleDateString('id-ID')}</p>
          <p style="margin-top: 80px;">
            <strong>Ketua DPD RI</strong>
          </p>
        </div>
      </body>
      </html>
    `;

    await connection.end();

    // Set headers untuk download PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Disposisi-${letter.no_surat}.pdf"`);
    
    // For now, return HTML (you can integrate puppeteer later for real PDF)
    res.send(htmlContent);

  } catch (error) {
    console.error('Generate disposisi PDF error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Gagal generate disposisi PDF' }
    });
  }
};

module.exports = {
  generateDisposisiPDF
};