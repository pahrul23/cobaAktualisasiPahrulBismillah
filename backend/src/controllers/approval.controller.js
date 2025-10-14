const db = require('../config/database');


class ApprovalController {
  // Get all undangan data with agenda status
  static async getUndanganApproval(req, res) {
    try {
      const query = `
        SELECT 
          l.id, l.jenis, l.no_disposisi, l.no_surat, l.asal_surat, 
          l.perihal, l.tanggal_terima, l.tanggal_surat, l.uraian, 
          l.keterangan, l.label, l.status, l.created_at,
          lu.hari_tanggal_acara, lu.pukul, lu.tempat, lu.jenis_acara, 
          lu.dress_code, lu.rsvp_required, lu.dokumentasi,
          COALESCE(a.status_kehadiran, 'belum_konfirmasi') as status_kehadiran,
          a.catatan_kehadiran, a.tanggal_konfirmasi, a.tanggal_agenda
        FROM letters l
        LEFT JOIN letter_undangan lu ON l.id = lu.letter_id
        LEFT JOIN agenda a ON l.id = a.letter_id AND a.jenis_surat = 'undangan'
        WHERE l.jenis = 'undangan' 
        ORDER BY l.tanggal_terima DESC
      `;
      
      const [rows] = await db.execute(query);
      
      res.status(200).json({
        success: true,
        data: rows,
        count: rows.length
      });
      
    } catch (error) {
      console.error('Error in getUndanganApproval:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch undangan data',
        message: error.message
      });
    }
  }


  // Get all audiensi data with agenda status
  static async getAudiensiApproval(req, res) {
    try {
      const query = `
        SELECT 
          l.id, l.jenis, l.no_disposisi, l.no_surat, l.asal_surat, 
          l.perihal, l.tanggal_terima, l.tanggal_surat, l.uraian, 
          l.keterangan, l.label, l.status, l.created_at,
          la.hari_tanggal, la.pukul, la.tempat, la.nama_pemohon,
          la.instansi_organisasi, la.jumlah_peserta, la.topik_audiensi,
          la.dokumentasi,
          COALESCE(a.status_kehadiran, 'belum_konfirmasi') as status_kehadiran,
          a.catatan_kehadiran, a.tanggal_konfirmasi, a.tanggal_agenda
        FROM letters l
        LEFT JOIN letter_audiensi la ON l.id = la.letter_id
        LEFT JOIN agenda a ON l.id = a.letter_id AND a.jenis_surat = 'audiensi'
        WHERE l.jenis = 'audiensi' 
        ORDER BY l.tanggal_terima DESC
      `;
      
      const [rows] = await db.execute(query);
      
      res.status(200).json({
        success: true,
        data: rows,
        count: rows.length
      });
      
    } catch (error) {
      console.error('Error in getAudiensiApproval:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch audiensi data',
        message: error.message
      });
    }
  }


  // Get combined approval data for dashboard
  static async getAllApprovalData(req, res) {
    try {
      const query = `
        SELECT 
          l.id, l.jenis, l.no_disposisi, l.no_surat, l.asal_surat, 
          l.perihal, l.tanggal_terima, l.tanggal_surat, l.uraian, 
          l.keterangan, l.label, l.status, l.created_at,
          -- Undangan specific fields
          lu.hari_tanggal_acara, lu.jenis_acara, lu.dress_code, 
          lu.rsvp_required, lu.dokumentasi as undangan_dokumentasi,
          -- Audiensi specific fields  
          la.hari_tanggal, la.nama_pemohon, la.instansi_organisasi,
          la.jumlah_peserta, la.topik_audiensi,
          la.dokumentasi as audiensi_dokumentasi,
          -- Common fields
          CASE 
            WHEN l.jenis = 'undangan' THEN lu.pukul 
            ELSE la.pukul 
          END as pukul,
          CASE 
            WHEN l.jenis = 'undangan' THEN lu.tempat 
            ELSE la.tempat 
          END as tempat,
          CASE 
            WHEN l.jenis = 'undangan' THEN lu.hari_tanggal_acara 
            ELSE la.hari_tanggal 
          END as tanggal_acara,
          -- Agenda status
          COALESCE(a.status_kehadiran, 'belum_konfirmasi') as status_kehadiran,
          a.catatan_kehadiran, a.tanggal_konfirmasi, a.tanggal_agenda,
          l.jenis as type
        FROM letters l
        LEFT JOIN letter_undangan lu ON l.id = lu.letter_id AND l.jenis = 'undangan'
        LEFT JOIN letter_audiensi la ON l.id = la.letter_id AND l.jenis = 'audiensi'  
        LEFT JOIN agenda a ON l.id = a.letter_id AND a.jenis_surat = l.jenis
        WHERE l.jenis IN ('undangan', 'audiensi')
        ORDER BY l.tanggal_terima DESC, l.created_at DESC
      `;
      
      const [rows] = await db.execute(query);
      
      // Separate data by type
      const undangan = rows.filter(row => row.jenis === 'undangan');
      const audiensi = rows.filter(row => row.jenis === 'audiensi');
      
      // Calculate statistics
      const stats = {
        totalPending: rows.filter(row => row.status_kehadiran === 'belum_konfirmasi').length,
        undanganCount: undangan.length,
        audiensiCount: audiensi.length,
        urgentCount: rows.filter(row => row.label === 'merah').length,
        akanHadirCount: rows.filter(row => row.status_kehadiran === 'hadir').length,
        tidakHadirCount: rows.filter(row => row.status_kehadiran === 'tidak_hadir').length
      };
      
      res.status(200).json({
        success: true,
        data: {
          all: rows,
          undangan,
          audiensi,
          stats
        },
        count: rows.length
      });
      
    } catch (error) {
      console.error('Error in getAllApprovalData:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch approval data',
        message: error.message
      });
    }
  }


  // ==================== KODE YANG DIPERBAIKI ====================
  // Update agenda status (attendance confirmation) - FIXED VERSION
  static async updateAgendaStatus(req, res) {
    const { letterId } = req.params;
    const { 
      jenis_surat, 
      status_kehadiran, 
      catatan_kehadiran, 
      created_by = 1 // Default to ketua user ID
    } = req.body;

    // Validation
    if (!letterId || !jenis_surat || !status_kehadiran) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: letterId, jenis_surat, status_kehadiran'
      });
    }

    if (!['hadir', 'tidak_hadir', 'belum_konfirmasi'].includes(status_kehadiran)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status_kehadiran. Must be: hadir, tidak_hadir, belum_konfirmasi'
      });
    }

    if (!['undangan', 'audiensi'].includes(jenis_surat)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid jenis_surat. Must be: undangan, audiensi'
      });
    }

    try {
      // Verify letter exists
      const [letterExists] = await db.execute(
        'SELECT id, jenis FROM letters WHERE id = ? AND jenis = ?',
        [letterId, jenis_surat]
      );

      if (letterExists.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Letter not found or jenis_surat mismatch'
        });
      }

      // Get letter and event date info
      let tanggal_agenda = null;
      
      if (jenis_surat === 'undangan') {
        const [undanganData] = await db.execute(
          'SELECT hari_tanggal_acara FROM letter_undangan WHERE letter_id = ?',
          [letterId]
        );
        tanggal_agenda = undanganData[0]?.hari_tanggal_acara || null;
      } else {
        const [audiensiData] = await db.execute(
          'SELECT hari_tanggal FROM letter_audiensi WHERE letter_id = ?',
          [letterId]
        );
        tanggal_agenda = audiensiData[0]?.hari_tanggal || null;
      }

      // 🐛 DEBUG LOG
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📅 Backend Update Agenda Status:');
      console.log('   Letter ID:', letterId);
      console.log('   Jenis:', jenis_surat);
      console.log('   Tanggal Agenda (dari DB):', tanggal_agenda);
      console.log('   Tanggal Sekarang (CURDATE):', new Date().toISOString().split('T')[0]);
      console.log('   Status:', status_kehadiran);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // ⭐ PERBAIKAN 1: HAPUS SEMUA DUPLICATE ENTRY LAMA
      const deleteOldQuery = `
        DELETE FROM agenda 
        WHERE letter_id = ? AND jenis_surat = ?
      `;
      const [deleteResult] = await db.execute(deleteOldQuery, [letterId, jenis_surat]);
      
      if (deleteResult.affectedRows > 0) {
        console.log(`🗑️  Deleted ${deleteResult.affectedRows} old agenda entries for letter ${letterId}`);
      }

      // ⭐ PERBAIKAN 2: INSERT BARU (bukan update)
      const insertQuery = `
        INSERT INTO agenda 
        (letter_id, jenis_surat, status_kehadiran, catatan_kehadiran, 
         tanggal_konfirmasi, tanggal_agenda, created_by, created_at, updated_at) 
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
      
      const [result] = await db.execute(insertQuery, [
        letterId, 
        jenis_surat, 
        status_kehadiran, 
        catatan_kehadiran,
        tanggal_agenda,  // ⭐ PENTING: Tanggal acara dari database
        created_by
      ]);

      console.log(`✅ Inserted new agenda entry with tanggal_agenda: ${tanggal_agenda}`);

      // Create notification for staff
      await ApprovalController.createAttendanceNotification(
        letterId, 
        jenis_surat, 
        status_kehadiran, 
        catatan_kehadiran
      );

      res.status(200).json({ 
        success: true, 
        message: `Status kehadiran ${jenis_surat} berhasil diupdate`,
        data: {
          letterId,
          jenis_surat,
          status_kehadiran,
          catatan_kehadiran,
          tanggal_agenda,
          affectedRows: result.affectedRows
        }
      });

    } catch (error) {
      console.error('❌ Error in updateAgendaStatus:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update agenda status',
        message: error.message
      });
    }
  }
  // ==================== END PERBAIKAN ====================


  // Create attendance notification for staff
  static async createAttendanceNotification(letterId, jenisAcara, statusKehadiran, catatan) {
    try {
      const letterQuery = `
        SELECT perihal, asal_surat, tanggal_terima 
        FROM letters 
        WHERE id = ?
      `;
      const [letterData] = await db.execute(letterQuery, [letterId]);
      
      if (letterData.length === 0) {
        console.log('Letter not found for notification');
        return;
      }
      
      const letter = letterData[0];
      const statusText = statusKehadiran === 'hadir' ? 'AKAN HADIR' : 'TIDAK HADIR';
      const jenisText = jenisAcara === 'undangan' ? 'undangan' : 'audiensi';
      
      const pesan = `Ketua DPD RI ${statusText} pada ${jenisText} "${letter.perihal}" dari ${letter.asal_surat} tanggal ${new Date(letter.tanggal_terima).toLocaleDateString('id-ID')}. Catatan: ${catatan}`;
      
      const notifQuery = `
        INSERT INTO notifications 
        (staff_id, jenis, pesan, letter_id, status_read, created_at)
        VALUES (NULL, 'attendance_update', ?, ?, 0, CURRENT_TIMESTAMP)
      `;
      
      await db.execute(notifQuery, [pesan, letterId]);
      console.log('Attendance notification created successfully for letter ID:', letterId);
      
    } catch (error) {
      console.error('Error creating attendance notification:', error);
    }
  }


  // Get approval statistics
  static async getApprovalStats(req, res) {
    try {
      const statsQuery = `
        SELECT 
          COUNT(CASE WHEN l.jenis = 'undangan' THEN 1 END) as total_undangan,
          COUNT(CASE WHEN l.jenis = 'audiensi' THEN 1 END) as total_audiensi,
          COUNT(CASE WHEN l.jenis IN ('undangan', 'audiensi') THEN 1 END) as total_items,
          COUNT(CASE WHEN COALESCE(a.status_kehadiran, 'belum_konfirmasi') = 'belum_konfirmasi' AND l.jenis IN ('undangan', 'audiensi') THEN 1 END) as pending_count,
          COUNT(CASE WHEN a.status_kehadiran = 'hadir' AND l.jenis IN ('undangan', 'audiensi') THEN 1 END) as akan_hadir_count,
          COUNT(CASE WHEN a.status_kehadiran = 'tidak_hadir' AND l.jenis IN ('undangan', 'audiensi') THEN 1 END) as tidak_hadir_count,
          COUNT(CASE WHEN l.label = 'merah' AND l.jenis IN ('undangan', 'audiensi') THEN 1 END) as urgent_count,
          COUNT(CASE WHEN l.status = 'baru' AND l.jenis IN ('undangan', 'audiensi') THEN 1 END) as status_baru_count
        FROM letters l
        LEFT JOIN agenda a ON l.id = a.letter_id AND a.jenis_surat = l.jenis
        WHERE l.jenis IN ('undangan', 'audiensi')
      `;
      
      const [stats] = await db.execute(statsQuery);
      
      res.status(200).json({
        success: true,
        data: stats[0]
      });
      
    } catch (error) {
      console.error('Error in getApprovalStats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch approval statistics',
        message: error.message
      });
    }
  }


  // Get specific letter details for approval
  static async getLetterDetails(req, res) {
    const { letterId } = req.params;
    
    try {
      const query = `
        SELECT 
          l.*, 
          CASE 
            WHEN l.jenis = 'undangan' THEN JSON_OBJECT(
              'hari_tanggal_acara', lu.hari_tanggal_acara,
              'pukul', lu.pukul,
              'tempat', lu.tempat,
              'jenis_acara', lu.jenis_acara,
              'dress_code', lu.dress_code,
              'rsvp_required', lu.rsvp_required,
              'dokumentasi', lu.dokumentasi
            )
            WHEN l.jenis = 'audiensi' THEN JSON_OBJECT(
              'hari_tanggal', la.hari_tanggal,
              'pukul', la.pukul,
              'tempat', la.tempat,
              'nama_pemohon', la.nama_pemohon,
              'instansi_organisasi', la.instansi_organisasi,
              'jumlah_peserta', la.jumlah_peserta,
              'topik_audiensi', la.topik_audiensi,
              'dokumentasi', la.dokumentasi
            )
            ELSE NULL
          END as detail_info,
          COALESCE(a.status_kehadiran, 'belum_konfirmasi') as status_kehadiran,
          a.catatan_kehadiran, a.tanggal_konfirmasi, a.tanggal_agenda
        FROM letters l
        LEFT JOIN letter_undangan lu ON l.id = lu.letter_id AND l.jenis = 'undangan'
        LEFT JOIN letter_audiensi la ON l.id = la.letter_id AND l.jenis = 'audiensi'
        LEFT JOIN agenda a ON l.id = a.letter_id AND a.jenis_surat = l.jenis
        WHERE l.id = ? AND l.jenis IN ('undangan', 'audiensi')
      `;
      
      const [rows] = await db.execute(query, [letterId]);
      
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Letter not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: rows[0]
      });
      
    } catch (error) {
      console.error('Error in getLetterDetails:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch letter details',
        message: error.message
      });
    }
  }


  // Get agenda list for calendar/schedule view
  static async getAgendaList(req, res) {
    try {
      const { status, month, year } = req.query;
      
      let whereClause = "WHERE l.jenis IN ('undangan', 'audiensi')";
      let params = [];
      
      if (status && status !== 'all') {
        whereClause += " AND COALESCE(a.status_kehadiran, 'belum_konfirmasi') = ?";
        params.push(status);
      }
      
      if (month && year) {
        whereClause += " AND YEAR(COALESCE(a.tanggal_agenda, CASE WHEN l.jenis = 'undangan' THEN lu.hari_tanggal_acara ELSE la.hari_tanggal END)) = ? AND MONTH(COALESCE(a.tanggal_agenda, CASE WHEN l.jenis = 'undangan' THEN lu.hari_tanggal_acara ELSE la.hari_tanggal END)) = ?";
        params.push(year, month);
      }
      
      const query = `
        SELECT 
          l.id, l.jenis, l.perihal, l.asal_surat, l.label,
          CASE 
            WHEN l.jenis = 'undangan' THEN lu.hari_tanggal_acara 
            ELSE la.hari_tanggal 
          END as tanggal_acara,
          CASE 
            WHEN l.jenis = 'undangan' THEN lu.pukul 
            ELSE la.pukul 
          END as pukul,
          CASE 
            WHEN l.jenis = 'undangan' THEN lu.tempat 
            ELSE la.tempat 
          END as tempat,
          COALESCE(a.status_kehadiran, 'belum_konfirmasi') as status_kehadiran,
          a.catatan_kehadiran, a.tanggal_konfirmasi
        FROM letters l
        LEFT JOIN letter_undangan lu ON l.id = lu.letter_id AND l.jenis = 'undangan'
        LEFT JOIN letter_audiensi la ON l.id = la.letter_id AND l.jenis = 'audiensi'
        LEFT JOIN agenda a ON l.id = a.letter_id AND a.jenis_surat = l.jenis
        ${whereClause}
        ORDER BY tanggal_acara ASC, pukul ASC
      `;
      
      const [rows] = await db.execute(query, params);
      
      res.status(200).json({
        success: true,
        data: rows,
        count: rows.length
      });
      
    } catch (error) {
      console.error('Error in getAgendaList:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch agenda list',
        message: error.message
      });
    }
  }
}


module.exports = ApprovalController;
