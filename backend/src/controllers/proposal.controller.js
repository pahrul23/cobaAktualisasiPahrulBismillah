const db = require("../config/database");

const proposalController = {
  // Get all proposals with filtering and pagination
  async getAllProposals(req, res) {
    try {
      const { page = 1, limit = 20, status, jenis_kegiatan, q } = req.query;

      let whereConditions = [];
      let queryParams = [];

      // Filter by status
      if (status && status !== "all") {
        whereConditions.push("p.status = ?");
        queryParams.push(status);
      }

      // Filter by jenis kegiatan
      if (jenis_kegiatan && jenis_kegiatan !== "all") {
        whereConditions.push("p.jenis_kegiatan = ?");
        queryParams.push(jenis_kegiatan);
      }

      // Search by judul, nama pengirim, atau instansi
      if (q) {
        whereConditions.push(
          "(p.judul_proposal LIKE ? OR p.nama_pengirim LIKE ? OR p.instansi LIKE ? OR p.instansi_lembaga_komunitas LIKE ?)"
        );
        queryParams.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
      }

      const whereClause =
        whereConditions.length > 0
          ? "WHERE " + whereConditions.join(" AND ")
          : "";

      // Count total records
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM proposals p 
        LEFT JOIN letters l ON p.letter_id = l.id 
        ${whereClause}
      `;
      const [countResult] = await db.execute(countQuery, queryParams);
      const totalRecords = countResult[0].total;

      const offset = (page - 1) * limit;
      const totalPages = Math.ceil(totalRecords / limit);

      // Main query with all proposal fields
      const query = `
        SELECT 
          p.*,
          l.no_surat,
          l.asal_surat,
          l.perihal,
          l.tanggal_terima,
          l.tanggal_surat,
          l.uraian,
          l.created_at as letter_created_at,
          u.name as created_by_name
        FROM proposals p
        LEFT JOIN letters l ON p.letter_id = l.id
        LEFT JOIN users u ON l.created_by = u.id
        ${whereClause}
        ORDER BY l.created_at DESC
        LIMIT ? OFFSET ?
      `;

      queryParams.push(parseInt(limit), parseInt(offset));
      const [proposals] = await db.execute(query, queryParams);

      res.json({
        success: true,
        data: {
          proposals,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalRecords,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data proposal",
        error: error.message,
      });
    }
  },

  // Get single proposal by ID with full details
  async getProposalById(req, res) {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          p.*,
          l.no_surat,
          l.asal_surat,
          l.perihal,
          l.tanggal_terima,
          l.tanggal_surat,
          l.uraian,
          l.keterangan,
          l.label,
          l.status as letter_status,
          l.file_surat,
          l.file_surat_name,
          l.file_surat_size,
          l.created_at as letter_created_at,
          u.name as created_by_name,
          u.email as created_by_email
        FROM proposals p
        LEFT JOIN letters l ON p.letter_id = l.id
        LEFT JOIN users u ON l.created_by = u.id
        WHERE p.id = ?
      `;

      const [proposals] = await db.execute(query, [id]);

      if (proposals.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Proposal tidak ditemukan",
        });
      }

      res.json({
        success: true,
        data: proposals[0],
      });
    } catch (error) {
      console.error("Error fetching proposal:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data proposal",
        error: error.message,
      });
    }
  },

  // Update proposal status and details
  async updateProposal(req, res) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const {
        status,
        rekomendasi_dukungan,
        pic_penanganan,
        catatan_tindak_lanjut,
        nomor_rekening,
        jumlah_dibantu,
        ...otherFields
      } = req.body;

      // Update proposal table
      const updateFields = [];
      const updateValues = [];

      // Fields that can be updated
      const allowedFields = [
        'nama_pengirim', 'instansi', 'instansi_lembaga_komunitas',
        'judul_proposal', 'jenis_kegiatan', 'tanggal_kegiatan',
        'lokasi_kegiatan', 'ringkasan', 'total_anggaran',
        'status', 'rekomendasi_dukungan', 'pic_penanganan',
        'catatan_tindak_lanjut', 'nomor_rekening', 'jumlah_dibantu'
      ];

      // Build dynamic update query
      allowedFields.forEach(field => {
        if (req.body.hasOwnProperty(field)) {
          updateFields.push(`${field} = ?`);
          updateValues.push(req.body[field]);
        }
      });

      if (updateFields.length > 0) {
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);

        const updateQuery = `
          UPDATE proposals 
          SET ${updateFields.join(', ')}
          WHERE id = ?
        `;

        await connection.execute(updateQuery, updateValues);
      }

      // Log status change if status is updated
      if (status) {
        const logQuery = `
          INSERT INTO proposal_status_log (proposal_id, status, changed_by, notes, created_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        await connection.execute(logQuery, [
          id,
          status,
          1, // TODO: Get from authenticated user
          catatan_tindak_lanjut || `Status changed to ${status}`,
        ]);
      }

      await connection.commit();

      res.json({
        success: true,
        message: "Proposal berhasil diupdate",
        data: { id, status },
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error updating proposal:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengupdate proposal",
        error: error.message,
      });
    } finally {
      connection.release();
    }
  },

  // Get proposal statistics for dashboard
  async getProposalStats(req, res) {
    try {
      const queries = await Promise.all([
        // Total proposals
        db.execute("SELECT COUNT(*) as total FROM proposals"),
        
        // Count by status
        db.execute(`
          SELECT status, COUNT(*) as count 
          FROM proposals 
          GROUP BY status
        `),
        
        // Total amount by status
        db.execute(`
          SELECT status, SUM(total_anggaran) as total_amount, COUNT(*) as count
          FROM proposals 
          GROUP BY status
        `),
        
        // Recent proposals (last 30 days)
        db.execute(`
          SELECT COUNT(*) as count 
          FROM proposals p
          LEFT JOIN letters l ON p.letter_id = l.id
          WHERE l.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
        `),
        
        // Monthly trend
        db.execute(`
          SELECT 
            DATE_FORMAT(l.created_at, '%Y-%m') as month,
            COUNT(*) as count,
            SUM(p.total_anggaran) as total_amount
          FROM proposals p
          LEFT JOIN letters l ON p.letter_id = l.id
          WHERE l.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
          GROUP BY DATE_FORMAT(l.created_at, '%Y-%m')
          ORDER BY month DESC
        `),
        
        // Top jenis kegiatan
        db.execute(`
          SELECT jenis_kegiatan, COUNT(*) as count, SUM(total_anggaran) as total_amount
          FROM proposals 
          WHERE jenis_kegiatan IS NOT NULL
          GROUP BY jenis_kegiatan
          ORDER BY count DESC
          LIMIT 10
        `)
      ]);

      const [
        [totalResult],
        statusResult,
        amountByStatusResult,
        [recentResult],
        trendResult,
        topJenisResult,
      ] = queries;

      // Process status counts
      const statusCounts = {
        pending: 0,
        diproses: 0,
        verifikasi: 0,
        ditolak: 0,
        selesai: 0,
        ditindaklanjuti: 0
      };

      statusResult[0].forEach(item => {
        statusCounts[item.status] = item.count;
      });

      // Process amounts by status
      const amountByStatus = {};
      amountByStatusResult[0].forEach(item => {
        amountByStatus[item.status] = {
          count: item.count,
          total_amount: parseFloat(item.total_amount || 0)
        };
      });

      res.json({
        success: true,
        data: {
          total: totalResult[0].total,
          recent: recentResult[0].count,
          statusCounts,
          amountByStatus,
          monthlyTrend: trendResult[0],
          topJenisKegiatan: topJenisResult[0],
        },
      });
    } catch (error) {
      console.error("Error fetching proposal stats:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil statistik proposal",
        error: error.message,
      });
    }
  },

  // Get proposal status history
  async getProposalStatusHistory(req, res) {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          psl.*,
          u.name as changed_by_name
        FROM proposal_status_log psl
        LEFT JOIN users u ON psl.changed_by = u.id
        WHERE psl.proposal_id = ?
        ORDER BY psl.created_at DESC
      `;

      const [history] = await db.execute(query, [id]);

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      console.error("Error fetching proposal history:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil riwayat proposal",
        error: error.message,
      });
    }
  },

  // Delete proposal
  async deleteProposal(req, res) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const { id } = req.params;

      // Get letter_id first
      const [proposal] = await connection.execute(
        "SELECT letter_id FROM proposals WHERE id = ?",
        [id]
      );

      if (proposal.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: "Proposal tidak ditemukan",
        });
      }

      const letterId = proposal[0].letter_id;

      // Delete proposal (this will cascade delete from proposal_status_log)
      await connection.execute("DELETE FROM proposals WHERE id = ?", [id]);

      // Delete associated letter
      await connection.execute("DELETE FROM letters WHERE id = ?", [letterId]);

      await connection.commit();
