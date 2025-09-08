// Path: /backend/src/controllers/executive.controller.js - IMPROVED VERSION
const db = require('../config/database');

const executiveController = {
  // GET /api/executive/surat-summary?month=YYYY-MM
  async getSuratSummary(req, res) {
    try {
      const { month } = req.query;
      
      let whereClause = '';
      let queryParams = [];

      // Filter by month if provided
      if (month) {
        // Validate month format
        if (!/^\d{4}-\d{2}$/.test(month)) {
          return res.status(400).json({
            success: false,
            message: 'Format bulan tidak valid. Gunakan format YYYY-MM'
          });
        }
        whereClause = 'WHERE DATE_FORMAT(l.created_at, "%Y-%m") = ?';
        queryParams.push(month);
      } else {
        // Default to current month
        whereClause = 'WHERE DATE_FORMAT(l.created_at, "%Y-%m") = DATE_FORMAT(CURRENT_DATE, "%Y-%m")';
      }

      // Get summary by letter type
      const summaryQuery = `
        SELECT 
          l.jenis,
          COUNT(*) as jumlah,
          DATE_FORMAT(l.created_at, '%Y-%m') as bulan
        FROM letters l
        ${whereClause}
        GROUP BY l.jenis, DATE_FORMAT(l.created_at, '%Y-%m')
        ORDER BY l.jenis
      `;

      const [summaryResult] = await db.execute(summaryQuery, queryParams);

      // Get total count
      const totalQuery = `
        SELECT COUNT(*) as total
        FROM letters l
        ${whereClause}
      `;

      const [totalResult] = await db.execute(totalQuery, queryParams);

      // Get monthly trend (last 6 months)
      const trendQuery = `
        SELECT 
          DATE_FORMAT(l.created_at, '%Y-%m') as bulan,
          l.jenis,
          COUNT(*) as jumlah
        FROM letters l
        WHERE l.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(l.created_at, '%Y-%m'), l.jenis
        ORDER BY bulan DESC, l.jenis
      `;

      const [trendResult] = await db.execute(trendQuery);

      // Format summary data
      const jenisTypes = ['pengaduan', 'undangan', 'audiensi', 'proposal', 'pemberitahuan'];
      const formattedSummary = jenisTypes.map(jenis => {
        const found = summaryResult.find(item => item.jenis === jenis);
        return {
          jenis,
          jumlah: found ? parseInt(found.jumlah) : 0
        };
      });

      res.json({
        success: true,
        data: {
          summary: formattedSummary,
          total: parseInt(totalResult[0].total),
          trend: trendResult.map(item => ({
            ...item,
            jumlah: parseInt(item.jumlah)
          })),
          month: month || new Date().toISOString().slice(0, 7)
        }
      });

    } catch (error) {
      console.error('Error fetching surat summary:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil ringkasan surat',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // GET /api/executive/proposals - Get proposals needing approval
  async getProposalsForApproval(req, res) {
    try {
      const { status = 'pending,diproses,verifikasi', limit = 50, offset = 0 } = req.query;
      
      // Parse status filter
      const statusArray = status.split(',').map(s => s.trim()).filter(s => s);
      const statusPlaceholders = statusArray.map(() => '?').join(',');
      
      const query = `
        SELECT 
          p.*,
          l.no_surat,
          l.asal_surat,
          l.perihal,
          l.tanggal_surat,
          l.created_at,
          COALESCE(p.total_anggaran, 0) as total_anggaran,
          COALESCE(p.jumlah_dibantu, 0) as jumlah_dibantu
        FROM proposals p
        LEFT JOIN letters l ON p.letter_id = l.id
        WHERE p.status IN (${statusPlaceholders})
        ORDER BY l.created_at DESC
        LIMIT ? OFFSET ?
      `;

      const queryParams = [...statusArray, parseInt(limit), parseInt(offset)];
      const [proposals] = await db.execute(query, queryParams);

      // Get total count for pagination
      const countQuery = `
        SELECT COUNT(*) as total
        FROM proposals p
        WHERE p.status IN (${statusPlaceholders})
      `;

      const [countResult] = await db.execute(countQuery, statusArray);

      res.json({
        success: true,
        data: proposals,
        pagination: {
          total: countResult[0].total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });

    } catch (error) {
      console.error('Error fetching proposals:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil proposal',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // PUT /api/executive/proposals/:id - Update proposal decision
  async updateProposalDecision(req, res) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const { 
        keputusan, // 'setuju', 'tidak_setuju', 'perlu_revisi'
        nominal_bantuan, 
        catatan_ketua,
        updated_by = 1 // Ketua user ID
      } = req.body;

      // Validation
      if (!keputusan || !['setuju', 'tidak_setuju', 'perlu_revisi'].includes(keputusan)) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Keputusan tidak valid. Harus: setuju, tidak_setuju, atau perlu_revisi'
        });
      }

      if (keputusan === 'setuju' && (!nominal_bantuan || nominal_bantuan <= 0)) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Nominal bantuan harus diisi untuk proposal yang disetujui'
        });
      }

      // Check if proposal exists
      const [existingProposal] = await connection.execute(
        'SELECT id, status FROM proposals WHERE id = ?', 
        [id]
      );

      if (existingProposal.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Proposal tidak ditemukan'
        });
      }

      // Determine status based on decision
      let newStatus;
      switch (keputusan) {
        case 'setuju':
          newStatus = 'selesai';
          break;
        case 'tidak_setuju':
          newStatus = 'ditolak';
          break;
        case 'perlu_revisi':
          newStatus = 'diproses';
          break;
        default:
          newStatus = 'verifikasi';
      }

      // Update proposal
      const updateQuery = `
        UPDATE proposals 
        SET 
          status = ?,
          jumlah_dibantu = ?,
          catatan_tindak_lanjut = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const nominalValue = keputusan === 'setuju' ? (nominal_bantuan || 0) : 0;
      
      await connection.execute(updateQuery, [
        newStatus,
        nominalValue,
        catatan_ketua || null,
        id
      ]);

      // Get proposal details for notification
      const [proposalDetails] = await connection.execute(`
        SELECT p.*, l.no_surat, l.perihal, l.asal_surat
        FROM proposals p
        LEFT JOIN letters l ON p.letter_id = l.id
        WHERE p.id = ?
      `, [id]);

      if (proposalDetails.length > 0) {
        const proposal = proposalDetails[0];
        
        // Create notification for staff
        const notificationQuery = `
          INSERT INTO notifications (
            staff_id, jenis, pesan, proposal_id, status_read, created_at
          ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;

        const statusText = keputusan === 'setuju' ? 'DISETUJUI' : 
                          keputusan === 'tidak_setuju' ? 'DITOLAK' : 'PERLU REVISI';
        
        const nominalText = keputusan === 'setuju' && nominalValue > 0 
          ? ` dengan nominal bantuan Rp ${nominalValue.toLocaleString('id-ID')}` 
          : '';

        const message = `Proposal "${proposal.judul_proposal || proposal.perihal}" dari ${proposal.asal_surat} telah ${statusText} oleh Ketua DPD RI${nominalText}. ${catatan_ketua ? `Catatan: ${catatan_ketua}` : ''}`;

        await connection.execute(notificationQuery, [
          null, // Broadcast to all staff
          'proposal_decision',
          message,
          id,
          false
        ]);
      }

      await connection.commit();

      res.json({
        success: true,
        message: 'Keputusan proposal berhasil disimpan',
        data: {
          id: parseInt(id),
          keputusan,
          status: newStatus,
          nominal_bantuan: nominalValue,
          catatan_ketua: catatan_ketua || null
        }
      });

    } catch (error) {
      await connection.rollback();
      console.error('Error updating proposal decision:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat menyimpan keputusan',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    } finally {
      connection.release();
    }
  },

  // GET /api/executive/undangan - Get undangan/audiensi for confirmation
  async getUndanganAudiensi(req, res) {
    try {
      const { months = 3, status = '', limit = 50 } = req.query;

      // Build status filter
      let statusFilter = '';
      let statusParams = [];
      if (status) {
        const statusArray = status.split(',').map(s => s.trim()).filter(s => s);
        if (statusArray.length > 0) {
          statusFilter = `AND a.status_kehadiran IN (${statusArray.map(() => '?').join(',')})`;
          statusParams = statusArray;
        }
      }

      // Get undangan
      const undanganQuery = `
        SELECT 
          l.id,
          l.no_surat,
          l.asal_surat,
          l.perihal,
          l.tanggal_surat,
          'undangan' as jenis,
          lu.hari_tanggal_acara as tanggal_acara,
          lu.pukul,
          lu.tempat,
          lu.jenis_acara,
          COALESCE(a.status_kehadiran, '') as status_kehadiran,
          a.catatan_kehadiran
        FROM letters l
        LEFT JOIN letter_undangan lu ON l.id = lu.letter_id
        LEFT JOIN agenda a ON l.id = a.letter_id
        WHERE l.jenis = 'undangan'
        AND l.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL ? MONTH)
        ${statusFilter}
        ORDER BY lu.hari_tanggal_acara DESC
        LIMIT ?
      `;

      // Get audiensi
      const audiensiQuery = `
        SELECT 
          l.id,
          l.no_surat,
          l.asal_surat,
          l.perihal,
          l.tanggal_surat,
          'audiensi' as jenis,
          la.hari_tanggal as tanggal_acara,
          la.pukul,
          la.tempat,
          la.topik_audiensi as jenis_acara,
          COALESCE(a.status_kehadiran, '') as status_kehadiran,
          a.catatan_kehadiran
        FROM letters l
        LEFT JOIN letter_audiensi la ON l.id = la.letter_id
        LEFT JOIN agenda a ON l.id = a.letter_id
        WHERE l.jenis = 'audiensi'
        AND l.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL ? MONTH)
        ${statusFilter}
        ORDER BY la.hari_tanggal DESC
        LIMIT ?
      `;

      const undanganParams = [parseInt(months), ...statusParams, parseInt(limit)];
      const audiensiParams = [parseInt(months), ...statusParams, parseInt(limit)];

      const [undangan] = await db.execute(undanganQuery, undanganParams);
      const [audiensi] = await db.execute(audiensiQuery, audiensiParams);

      // Combine and sort by date
      const combined = [...undangan, ...audiensi].sort((a, b) => {
        const dateA = new Date(a.tanggal_acara || a.tanggal_surat);
        const dateB = new Date(b.tanggal_acara || b.tanggal_surat);
        return dateB - dateA;
      });

      res.json({
        success: true,
        data: combined.slice(0, parseInt(limit))
      });

    } catch (error) {
      console.error('Error fetching undangan/audiensi:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil undangan/audiensi',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // PUT /api/executive/undangan/:id - Update attendance status
  async updateAttendanceStatus(req, res) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const { 
        status_kehadiran, // 'hadir', 'tidak_hadir', 'ditunda'
        catatan_ketua,
        updated_by = 1 // Ketua user ID
      } = req.body;

      // Validation
      if (!status_kehadiran || !['hadir', 'tidak_hadir', 'ditunda'].includes(status_kehadiran)) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Status kehadiran tidak valid. Harus: hadir, tidak_hadir, atau ditunda'
        });
      }

      // Check if letter exists
      const [existingLetter] = await connection.execute(
        'SELECT id, jenis FROM letters WHERE id = ?', 
        [id]
      );

      if (existingLetter.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Surat tidak ditemukan'
        });
      }

      // Check if agenda record exists, create if not
      const [existingAgenda] = await connection.execute(
        'SELECT id FROM agenda WHERE letter_id = ?', 
        [id]
      );

      if (existingAgenda.length === 0) {
        // Create new agenda record
        await connection.execute(`
          INSERT INTO agenda (letter_id, status_kehadiran, catatan_kehadiran, created_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `, [id, status_kehadiran, catatan_ketua || null]);
      } else {
        // Update existing agenda record
        await connection.execute(`
          UPDATE agenda 
          SET 
            status_kehadiran = ?,
            catatan_kehadiran = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE letter_id = ?
        `, [status_kehadiran, catatan_ketua || null, id]);
      }

      // Get letter details for notification
      const [letterDetails] = await connection.execute(`
        SELECT l.*, 
        CASE 
          WHEN l.jenis = 'undangan' THEN lu.hari_tanggal_acara
          WHEN l.jenis = 'audiensi' THEN la.hari_tanggal
          ELSE l.tanggal_surat
        END as tanggal_acara
        FROM letters l
        LEFT JOIN letter_undangan lu ON l.id = lu.letter_id
        LEFT JOIN letter_audiensi la ON l.id = la.letter_id
        WHERE l.id = ?
      `, [id]);

      if (letterDetails.length > 0) {
        const letter = letterDetails[0];
        
        // Create notification for staff
        const notificationQuery = `
          INSERT INTO notifications (
            staff_id, jenis, pesan, letter_id, status_read, created_at
          ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;

        const statusText = status_kehadiran === 'hadir' ? 'AKAN HADIR' : 
                          status_kehadiran === 'tidak_hadir' ? 'TIDAK HADIR' : 'DITUNDA';

        const tanggalText = letter.tanggal_acara 
          ? new Date(letter.tanggal_acara).toLocaleDateString('id-ID')
          : 'tanggal tidak tersedia';

        const message = `Ketua DPD RI ${statusText} pada ${letter.jenis} "${letter.perihal}" dari ${letter.asal_surat} tanggal ${tanggalText}. ${catatan_ketua ? `Catatan: ${catatan_ketua}` : ''}`;

        await connection.execute(notificationQuery, [
          null, // Broadcast to all staff
          'attendance_update',
          message,
          id,
          false
        ]);
      }

      await connection.commit();

      res.json({
        success: true,
        message: 'Status kehadiran berhasil diupdate',
        data: {
          id: parseInt(id),
          status_kehadiran,
          catatan_ketua: catatan_ketua || null
        }
      });

    } catch (error) {
      await connection.rollback();
      console.error('Error updating attendance:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengupdate status kehadiran',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    } finally {
      connection.release();
    }
  },

  // GET /api/executive/notifications - Get Ketua's action history
  async getExecutiveNotifications(req, res) {
    try {
      const { page = 1, limit = 20, jenis = '' } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Build jenis filter
      let jenisFilter = '';
      let jenisParams = [];
      if (jenis) {
        const jenisArray = jenis.split(',').map(j => j.trim()).filter(j => j);
        if (jenisArray.length > 0) {
          jenisFilter = `AND n.jenis IN (${jenisArray.map(() => '?').join(',')})`;
          jenisParams = jenisArray;
        }
      } else {
        jenisFilter = `AND n.jenis IN ('proposal_decision', 'attendance_update', 'general')`;
      }

      const query = `
        SELECT 
          n.*,
          CASE 
            WHEN n.proposal_id IS NOT NULL AND p.id IS NOT NULL THEN p.judul_proposal
            WHEN n.letter_id IS NOT NULL AND l.id IS NOT NULL THEN l.perihal
            ELSE 'Tidak ada subjek'
          END as subject_title
        FROM notifications n
        LEFT JOIN proposals p ON n.proposal_id = p.id
        LEFT JOIN letters l ON n.letter_id = l.id
        WHERE 1=1 ${jenisFilter}
        ORDER BY n.created_at DESC
        LIMIT ? OFFSET ?
      `;

      const queryParams = [...jenisParams, parseInt(limit), offset];
      const [notifications] = await db.execute(query, queryParams);

      const countQuery = `
        SELECT COUNT(*) as total 
        FROM notifications n
        WHERE 1=1 ${jenisFilter}
      `;

      const [countResult] = await db.execute(countQuery, jenisParams);

      res.json({
        success: true,
        data: {
          notifications,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: countResult[0].total,
            totalPages: Math.ceil(countResult[0].total / parseInt(limit)),
            offset
          }
        }
      });

    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil notifikasi',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
};

module.exports = executiveController;