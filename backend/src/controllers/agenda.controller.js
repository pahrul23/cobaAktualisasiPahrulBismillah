const db = require("../config/database");

const agendaController = {
  // Get all agenda - ENHANCED with better JOIN
  async getAllAgenda(req, res) {
    try {
      const { date, month, year } = req.query;
      
      console.log("=== ENHANCED AGENDA DEBUG ===");
      console.log("Query params:", { date, month, year });

      let whereConditions = [];
      let queryParams = [];

      // Filter berdasarkan tanggal jika ada
      if (date) {
        whereConditions.push("(DATE(a.tanggal_agenda) = ? OR DATE(a.tanggal_konfirmasi) = ?)");
        queryParams.push(date, date);
        console.log("Filtering by date:", date);
      }

      const whereClause = whereConditions.length > 0 
        ? "WHERE " + whereConditions.join(" AND ") 
        : "";

      // IMPROVED Query dengan proper time formatting
      const query = `
        SELECT 
          a.*,
          l.no_surat as letter_no_surat,
          l.perihal as letter_perihal,
          l.asal_surat,
          l.jenis as letter_jenis,
          l.uraian,
          -- Format time properly (HH:MM only)
          CASE 
            WHEN lu.pukul IS NOT NULL THEN TIME_FORMAT(lu.pukul, '%H:%i')
            ELSE NULL
          END as formatted_undangan_pukul,
          CASE 
            WHEN la.pukul IS NOT NULL THEN TIME_FORMAT(la.pukul, '%H:%i')
            ELSE NULL
          END as formatted_audiensi_pukul,
          -- Undangan details
          lu.hari_tanggal_acara as undangan_tanggal_acara,
          lu.pukul as undangan_pukul_raw,
          COALESCE(lu.tempat, 'Tempat akan ditentukan') as undangan_tempat,
          lu.jenis_acara,
          lu.dress_code,
          lu.rsvp_required,
          lu.dokumentasi as undangan_dokumentasi,
          -- Audiensi details  
          la.hari_tanggal as audiensi_tanggal,
          la.pukul as audiensi_pukul_raw,
          COALESCE(la.tempat, 'Tempat akan ditentukan') as audiensi_tempat,
          la.nama_pemohon,
          la.instansi_organisasi,
          la.jumlah_peserta,
          la.topik_audiensi,
          la.dokumentasi as audiensi_dokumentasi
        FROM agenda a
        LEFT JOIN letters l ON a.letter_id = l.id
        LEFT JOIN letter_undangan lu ON l.id = lu.letter_id AND l.jenis = 'undangan'
        LEFT JOIN letter_audiensi la ON l.id = la.letter_id AND l.jenis = 'audiensi'
        ${whereClause}
        ORDER BY 
          COALESCE(a.tanggal_agenda, a.tanggal_konfirmasi) DESC,
          a.created_at DESC
      `;

      console.log("Executing query:", query);
      const [agenda] = await db.execute(query, queryParams);

      console.log("Found agenda items:", agenda.length);
      
      // Process agenda items for better display - FIXED to send proper field names
      const processedAgenda = agenda.map(item => {
        // Use formatted time if available, otherwise fallback to raw time
        const displayTime = item.letter_jenis === 'undangan' 
          ? (item.formatted_undangan_pukul || (item.undangan_pukul_raw ? item.undangan_pukul_raw.slice(0, 5) : null))
          : (item.formatted_audiensi_pukul || (item.audiensi_pukul_raw ? item.audiensi_pukul_raw.slice(0, 5) : null));

        console.log(`Processing agenda ${item.id}:`, {
          letter_jenis: item.letter_jenis,
          formatted_undangan_pukul: item.formatted_undangan_pukul,
          formatted_audiensi_pukul: item.formatted_audiensi_pukul,
          final_display_time: displayTime
        });

        // FIXED: Create letter_details object that frontend expects
        const letterDetails = {
          // Add time fields that frontend looks for
          undangan_pukul: item.formatted_undangan_pukul,
          audiensi_pukul: item.formatted_audiensi_pukul,
          pukul: displayTime, // Generic pukul field
          display_time: displayTime,
          
          // Add other details
          undangan_tempat: item.undangan_tempat,
          audiensi_tempat: item.audiensi_tempat,
          tempat: item.letter_jenis === 'undangan' ? item.undangan_tempat : item.audiensi_tempat,
          
          // Undangan specific
          jenis_acara: item.jenis_acara,
          dress_code: item.dress_code,
          rsvp_required: item.rsvp_required,
          undangan_dokumentasi: item.undangan_dokumentasi,
          
          // Audiensi specific
          nama_pemohon: item.nama_pemohon,
          instansi_organisasi: item.instansi_organisasi,
          jumlah_peserta: item.jumlah_peserta,
          topik_audiensi: item.topik_audiensi,
          audiensi_dokumentasi: item.audiensi_dokumentasi,
          
          // Common
          perihal: item.letter_perihal
        };

        return {
          ...item,
          display_time: displayTime,
          display_tempat: item.letter_jenis === 'undangan' ? item.undangan_tempat : item.audiensi_tempat,
          letter_details: JSON.stringify(letterDetails), // Send as JSON string like frontend expects
          jenis_surat: item.letter_jenis // Make sure this field is available
        };
      });

      console.log("Processed agenda sample:", processedAgenda[0]);

      res.json({
        success: true,
        data: {
          agenda: processedAgenda,
          total: processedAgenda.length,
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

  // Get single agenda by ID - IMPROVED
  async getAgendaById(req, res) {
    try {
      const { id } = req.params;

      console.log("=== GET AGENDA BY ID DEBUG ===");
      console.log("Requested agenda ID:", id);

      const query = `
        SELECT 
          a.*,
          l.no_surat as letter_no_surat,
          l.perihal as letter_perihal,
          l.asal_surat,
          l.jenis as letter_jenis,
          l.uraian,
          -- Format time properly (HH:MM only)
          CASE 
            WHEN lu.pukul IS NOT NULL THEN TIME_FORMAT(lu.pukul, '%H:%i')
            ELSE NULL
          END as formatted_undangan_pukul,
          CASE 
            WHEN la.pukul IS NOT NULL THEN TIME_FORMAT(la.pukul, '%H:%i')
            ELSE NULL
          END as formatted_audiensi_pukul,
          -- Undangan fields (explicit with fallbacks)
          lu.hari_tanggal_acara as undangan_tanggal_acara,
          lu.pukul as undangan_pukul,
          COALESCE(lu.tempat, 'Tempat akan ditentukan') as undangan_tempat,
          lu.jenis_acara,
          lu.dress_code,
          lu.rsvp_required,
          lu.dokumentasi as undangan_dokumentasi,
          -- Audiensi fields (explicit with fallbacks)
          la.hari_tanggal as audiensi_tanggal,
          la.pukul as audiensi_pukul,
          COALESCE(la.tempat, 'Tempat akan ditentukan') as audiensi_tempat,
          la.nama_pemohon,
          la.instansi_organisasi,
          la.jumlah_peserta,
          la.topik_audiensi,
          la.dokumentasi as audiensi_dokumentasi
        FROM agenda a
        LEFT JOIN letters l ON a.letter_id = l.id
        LEFT JOIN letter_undangan lu ON l.id = lu.letter_id AND l.jenis = 'undangan'
        LEFT JOIN letter_audiensi la ON l.id = la.letter_id AND l.jenis = 'audiensi'
        WHERE a.id = ?
      `;

      const [agenda] = await db.execute(query, [id]);

      console.log("Raw query result:", agenda);

      if (agenda.length === 0) {
        console.log("No agenda found with ID:", id);
        return res.status(404).json({
          success: false,
          message: "Agenda tidak ditemukan",
        });
      }

      const agendaData = agenda[0];
      
      // Process the data for better display
      const processedData = {
        ...agendaData,
        // Use formatted time (HH:MM) for display
        undangan_pukul: agendaData.formatted_undangan_pukul || (agendaData.undangan_pukul ? agendaData.undangan_pukul.slice(0, 5) : null),
        audiensi_pukul: agendaData.formatted_audiensi_pukul || (agendaData.audiensi_pukul ? agendaData.audiensi_pukul.slice(0, 5) : null)
      };
      
      console.log("Processed agenda data to send:", processedData);

      res.json({
        success: true,
        data: processedData,
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

  // Update attendance status - UNCHANGED
  async updateAttendance(req, res) {
    try {
      const { id } = req.params;
      const { status_kehadiran, catatan_kehadiran } = req.body;

      console.log("Updating attendance for agenda:", id);
      console.log("New status:", status_kehadiran);

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

  // Create new agenda manually - IMPROVED
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
        tanggal,
        tanggal,
        pukul,
        tempat || 'Tempat akan ditentukan',
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
          tempat: tempat || 'Tempat akan ditentukan',
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

  // Update existing agenda - IMPROVED
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
        tanggal,
        tanggal,
        pukul,
        tempat || 'Tempat akan ditentukan',
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
          tempat: tempat || 'Tempat akan ditentukan',
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

  // Delete agenda - UNCHANGED
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

  // Get agenda statistics - UNCHANGED
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