const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const db = require('../config/database')

const disposisiController = {
  // Generate HTML template for disposisi
  generateDisposisiHTML(letterData) {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      })
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 12px;
          line-height: 1.2;
          margin: 0;
          padding: 0;
        }
        .header {
          text-align: center;
          border: 2px solid black;
          padding: 10px;
          margin-bottom: 0;
        }
        .header h2 {
          margin: 0;
          font-weight: bold;
          font-size: 14px;
        }
        .header p {
          margin: 2px 0;
          font-size: 11px;
        }
        .form-section {
          border: 2px solid black;
          border-top: none;
        }
        .form-row {
          display: flex;
          border-bottom: 1px solid black;
          min-height: 25px;
        }
        .form-row:last-child {
          border-bottom: none;
        }
        .form-label {
          width: 35%;
          padding: 5px 8px;
          border-right: 1px solid black;
          font-weight: normal;
        }
        .form-value {
          flex: 1;
          padding: 5px 8px;
        }
        .disposisi-section {
          border: 2px solid black;
          border-top: none;
          display: flex;
        }
        .disposisi-left {
          width: 35%;
          padding: 10px;
          border-right: 1px solid black;
        }
        .disposisi-center {
          width: 40%;
          padding: 10px;
          border-right: 1px solid black;
        }
        .disposisi-right {
          width: 25%;
          padding: 10px;
          text-align: center;
        }
        .checkbox-item {
          margin: 3px 0;
          font-size: 11px;
        }
        .checkbox {
          width: 12px;
          height: 12px;
          border: 1px solid black;
          display: inline-block;
          margin-right: 5px;
          text-align: center;
          line-height: 10px;
        }
        .title-section {
          background-color: #f0f0f0;
          text-align: center;
          padding: 5px;
          font-weight: bold;
          border-bottom: 1px solid black;
        }
        .logo {
          width: 50px;
          height: 50px;
          float: left;
          margin-right: 10px;
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header">
        <h2>KETUA</h2>
        <h2>DEWAN PERWAKILAN DAERAH</h2>
        <h2>REPUBLIK INDONESIA</h2>
        <p>Jl. Jenderal Gatot Subroto No. 6 Jakarta - 10270</p>
      </div>

      <!-- Title Section -->
      <div class="form-section">
        <div class="title-section">
          LEMBAR DISPOSISI KETUA DPD RI
        </div>
      </div>

      <!-- Form Information -->
      <div class="form-section">
        <div class="form-row">
          <div class="form-label">Nomor Agenda/Registrasi</div>
          <div class="form-value">: ${letterData.no_disposisi}</div>
          <div class="form-label" style="width: 20%; border-left: 1px solid black;">Tkt. Keamanan</div>
          <div class="form-value" style="width: 20%;">:</div>
        </div>
        
        <div class="form-row">
          <div class="form-label">Tanggal Penerimaan</div>
          <div class="form-value">: ${formatDate(letterData.tanggal_terima)}</div>
          <div class="form-label" style="width: 20%; border-left: 1px solid black;">Tgl. Penyelesaian</div>
          <div class="form-value" style="width: 20%;">: ........................</div>
        </div>

        <div class="form-row">
          <div class="form-label">Asal Disposisi/Surat/Nota Dinas/Memorandum</div>
          <div class="form-value">: ${letterData.asal_surat}</div>
        </div>

        <div class="form-row">
          <div class="form-label">Tanggal dan Nomor Surat/Nota Dinas/Memorandum</div>
          <div class="form-value">: ${formatDate(letterData.tanggal_surat)} / ${letterData.no_surat}</div>
        </div>

        <div class="form-row">
          <div class="form-label">Dari</div>
          <div class="form-value">: ${letterData.asal_surat}</div>
        </div>

        <div class="form-row">
          <div class="form-label">Ringkasan Isi</div>
          <div class="form-value">: ${letterData.perihal}</div>
        </div>

        <div class="form-row">
          <div class="form-label">Lampiran</div>
          <div class="form-value">: ${letterData.file_surat_name || '-'}</div>
        </div>
      </div>

      <!-- Disposisi Section -->
      <div class="disposisi-section">
        <!-- Left Column - Disposisi Actions -->
        <div class="disposisi-left">
          <div style="font-weight: bold; text-align: center; margin-bottom: 10px;">Disposisi</div>
          
          ${this.generateDisposisiCheckboxes(letterData.jenis)}
        </div>

        <!-- Center Column - Diteruskan Kepada -->
        <div class="disposisi-center">
          <div style="font-weight: bold; text-align: center; margin-bottom: 10px;">Diteruskan Kepada :</div>
          
          <div class="checkbox-item"><span class="checkbox">☐</span> Wakil Ketua Bid. I</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> Wakil Ketua Bid. II</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> Wakil Ketua Bid. III</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> Sesjen</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> Deputi Persidangan</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> Deputi Administrasi</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> Staf Khusus</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> Komite I</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> Komite II</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> Komite III</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> Komite IV</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> PURT</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> Panitia Musyawarah</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> PPUU</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> BK</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> BAP</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> BKSP</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> BULD</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> Karo. Setpim</div>
          <div class="checkbox-item"><span class="checkbox">☐</span> Kabag. Set. Ketua</div>
          <div style="margin-top: 10px;">
            <div>…………………………..</div>
            <div>…………………………..</div>
            <div>…………………………..</div>
          </div>
        </div>

        <!-- Right Column - Paraf -->
        <div class="disposisi-right">
          <div style="font-weight: bold; margin-bottom: 10px;">Paraf</div>
          <div style="height: 100px; border: 1px solid black; margin-top: 20px;"></div>
        </div>
      </div>
    </body>
    </html>
    `
  },

  // Generate specific checkboxes based on letter type
  generateDisposisiCheckboxes(jenisS) {
    const baseActions = [
      { id: 'hadir', label: 'Hadir', checked: false },
      { id: 'hadir_virtual', label: 'Hadir Virtual', checked: false },
      { id: 'tidak_hadir', label: 'Tidak Hadir', checked: false },
      { id: 'kirim_bunga', label: 'Kirim Bunga', checked: false },
      { id: 'temui_saya', label: 'Temui Saya', checked: false },
      { id: 'siapkan_jawaban', label: 'Siapkan Jawaban', checked: false },
      { id: 'siapkan_draft', label: 'Siapkan Draft', checked: false },
      { id: 'siapkan_protokol', label: 'Siapkan Protokol', checked: false },
      { id: 'check', label: 'Check', checked: false },
      { id: 'humas', label: 'Humas', checked: false },
      { id: 'siapkan_foto_video', label: 'Siapkan Foto Video', checked: false },
      { id: 'siapkan_media', label: 'Siapkan Media', checked: false },
      { id: 'untuk_dipelajari', label: 'Untuk Dipelajari', checked: false },
      { id: 'untuk_diketahui', label: 'Untuk Diketahui', checked: false },
      { id: 'untuk_diselesaikan', label: 'Untuk Diselesaikan', checked: false },
      { id: 'dapat_disetujui', label: 'Dapat Disetujui', checked: false },
      { id: 'harap_dipenuhi', label: 'Harap Dipenuhi', checked: false },
      { id: 'koordinasikan', label: 'Koordinasikan', checked: false },
      { id: 'file', label: 'File', checked: false }
    ]

    // Auto-check relevant actions based on letter type
    switch (jenisS) {
      case 'undangan':
        baseActions.find(a => a.id === 'hadir').checked = true
        baseActions.find(a => a.id === 'siapkan_protokol').checked = true
        break
      case 'audiensi':
        baseActions.find(a => a.id === 'temui_saya').checked = true
        baseActions.find(a => a.id === 'dapat_disetujui').checked = true
        break
      case 'proposal':
        baseActions.find(a => a.id === 'untuk_dipelajari').checked = true
        baseActions.find(a => a.id === 'koordinasikan').checked = true
        break
      case 'pengaduan':
        baseActions.find(a => a.id === 'untuk_diselesaikan').checked = true
        baseActions.find(a => a.id === 'harap_dipenuhi').checked = true
        break
      case 'pemberitahuan':
        baseActions.find(a => a.id === 'untuk_diketahui').checked = true
        baseActions.find(a => a.id === 'file').checked = true
        break
    }

    return baseActions.map(action => {
      const checkmark = action.checked ? '☑' : '☐'
      return `<div class="checkbox-item"><span class="checkbox">${checkmark}</span> ${action.label}</div>`
    }).join('') + `
      <div style="margin-top: 10px;">
        <div>…………………………..</div>
        <div>…………………………..</div>
        <div>…………………………..</div>
      </div>
    `
  },

  // Generate and save PDF
  async generateDisposisiPDF(req, res) {
    try {
      const { id } = req.params
      
      // Get letter data
      const query = `
        SELECT 
          l.*,
          u.name as created_by_name,
          -- Additional fields based on jenis
          lp.jenis_pengaduan, lp.tingkat_urgensi,
          lu.hari_tanggal_acara, lu.jenis_acara,
          la.hari_tanggal as audiensi_tanggal, la.nama_pemohon,
          p.nama_pengirim, p.judul_proposal,
          lpb.kategori_pemberitahuan, lpb.tingkat_prioritas
        FROM letters l
        LEFT JOIN users u ON l.created_by = u.id
        LEFT JOIN letter_pengaduan lp ON l.id = lp.letter_id
        LEFT JOIN letter_undangan lu ON l.id = lu.letter_id
        LEFT JOIN letter_audiensi la ON l.id = la.letter_id
        LEFT JOIN proposals p ON l.id = p.letter_id
        LEFT JOIN letter_pemberitahuan lpb ON l.id = lpb.letter_id
        WHERE l.id = ?
      `
      
      const [letters] = await db.execute(query, [id])
      
      if (letters.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Surat tidak ditemukan'
        })
      }

      const letter = letters[0]
      
      // Generate HTML
      const htmlContent = this.generateDisposisiHTML(letter)
      
      // Generate PDF using Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      
      const page = await browser.newPage()
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      })
      
      await browser.close()
      
      // Save to file system
      const fileName = `DISPOSISI_${letter.no_disposisi.replace(/\//g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      const filePath = path.join('uploads', 'disposisi', fileName)
      
      // Ensure directory exists
      const disposisiDir = path.join('uploads', 'disposisi')
      if (!fs.existsSync(disposisiDir)) {
        fs.mkdirSync(disposisiDir, { recursive: true })
      }
      
      // Write PDF file
      fs.writeFileSync(filePath, pdfBuffer)
      
      // Update database with file path
      await db.execute(
        'UPDATE letters SET disposisi_file_path = ?, disposisi_generated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [filePath, id]
      )
      
      // Send PDF as response
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
      res.send(pdfBuffer)
      
    } catch (error) {
      console.error('Error generating disposisi PDF:', error)
      res.status(500).json({
        success: false,
        message: 'Gagal generate file disposisi',
        error: error.message
      })
    }
  },

  // Get existing disposisi file
  async getDisposisiFile(req, res) {
    try {
      const { id } = req.params
      
      const [letters] = await db.execute(
        'SELECT disposisi_file_path, no_disposisi FROM letters WHERE id = ?',
        [id]
      )
      
      if (letters.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Surat tidak ditemukan'
        })
      }
      
      const letter = letters[0]
      
      if (!letter.disposisi_file_path || !fs.existsSync(letter.disposisi_file_path)) {
        // Generate new PDF if not exists
        return this.generateDisposisiPDF(req, res)
      }
      
      // Send existing file
      const fileName = path.basename(letter.disposisi_file_path)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
      res.sendFile(path.resolve(letter.disposisi_file_path))
      
    } catch (error) {
      console.error('Error getting disposisi file:', error)
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil file disposisi'
      })
    }
  },

  // Regenerate disposisi (for updates)
  async regenerateDisposisi(req, res) {
    try {
      const { id } = req.params
      
      // Delete old file if exists
      const [letters] = await db.execute(
        'SELECT disposisi_file_path FROM letters WHERE id = ?',
        [id]
      )
      
      if (letters.length > 0 && letters[0].disposisi_file_path) {
        if (fs.existsSync(letters[0].disposisi_file_path)) {
          fs.unlinkSync(letters[0].disposisi_file_path)
        }
      }
      
      // Generate new PDF
      return this.generateDisposisiPDF(req, res)
      
    } catch (error) {
      console.error('Error regenerating disposisi:', error)
      res.status(500).json({
        success: false,
        message: 'Gagal regenerate file disposisi'
      })
    }
  }
}

module.exports = disposisiController