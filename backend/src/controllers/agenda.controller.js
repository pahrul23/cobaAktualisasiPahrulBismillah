// agenda.controller.js - DEBUGGING VERSION with detailed logging
const db = require("../config/database");

const agendaController = {
  // Get all agenda - ENHANCED DEBUGGING
  async getAllAgenda(req, res) {
    try {
      const { date, month, year } = req.query;
      
      console.log("=== ENHANCED AGENDA DEBUG ===");
      console.log("Query params:", { date, month, year });
      console.log("Server timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);
      console.log("Server date:", new Date().toISOString());

      let whereConditions = [];
      let queryParams = [];

      // Filter berdasarkan tanggal jika ada - SUPPORT KEDUA KOLOM
      if (date) {
        // Cek kedua kolom tanggal untuk backward compatibility
        whereConditions.push("(DATE(a.tanggal_agenda) = ? OR DATE(a.tanggal_konfirmasi) = ?)");
        queryParams.push(date, date);
        console.log("Filtering by date:", date);
      }

      const whereClause = whereConditions.length > 0 
        ? "WHERE " + whereConditions.join(" AND ") 
        : "";

      // Query dengan JOIN ke tabel letters dan detail surat - INCLUDE BOTH DATE COLUMNS
      const query = `
        SELECT 
          a.*,
          -- Raw date debugging
          a.tanggal_agenda as raw_tanggal_agenda,
          a.tanggal_konfirmasi as raw_tanggal_konfirmasi,
          DATE(a.tanggal_agenda) as date_only_agenda,
          DATE(a.tanggal_konfirmasi) as date_only_konfirmasi,
          -- Letter info
          l.no_surat as letter_no_surat,
          l.perihal as letter_perihal,
          l.asal_surat,
          l.jenis as letter_jenis,
          l.uraian,
          -- Include letter details as JSON
          JSON_OBJECT(
            'perihal', l.perihal,
            'asal_surat', l.asal_surat,
            'uraian', l.uraian,
            -- Undangan details
            'undangan_pukul', lu.pukul,
            'undangan_tempat', lu.tempat,
            'jenis_acara', lu.jenis_acara,
            -- Audiensi details  
            'audiensi_pukul', la.pukul,
            'audiensi_tempat', la.tempat,
            'jumlah_peserta', la.jumlah_peserta,
            'topik_audiensi', la.topik_audiensi,
            'nama_pemohon', la.nama_pemohon
          ) as letter_details
        FROM agenda a
        LEFT JOIN letters l ON a.letter_id = l.id
        LEFT JOIN letter_undangan lu ON l.id = lu.letter_id
        LEFT JOIN letter_audiensi la ON l.id = la.letter_id
        ${whereClause}
        ORDER BY 
          COALESCE(a.tanggal_agenda, a.tanggal_konfirmasi) DESC,
          a.created_at DESC
      `;

      console.log("Executing query:", query);
      console.log("With params:", queryParams);

      const [agenda] = await db.execute(query, queryParams);

      console.log("Found agenda items:", agenda.length);
      
      // Enhanced debugging: log each agenda item with detailed date info
      agenda.forEach((item, index) => {
        console.log(`=== AGENDA ITEM ${index + 1} ===`);
        console.log(`ID: ${item.id}`);
        console.log(`Raw tanggal_agenda:`, item.raw_tanggal_agenda);
        console.log(`Raw tanggal_konfirmasi:`, item.raw_tanggal_konfirmasi);
        console.log(`Date only agenda:`, item.date_only_agenda);
        console.log(`Date only konfirmasi:`, item.date_only_konfirmasi);
        console.log(`Jenis surat:`, item.jenis_surat);
        console.log(`Catatan:`, item.catatan_kehadiran);
        
        // Show which date would be used for filtering
        const effectiveDate = item.date_only_agenda || item.date_only_konfirmasi;
        console.log(`Effective date for filtering:`, effectiveDate);
        
        if (date) {
          console.log(`Date match (${effectiveDate} === ${date}):`, effectiveDate === date);
        }
        console.log("================================");
      });

      res.json({
        success: true,
        data: {
          agenda,
          total: agenda.length,
          debug: {
            server_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            server_date: new Date().toISOString(),
            filter_date: date,
            query_executed: query,
            params_used: queryParams
          }
        },
      });
    } catch (error) {
      console.error("Error fetching agenda:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data agenda",
        error: error.message,
      });
    }
  },

  // Get single agenda by ID
  async getAgendaById(req, res) {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          a.*,
          l.no_surat as letter_no_surat,
          l.perihal as letter_perihal,
          l.asal_surat,
          l.jenis as letter_jenis,
          l.uraian,
          -- Include letter details
          JSON_OBJECT(
            'perihal', l.perihal,
            'asal_surat', l.asal_surat,
            'uraian', l.uraian,
            'undangan_pukul', lu.pukul,
            'undangan_tempat', lu.tempat,
            'jenis_acara', lu.jenis_acara,
            'audiensi_pukul', la.pukul,
            'audiensi_tempat', la.tempat,
            'jumlah_peserta', la.jumlah_peserta,
            'topik_audiensi', la.topik_audiensi,
            'nama_pemohon', la.nama_pemohon
          ) as letter_details
        FROM agenda a
        LEFT JOIN letters l ON a.letter_id = l.id
        LEFT JOIN letter_undangan lu ON l.id = lu.letter_id
        LEFT JOIN letter_audiensi la ON l.id = la.letter_id
        WHERE a.id = ?
      `;

      const [agenda] = await db.execute(query, [id]);

      if (agenda.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Agenda tidak ditemukan",
        });
      }

      res.json({
        success: true,
        data: agenda[0],
      });
    } catch (error) {
      console.error("Error fetching agenda:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data agenda",
        error: error.message,
      });
    }
  },

  // Update attendance status - SUPPORT BOTH DATE COLUMNS
  async updateAttendance(req, res) {
    try {
      const { id } = req.params;
      const { status_kehadiran, catatan_kehadiran } = req.body;

      console.log("Updating attendance for agenda:", id);
      console.log("New status:", status_kehadiran);

      // Update dengan support untuk kedua kolom tanggal
      const query = `
        UPDATE agenda 
        SET status_kehadiran = ?, 
            catatan_kehadiran = ?, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const [result] = await db.execute(query, [
        status_kehadiran,
        catatan_kehadiran,
        id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Agenda tidak ditemukan",
        });
      }

      console.log("Attendance updated successfully");

      res.json({
        success: true,
        message: "Status kehadiran berhasil diupdate",
        data: {
          id,
          status_kehadiran,
          catatan_kehadiran,
        },
      });
    } catch (error) {
      console.error("Error updating attendance:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengupdate status kehadiran",
        error: error.message,
      });
    }
  },

  // Create new agenda manually
  async createAgenda(req, res) {
    try {
      const {
        letter_id,
        judul,
        tanggal,
        pukul,
        tempat,
        deskripsi,
        jenis_agenda = "rapat",
        peserta,
        status_agenda = "terjadwal",
        status_kehadiran = "belum_konfirmasi",
        catatan_kehadiran,
        created_by = 1,
      } = req.body;

      // Insert dengan support untuk kedua kolom tanggal
      const query = `
        INSERT INTO agenda (
          letter_id, judul, tanggal, tanggal_agenda, tanggal_konfirmasi, pukul, tempat, 
          deskripsi, jenis_agenda, peserta, status_agenda, status_kehadiran, 
          catatan_kehadiran, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.execute(query, [
        letter_id,
        judul,
        tanggal,
        tanggal, // tanggal_agenda (kolom baru)
        tanggal, // tanggal_konfirmasi (kolom lama, backward compatibility)
        pukul,
        tempat,
        deskripsi,
        jenis_agenda,
        peserta,
        status_agenda,
        status_kehadiran,
        catatan_kehadiran,
        created_by,
      ]);

      res.status(201).json({
        success: true,
        message: "Agenda berhasil dibuat",
        data: {
          id: result.insertId,
          judul,
          tanggal,
          pukul,
          tempat,
        },
      });
    } catch (error) {
      console.error("Error creating agenda:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat membuat agenda",
        error: error.message,
      });
    }
  },

  // Update existing agenda
  async updateAgenda(req, res) {
    try {
      const { id } = req.params;
      const {
        judul,
        tanggal,
        pukul,
        tempat,
        deskripsi,
        jenis_agenda,
        peserta,
        status_agenda,
        status_kehadiran,
        catatan_kehadiran,
      } = req.body;

      // Update dengan support untuk kedua kolom tanggal
      const query = `
        UPDATE agenda 
        SET judul = ?, tanggal = ?, tanggal_agenda = ?, tanggal_konfirmasi = ?, 
            pukul = ?, tempat = ?, deskripsi = ?, jenis_agenda = ?, 
            peserta = ?, status_agenda = ?, status_kehadiran = ?, 
            catatan_kehadiran = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const [result] = await db.execute(query, [
        judul,
        tanggal,
        tanggal, // tanggal_agenda
        tanggal, // tanggal_konfirmasi
        pukul,
        tempat,
        deskripsi,
        jenis_agenda,
        peserta,
        status_agenda,
        status_kehadiran,
        catatan_kehadiran,
        id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Agenda tidak ditemukan",
        });
      }

      res.json({
        success: true,
        message: "Agenda berhasil diupdate",
        data: {
          id,
          judul,
          tanggal,
          pukul,
          tempat,
        },
      });
    } catch (error) {
      console.error("Error updating agenda:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengupdate agenda",
        error: error.message,
      });
    }
  },

  // Delete agenda
  async deleteAgenda(req, res) {
    try {
      const { id } = req.params;

      const [result] = await db.execute("DELETE FROM agenda WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Agenda tidak ditemukan",
        });
      }

      res.json({
        success: true,
        message: "Agenda berhasil dihapus",
      });
    } catch (error) {
      console.error("Error deleting agenda:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat menghapus agenda",
        error: error.message,
      });
    }
  },

  // Get agenda statistics
  async getAgendaStats(req, res) {
    try {
      const queries = await Promise.all([
        db.execute("SELECT COUNT(*) as total FROM agenda"),
        db.execute(
          'SELECT COUNT(*) as count FROM agenda WHERE status_kehadiran = "hadir"'
        ),
        db.execute(
          'SELECT COUNT(*) as count FROM agenda WHERE status_kehadiran = "tidak_hadir"'
        ),
        db.execute(
          'SELECT COUNT(*) as count FROM agenda WHERE status_kehadiran = "belum_konfirmasi"'
        ),
        db.execute(`
          SELECT jenis_surat, COUNT(*) as count 
          FROM agenda 
          WHERE jenis_surat IS NOT NULL
          GROUP BY jenis_surat
        `),
      ]);

      const [
        [totalResult],
        [hadirResult],
        [tidakHadirResult],
        [pendingResult],
        jenisResult,
      ] = queries;

      res.json({
        success: true,
        data: {
          total: totalResult[0].total,
          hadir: hadirResult[0].count,
          tidak_hadir: tidakHadirResult[0].count,
          belum_konfirmasi: pendingResult[0].count,
          byType: jenisResult[0],
        },
      });
    } catch (error) {
      console.error("Error fetching agenda stats:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil statistik agenda",
      });
    }
  },
};

module.exports = agendaController;