const db = require("../config/database");

const proposalController = {
  // Get all proposals with filtering and pagination
  async getAllProposals(req, res) {
    try {
      const { page = 1, limit = 20, status, q } = req.query;

      let whereConditions = [];
      let queryParams = [];

      // Filter by status
      if (status && status !== "all") {
        whereConditions.push("p.status = ?");
        queryParams.push(status);
      }

      // Search by judul, nama pengirim, atau instansi
      if (q) {
        whereConditions.push(
          "(p.judul_proposal LIKE ? OR p.nama_pengirim LIKE ? OR p.instansi LIKE ?)"
        );
        queryParams.push(`%${q}%`, `%${q}%`, `%${q}%`);
      }

      const whereClause = whereConditions.length > 0 
        ? "WHERE " + whereConditions.join(" AND ") 
        : "";

      // Count total records
      const countQuery = `SELECT COUNT(*) as total FROM proposals p ${whereClause}`;
      const [countResult] = await db.execute(countQuery, queryParams);
      const totalRecords = countResult[0].total;

      const offset = (page - 1) * limit;
      const totalPages = Math.ceil(totalRecords / limit);

      // Main query
      const query = `
        SELECT 
          p.*,
          l.no_surat,
          l.asal_surat,
          l.perihal,
          l.created_at as letter_created_at
        FROM proposals p
        LEFT JOIN letters l ON p.letter_id = l.id
        ${whereClause}
        ORDER BY l.created_at DESC
        LIMIT ? OFFSET ?
      `;

      queryParams.push(parseInt(limit), parseInt(offset));
      const [proposals] = await db.execute(query, queryParams);

      res.json({
        success: true,
        data: {
          proposals,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalRecords,
            totalPages,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data proposal",
        error: error.message,
      });
    }
  },

  // Get proposal statistics
  async getProposalStats(req, res) {
    try {
      const queries = await Promise.all([
        db.execute("SELECT COUNT(*) as total FROM proposals"),
        db.execute(`
          SELECT status, COUNT(*) as count 
          FROM proposals 
          GROUP BY status
        `),
      ]);

      const [[totalResult], statusResult] = queries;

      const statusCounts = {
        pending: 0,
        diproses: 0,
        verifikasi: 0,
        ditolak: 0,
        selesai: 0,
        ditindaklanjuti: 0
      };

      statusResult[0].forEach(item => {
        statusCounts[item.status] = item.count;
      });

      res.json({
        success: true,
        data: {
          total: totalResult[0].total,
          statusCounts,
        },
      });
    } catch (error) {
      console.error("Error fetching proposal stats:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil statistik proposal",
        error: error.message,
      });
    }
  },
};

module.exports = proposalController;
      res.json({
        success: true,
        message: "Proposal berhasil dihapus",
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error deleting proposal:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat menghapus proposal",
        error: error.message,
      });
    } finally {
      connection.release();
    }
  },
};

module.exports = proposalController;