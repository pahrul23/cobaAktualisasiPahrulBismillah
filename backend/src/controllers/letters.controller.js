const db = require("../config/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const agendaController = require("./agenda.controller");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/letters";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error("Only .jpeg, .jpg, .png, .pdf, .doc, .docx files are allowed")
      );
    }
  },
});

const lettersController = {
  // Middleware untuk upload file
  uploadFile: upload.single("file_surat"),

  // Create new letter dengan field tambahan
  async createLetter(req, res) {
    console.log("=== DEBUG FILE UPLOAD - CREATE LETTER ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("========================================");

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const {
        jenis,
        no_disposisi,
        no_surat,
        asal_surat,
        perihal,
        tanggal_terima,
        tanggal_surat,
        uraian,
        keterangan = null,
        label = null,
        created_by = 1,
        ...additionalFields
      } = req.body;

      console.log("Parsed fields:", {
        jenis,
        no_disposisi,
        no_surat,
        asal_surat,
        perihal,
        tanggal_terima,
        tanggal_surat,
        uraian,
        keterangan,
        label,
        created_by,
      });

      // Validate required fields
      if (!jenis || !no_surat || !asal_surat || !perihal || !uraian) {
        console.log("Validation failed - missing required fields");
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "Field wajib tidak lengkap",
        });
      }

      // Handle file upload - VALIDASI WAJIB
      let filePath = null;
      let fileName = null;
      let fileSize = null;

      if (req.file) {
        filePath = req.file.path;
        fileName = req.file.originalname;
        fileSize = req.file.size;
        console.log("File uploaded:", { filePath, fileName, fileSize });
      } else {
        console.log("No file uploaded - CREATE requires file");
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "File surat wajib diupload",
        });
      }

      // Insert main letter record
      const letterQuery = `
        INSERT INTO letters (
          jenis, no_disposisi, no_surat, asal_surat, perihal,
          tanggal_terima, tanggal_surat, uraian, keterangan, label,
          file_surat, file_surat_name, file_surat_size, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [letterResult] = await connection.execute(letterQuery, [
        jenis,
        no_disposisi,
        no_surat,
        asal_surat,
        perihal,
        tanggal_terima,
        tanggal_surat,
        uraian,
        keterangan,
        label || "hitam",
        filePath,
        fileName,
        fileSize,
        created_by,
      ]);

      const letterId = letterResult.insertId;
      console.log("Letter created with ID:", letterId);

      // Insert additional fields based on jenis surat
      await lettersController.insertAdditionalFields(
        connection,
        letterId,
        jenis,
        additionalFields,
        req.body
      );

      await connection.commit();
      console.log("Transaction committed successfully");

      res.status(201).json({
        success: true,
        message: "Surat berhasil dibuat",
        data: {
          id: letterId,
          jenis,
          no_surat,
          no_disposisi,
          file_info: req.file
            ? {
                original_name: fileName,
                file_path: filePath,
                file_size: fileSize,
              }
            : null,
        },
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error creating letter:", error);

      if (req.file) {
        fs.unlink(req.file.path, (unlinkError) => {
          if (unlinkError) console.error("Error deleting file:", unlinkError);
        });
      }

      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat membuat surat",
        error: error.message,
      });
    } finally {
      connection.release();
    }
  },

  // Insert additional fields - BACKWARD COMPATIBLE
  async insertAdditionalFields(
    connection,
    letterId,
    jenis,
    fields,
    reqBody = {}
  ) {
    console.log(
      "Inserting additional fields for jenis:",
      jenis,
      "fields:",
      fields
    );

    switch (jenis) {
      case "pengaduan":
        if (fields.jenis_pengaduan || fields.tingkat_urgensi) {
          const query = `
            INSERT INTO letter_pengaduan (letter_id, jenis_pengaduan, tingkat_urgensi)
            VALUES (?, ?, ?)
          `;
          await connection.execute(query, [
            letterId,
            fields.jenis_pengaduan || null,
            fields.tingkat_urgensi || null,
          ]);
          console.log("Pengaduan fields inserted");
        }
        break;

      case "undangan":
        const undanganQuery = `
          INSERT INTO letter_undangan (
            letter_id, hari_tanggal_acara, pukul, tempat, jenis_acara,
            dress_code, rsvp_required, dokumentasi
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(undanganQuery, [
          letterId,
          fields.hari_tanggal_acara || null,
          fields.pukul || null,
          fields.tempat || null,
          fields.jenis_acara || null,
          fields.dress_code || null,
          fields.rsvp_required || null,
          fields.dokumentasi || null,
        ]);
        console.log("Undangan fields inserted");

        // AUTO-INSERT AGENDA - BACKWARD COMPATIBLE (kedua kolom)
        try {
          const agendaQuery = `
            INSERT INTO agenda (
              letter_id, jenis_surat, status_kehadiran, catatan_kehadiran,
              tanggal_agenda, tanggal_konfirmasi, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `;

          const tanggalAgenda =
            fields.hari_tanggal_acara || new Date().toISOString().split("T")[0];

          console.log("DEBUG - tanggalAgenda akan disimpan:", tanggalAgenda);

          const perihal = reqBody.perihal || "Undangan";
          const catatanKehadiran = `Undangan: ${perihal}. Acara: ${
            fields.jenis_acara || ""
          }. Tempat: ${fields.tempat || "TBD"}`;

          await connection.execute(agendaQuery, [
            letterId,
            "undangan",
            "belum_konfirmasi",
            catatanKehadiran,
            tanggalAgenda, // kolom baru
            tanggalAgenda, // kolom lama untuk backward compatibility
            1,
          ]);

          console.log(
            `Auto-inserted agenda for undangan letter ID: ${letterId} pada tanggal: ${tanggalAgenda}`
          );
        } catch (agendaError) {
          console.error(
            `Failed to auto-insert agenda for undangan:`,
            agendaError
          );
        }
        break;

      // HAPUS BAGIAN INI - DUPLIKAT
      // AUTO-INSERT AGENDA - BACKWARD COMPATIBLE (kedua kolom)
      case "audiensi":
        const audiensiQuery = `
    INSERT INTO letter_audiensi (
      letter_id, hari_tanggal, pukul, tempat, nama_pemohon,
      instansi_organisasi, jumlah_peserta, topik_audiensi, dokumentasi
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
        await connection.execute(audiensiQuery, [
          letterId,
          fields.hari_tanggal || null,
          fields.pukul || null,
          fields.tempat || null,
          fields.nama_pemohon || null,
          fields.instansi_organisasi || null,
          fields.jumlah_peserta || null,
          fields.topik_audiensi || null,
          fields.dokumentasi || null,
        ]);
        console.log("Audiensi fields inserted");
        // TIDAK ada auto-insert agenda
        break;

      case "proposal":
        const proposalQuery = `
          INSERT INTO proposals (
            letter_id, nama_pengirim, instansi, instansi_lembaga_komunitas,
            judul_proposal, jenis_kegiatan, tanggal_kegiatan, lokasi_kegiatan,
            ringkasan, total_anggaran, rekomendasi_dukungan, pic_penanganan,
            nomor_rekening, catatan_tindak_lanjut
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(proposalQuery, [
          letterId,
          fields.nama_pengirim || null,
          fields.instansi || null,
          fields.instansi_lembaga_komunitas || null,
          fields.judul_proposal || null,
          fields.jenis_kegiatan || null,
          fields.tanggal_kegiatan || null,
          fields.lokasi_kegiatan || null,
          fields.ringkasan || null,
          fields.total_anggaran || null,
          fields.rekomendasi_dukungan || null,
          fields.pic_penanganan || null,
          fields.nomor_rekening || null,
          fields.catatan_tindak_lanjut || null,
        ]);
        console.log("Proposal fields inserted");
        break;

      case "pemberitahuan":
        const pemberitahuanQuery = `
          INSERT INTO letter_pemberitahuan (
            letter_id, kategori_pemberitahuan, tingkat_prioritas,
            batas_waktu_respon, follow_up_required
          ) VALUES (?, ?, ?, ?, ?)
        `;
        await connection.execute(pemberitahuanQuery, [
          letterId,
          fields.kategori_pemberitahuan || null,
          fields.tingkat_prioritas || null,
          fields.batas_waktu_respon || null,
          fields.follow_up_required || null,
        ]);
        console.log("Pemberitahuan fields inserted");
        break;
    }
  },

  // Get all letters dengan field tambahan
  async getAllLetters(req, res) {
    try {
      const { page = 1, limit = 20, jenis, status, label, q } = req.query;

      let whereConditions = [];
      let queryParams = [];

      if (jenis && jenis !== "all") {
        whereConditions.push("l.jenis = ?");
        queryParams.push(jenis);
      }

      if (status && status !== "all") {
        whereConditions.push("l.status = ?");
        queryParams.push(status);
      }

      if (label && label !== "all") {
        whereConditions.push("l.label = ?");
        queryParams.push(label);
      }

      if (q) {
        whereConditions.push(
          "(l.no_surat LIKE ? OR l.asal_surat LIKE ? OR l.perihal LIKE ?)"
        );
        queryParams.push(`%${q}%`, `%${q}%`, `%${q}%`);
      }

      const whereClause =
        whereConditions.length > 0
          ? "WHERE " + whereConditions.join(" AND ")
          : "";

      const countQuery = `
        SELECT COUNT(*) as total 
        FROM letters l 
        ${whereClause}
      `;
      const [countResult] = await db.execute(countQuery, queryParams);
      const totalRecords = countResult[0].total;

      const offset = (page - 1) * limit;
      const totalPages = Math.ceil(totalRecords / limit);

      const query = `
        SELECT 
          l.*,
          u.name as created_by_name,
          lp.jenis_pengaduan,
          lp.tingkat_urgensi,
          lu.hari_tanggal_acara as undangan_tanggal_acara,
          lu.pukul as undangan_pukul,
          lu.tempat as undangan_tempat,
          lu.jenis_acara,
          lu.dress_code,
          lu.rsvp_required,
          lu.dokumentasi as undangan_dokumentasi,
          la.hari_tanggal as audiensi_tanggal,
          la.pukul as audiensi_pukul,
          la.tempat as audiensi_tempat,
          la.nama_pemohon,
          la.instansi_organisasi,
          la.jumlah_peserta,
          la.topik_audiensi,
          la.dokumentasi as audiensi_dokumentasi,
          p.nama_pengirim,
          p.instansi_lembaga_komunitas,
          p.judul_proposal,
          p.jenis_kegiatan,
          p.tanggal_kegiatan,
          p.lokasi_kegiatan,
          p.ringkasan,
          p.total_anggaran,
          p.rekomendasi_dukungan,
          p.pic_penanganan,
          p.nomor_rekening,
          p.catatan_tindak_lanjut,
          lpb.kategori_pemberitahuan,
          lpb.tingkat_prioritas,
          lpb.batas_waktu_respon,
          lpb.follow_up_required
        FROM letters l
        LEFT JOIN users u ON l.created_by = u.id
        LEFT JOIN letter_pengaduan lp ON l.id = lp.letter_id
        LEFT JOIN letter_undangan lu ON l.id = lu.letter_id  
        LEFT JOIN letter_audiensi la ON l.id = la.letter_id
        LEFT JOIN proposals p ON l.id = p.letter_id
        LEFT JOIN letter_pemberitahuan lpb ON l.id = lpb.letter_id
        ${whereClause}
        ORDER BY l.created_at DESC
        LIMIT ? OFFSET ?
      `;

      queryParams.push(parseInt(limit), parseInt(offset));

      const [letters] = await db.execute(query, queryParams);

      res.json({
        success: true,
        data: {
          letters,
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
      console.error("Error fetching letters:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data surat",
        error: error.message,
      });
    }
  },

  // Get single letter dengan detail
  async getLetterById(req, res) {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          l.*,
          u.name as created_by_name,
          u.email as created_by_email,
          lp.jenis_pengaduan,
          lp.tingkat_urgensi,
          lu.hari_tanggal_acara as undangan_tanggal_acara,
          lu.pukul as undangan_pukul,
          lu.tempat as undangan_tempat,
          lu.jenis_acara,
          lu.dress_code,
          lu.rsvp_required,
          lu.dokumentasi as undangan_dokumentasi,
          la.hari_tanggal as audiensi_tanggal,
          la.pukul as audiensi_pukul,
          la.tempat as audiensi_tempat,
          la.nama_pemohon,
          la.instansi_organisasi,
          la.jumlah_peserta,
          la.topik_audiensi,
          la.dokumentasi as audiensi_dokumentasi,
          p.nama_pengirim,
          p.instansi_lembaga_komunitas,
          p.judul_proposal,
          p.jenis_kegiatan,
          p.tanggal_kegiatan,
          p.lokasi_kegiatan,
          p.ringkasan,
          p.total_anggaran,
          p.rekomendasi_dukungan,
          p.pic_penanganan,
          p.nomor_rekening,
          p.catatan_tindak_lanjut,
          lpb.kategori_pemberitahuan,
          lpb.tingkat_prioritas,
          lpb.batas_waktu_respon,
          lpb.follow_up_required
        FROM letters l
        LEFT JOIN users u ON l.created_by = u.id
        LEFT JOIN letter_pengaduan lp ON l.id = lp.letter_id
        LEFT JOIN letter_undangan lu ON l.id = lu.letter_id  
        LEFT JOIN letter_audiensi la ON l.id = la.letter_id
        LEFT JOIN proposals p ON l.id = p.letter_id
        LEFT JOIN letter_pemberitahuan lpb ON l.id = lpb.letter_id
        WHERE l.id = ?
      `;

      const [letters] = await db.execute(query, [id]);

      if (letters.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Surat tidak ditemukan",
        });
      }

      res.json({
        success: true,
        data: letters[0],
      });
    } catch (error) {
      console.error("Error fetching letter:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data surat",
        error: error.message,
      });
    }
  },

  // Update letter
  async updateLetter(req, res) {
    console.log("=== DEBUG UPDATE LETTER ===");
    console.log("req.params:", req.params);
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const {
        no_disposisi,
        no_surat,
        asal_surat,
        perihal,
        tanggal_terima,
        tanggal_surat,
        uraian,
        keterangan,
        label,
        status,
        ...additionalFields
      } = req.body;

      let shouldUpdateFile = false;
      let filePath = null;
      let fileName = null;
      let fileSize = null;

      if (req.file) {
        shouldUpdateFile = true;
        filePath = req.file.path;
        fileName = req.file.originalname;
        fileSize = req.file.size;
        console.log("New file uploaded for update:", {
          filePath,
          fileName,
          fileSize,
        });
      }

      let letterQuery = `
        UPDATE letters 
        SET no_disposisi = ?, no_surat = ?, asal_surat = ?, perihal = ?,
            tanggal_terima = ?, tanggal_surat = ?, uraian = ?, keterangan = ?,
            label = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      `;
      let queryParams = [
        no_disposisi,
        no_surat,
        asal_surat,
        perihal,
        tanggal_terima,
        tanggal_surat,
        uraian,
        keterangan,
        label,
        status,
      ];

      if (shouldUpdateFile) {
        letterQuery += `, file_surat = ?, file_surat_name = ?, file_surat_size = ?`;
        queryParams.push(filePath, fileName, fileSize);
      }

      letterQuery += ` WHERE id = ?`;
      queryParams.push(id);

      await connection.execute(letterQuery, queryParams);

      const [letterResult] = await connection.execute(
        "SELECT jenis FROM letters WHERE id = ?",
        [id]
      );

      if (letterResult.length > 0) {
        const jenis = letterResult[0].jenis;
        await lettersController.updateAdditionalFields(
          connection,
          id,
          jenis,
          additionalFields,
          req.body
        );
      }

      await connection.commit();
      console.log("Letter updated successfully");

      res.json({
        success: true,
        message: "Surat berhasil diupdate",
        data: {
          id,
          file_updated: req.file ? true : false,
        },
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error updating letter:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengupdate surat",
        error: error.message,
      });
    } finally {
      connection.release();
    }
  },

  // Update additional fields
  async updateAdditionalFields(
    connection,
    letterId,
    jenis,
    fields,
    reqBody = {}
  ) {
    console.log(
      "Updating additional fields for jenis:",
      jenis,
      "fields:",
      fields
    );

    switch (jenis) {
      case "pengaduan":
        await connection.execute(
          `UPDATE letter_pengaduan 
           SET jenis_pengaduan = ?, tingkat_urgensi = ?, updated_at = CURRENT_TIMESTAMP
           WHERE letter_id = ?`,
          [
            fields.jenis_pengaduan || null,
            fields.tingkat_urgensi || null,
            letterId,
          ]
        );
        break;

      case "undangan":
        await connection.execute(
          `UPDATE letter_undangan 
           SET hari_tanggal_acara = ?, pukul = ?, tempat = ?, jenis_acara = ?,
               dress_code = ?, rsvp_required = ?, dokumentasi = ?, updated_at = CURRENT_TIMESTAMP
           WHERE letter_id = ?`,
          [
            fields.hari_tanggal_acara || null,
            fields.pukul || null,
            fields.tempat || null,
            fields.jenis_acara || null,
            fields.dress_code || null,
            fields.rsvp_required || null,
            fields.dokumentasi || null,
            letterId,
          ]
        );
        break;

      case "audiensi":
        await connection.execute(
          `UPDATE letter_audiensi 
           SET hari_tanggal = ?, pukul = ?, tempat = ?, nama_pemohon = ?,
               instansi_organisasi = ?, jumlah_peserta = ?, topik_audiensi = ?, 
               dokumentasi = ?, updated_at = CURRENT_TIMESTAMP
           WHERE letter_id = ?`,
          [
            fields.hari_tanggal || null,
            fields.pukul || null,
            fields.tempat || null,
            fields.nama_pemohon || null,
            fields.instansi_organisasi || null,
            fields.jumlah_peserta || null,
            fields.topik_audiensi || null,
            fields.dokumentasi || null,
            letterId,
          ]
        );
        break;

      case "proposal":
        await connection.execute(
          `UPDATE proposals 
           SET nama_pengirim = ?, instansi_lembaga_komunitas = ?, judul_proposal = ?,
               jenis_kegiatan = ?, tanggal_kegiatan = ?, lokasi_kegiatan = ?,
               ringkasan = ?, total_anggaran = ?, rekomendasi_dukungan = ?,
               pic_penanganan = ?, nomor_rekening = ?, catatan_tindak_lanjut = ?, 
               updated_at = CURRENT_TIMESTAMP
           WHERE letter_id = ?`,
          [
            fields.nama_pengirim || null,
            fields.instansi_lembaga_komunitas || null,
            fields.judul_proposal || null,
            fields.jenis_kegiatan || null,
            fields.tanggal_kegiatan || null,
            fields.lokasi_kegiatan || null,
            fields.ringkasan || null,
            fields.total_anggaran || null,
            fields.rekomendasi_dukungan || null,
            fields.pic_penanganan || null,
            fields.nomor_rekening || null,
            fields.catatan_tindak_lanjut || null,
            letterId,
          ]
        );
        break;

      case "pemberitahuan":
        await connection.execute(
          `UPDATE letter_pemberitahuan 
           SET kategori_pemberitahuan = ?, tingkat_prioritas = ?, batas_waktu_respon = ?,
               follow_up_required = ?, updated_at = CURRENT_TIMESTAMP
           WHERE letter_id = ?`,
          [
            fields.kategori_pemberitahuan || null,
            fields.tingkat_prioritas || null,
            fields.batas_waktu_respon || null,
            fields.follow_up_required || null,
            letterId,
          ]
        );
        break;
    }
  },

  // Delete letter
  async deleteLetter(req, res) {
    try {
      const { id } = req.params;

      const [letter] = await db.execute(
        "SELECT file_surat FROM letters WHERE id = ?",
        [id]
      );

      const [result] = await db.execute("DELETE FROM letters WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Surat tidak ditemukan",
        });
      }

      // Delete file if exists
      if (letter.length > 0 && letter[0].file_surat) {
        fs.unlink(letter[0].file_surat, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }

      res.json({
        success: true,
        message: "Surat berhasil dihapus",
      });
    } catch (error) {
      console.error("Error deleting letter:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat menghapus surat",
        error: error.message,
      });
    }
  },

  // Get dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const queries = await Promise.all([
        db.execute("SELECT COUNT(*) as total FROM letters"),
        db.execute(
          'SELECT COUNT(*) as count FROM letters WHERE status = "baru"'
        ),
        db.execute(
          'SELECT COUNT(*) as count FROM letters WHERE status = "selesai"'
        ),
        db.execute(
          'SELECT COUNT(*) as count FROM letters WHERE status IN ("diproses", "verifikasi")'
        ),
        db.execute(`
          SELECT jenis, COUNT(*) as count 
          FROM letters 
          GROUP BY jenis
        `),
        db.execute(`
          SELECT DATE(created_at) as date, COUNT(*) as count 
          FROM letters 
          WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
          GROUP BY DATE(created_at)
          ORDER BY date
        `),
      ]);

      const [
        [totalResult],
        [newResult],
        [completedResult],
        [processResult],
        jenisResult,
        trendResult,
      ] = queries;

      res.json({
        success: true,
        data: {
          total: totalResult[0].total,
          new: newResult[0].count,
          completed: completedResult[0].count,
          processing: processResult[0].count,
          byType: jenisResult[0],
          trend: trendResult[0],
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil statistik",
      });
    }
  },

  // Generate PDF function
  async generatePDF(req, res) {
    try {
      const { letterId } = req.params;
      console.log("=== GENERATING PDF FOR LETTER ID:", letterId, "===");

      const query = `
      SELECT 
        l.*,
        u.name as created_by_name,
        lp.jenis_pengaduan, lp.tingkat_urgensi,
        lu.hari_tanggal_acara as undangan_tanggal_acara, lu.jenis_acara
      FROM letters l
      LEFT JOIN users u ON l.created_by = u.id
      LEFT JOIN letter_pengaduan lp ON l.id = lp.letter_id
      LEFT JOIN letter_undangan lu ON l.id = lu.letter_id
      WHERE l.id = ?
    `;

      const [letters] = await db.execute(query, [letterId]);

      if (letters.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Surat tidak ditemukan",
        });
      }

      const letter = letters[0];

      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      };

      const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page {
          size: A4;
          margin: 8mm;
        }
        body {
          font-family: Times New Roman, sans-serif;
          font-size: 14px;
          line-height: 1.3;
          margin: 0;
          padding: 0;
          color: #000;
        }
        .header {
          border: 2px solid #000;
          padding: 8px;
          margin-bottom: 0;
          display: table;
          width: 100%;
          box-sizing: border-box;
        }
        .header-center {
          display: table-cell;
          text-align: center;
          vertical-align: middle;
        }
        .header h2 {
          margin: 3px 0;
          font-size: 14px;
          font-weight: bold;
        }
        .header p {
          margin: 2px 0;
          font-size: 11px;
        }
        .title-section {
          background-color: #f0f0f0;
          text-align: center;
          padding: 6px;
          font-weight: bold;
          border: 2px solid #000;
          border-top: none;
          font-size: 13px;
          box-sizing: border-box;
        }
        .form-section {
          border: 2px solid #000;
          border-top: none;
          box-sizing: border-box;
        }
        .form-row, .form-row-split {
          border-bottom: 1px solid #000;
          min-height: 28px;
          display: table;
          width: 100%;
          box-sizing: border-box;
        }
        .form-row:last-child {
          border-bottom: none;
        }
        .form-label {
          display: table-cell;
          width: 40%;
          padding: 6px;
          border-right: 1px solid #000;
          vertical-align: middle;
          font-size: 11px;
          box-sizing: border-box;
        }
        .form-value {
          display: table-cell;
          padding: 6px;
          vertical-align: middle;
          font-size: 11px;
          box-sizing: border-box;
        }
        .form-label-left {
          display: table-cell;
          width: 30%;
          padding: 6px;
          border-right: 1px solid #000;
          vertical-align: middle;
          font-size: 11px;
          box-sizing: border-box;
        }
        .form-value-left {
          display: table-cell;
          width: 35%;
          padding: 6px;
          border-right: 1px solid #000;
          vertical-align: middle;
          font-size: 11px;
          box-sizing: border-box;
        }
        .form-label-right {
          display: table-cell;
          width: 15%;
          padding: 6px;
          border-right: 1px solid #000;
          vertical-align: middle;
          font-size: 11px;
          box-sizing: border-box;
        }
        .form-value-right {
          display: table-cell;
          width: 20%;
          padding: 6px;
          vertical-align: middle;
          font-size: 11px;
          box-sizing: border-box;
        }
        .disposisi-container {
          border: 2px solid #000;
          border-top: none;
          display: table;
          width: 100%;
          height: 250px;
          box-sizing: border-box;
        }
        .disposisi-col {
          display: table-cell;
          padding: 6px;
          vertical-align: top;
          border-right: 1px solid #000;
          font-size: 9px;
          box-sizing: border-box;
        }
        .disposisi-col:last-child {
          border-right: none;
        }
        .disposisi-left {
          width: 35%;
        }
        .disposisi-center {
          width: 40%;
        }
        .disposisi-right {
          width: 25%;
          text-align: center;
        }
        .checkbox-item {
          margin: 2px 0;
          font-size: 11px;
          line-height: 1.2;
        }
        .col-title {
          font-weight: bold;
          text-align: center;
          margin-bottom: 8px;
          font-size: 10px;
        }
        .lines {
          margin-top: 8px;
          font-size: 9px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-center">
          <h2>KETUA</h2>
          <h2>DEWAN PERWAKILAN DAERAH</h2>
          <h2>REPUBLIK INDONESIA</h2>
          <p>Jl. Jenderal Gatot Subroto No. 6 Jakarta - 10270</p>
        </div>
      </div>

      <div class="title-section">
        LEMBAR DISPOSISI KETUA DPD RI
      </div>

      <div class="form-section">
        <div class="form-row-split">
          <div class="form-label-left">Nomor Agenda/Registrasi</div>
          <div class="form-value-left">: ${letter.no_disposisi}</div>
          <div class="form-label-right">Tkt. Keamanan</div>
          <div class="form-value-right">:</div>
        </div>
        
        <div class="form-row-split">
          <div class="form-label-left">Tanggal Penerimaan</div>
          <div class="form-value-left">: ${formatDate(
            letter.tanggal_terima
          )}</div>
          <div class="form-label-right">Tgl. Penyelesaian</div>
          <div class="form-value-right">: ..................</div>
        </div>

        <div class="form-row">
          <div class="form-label">Asal Disposisi/Surat/Nota Dinas/Memorandum</div>
          <div class="form-value">: ${letter.asal_surat}</div>
        </div>

        <div class="form-row">
          <div class="form-label">Tanggal dan Nomor Surat/Nota Dinas/Memorandum</div>
          <div class="form-value">: ${formatDate(letter.tanggal_surat)} / ${
        letter.no_surat
      }</div>
        </div>

        <div class="form-row">
          <div class="form-label">Dari</div>
          <div class="form-value">: ${letter.asal_surat}</div>
        </div>

        <div class="form-row">
          <div class="form-label">Ringkasan Isi</div>
          <div class="form-value">: ${letter.perihal}</div>
        </div>

        <div class="form-row">
          <div class="form-label">Lampiran</div>
          <div class="form-value">: ${letter.file_surat_name || "-"}</div>
        </div>
      </div>

      <div class="disposisi-container">
        <div class="disposisi-col disposisi-left">
          <div class="col-title">Disposisi</div>
          <div class="checkbox-item">☐ Hadir</div>
          <div class="checkbox-item">☐ Hadir Virtual</div>
          <div class="checkbox-item">☐ Tidak Hadir</div>
          <div class="checkbox-item">☐ Kirim Bunga</div>
          <div class="checkbox-item">☐ Temui Saya</div>
          <div class="checkbox-item">☐ Siapkan Jawaban</div>
          <div class="checkbox-item">☐ Siapkan Draft</div>
          <div class="checkbox-item">☐ Siapkan Protokol</div>
          <div class="checkbox-item">☐ Check</div>
          <div class="checkbox-item">☐ Humas</div>
          <div class="checkbox-item">☐ Siapkan Foto Video</div>
          <div class="checkbox-item">☐ Siapkan Media</div>
          <div class="checkbox-item">☐ Untuk Dipelajari</div>
          <div class="checkbox-item">☐ Untuk Diketahui</div>
          <div class="checkbox-item">☐ Untuk Diselesaikan</div>
          <div class="checkbox-item">☐ Dapat Disetujui</div>
          <div class="checkbox-item">☐ Harap Dipenuhi</div>
          <div class="checkbox-item">☐ Koordinasikan</div>
          <div class="checkbox-item">☐ File</div>
          <div class="lines">
            <div>…………………………….</div>
            <div>…………………………….</div>
            <div>…………………………….</div>
          </div>
        </div>

        <div class="disposisi-col disposisi-center">
          <div class="col-title">Diteruskan Kepada :</div>
          <div class="checkbox-item">☐ Wakil Ketua Bid. I</div>
          <div class="checkbox-item">☐ Wakil Ketua Bid. II</div>
          <div class="checkbox-item">☐ Wakil Ketua Bid. III</div>
          <div class="checkbox-item">☐ Sesjen</div>
          <div class="checkbox-item">☐ Deputi Persidangan</div>
          <div class="checkbox-item">☐ Deputi Administrasi</div>
          <div class="checkbox-item">☐ Staf Khusus</div>
          <div class="checkbox-item">☐ Komite I</div>
          <div class="checkbox-item">☐ Komite II</div>
          <div class="checkbox-item">☐ Komite III</div>
          <div class="checkbox-item">☐ Komite IV</div>
          <div class="checkbox-item">☐ PURT</div>
          <div class="checkbox-item">☐ Panitia Musyawarah</div>
          <div class="checkbox-item">☐ PPUU</div>
          <div class="checkbox-item">☐ BK</div>
          <div class="checkbox-item">☐ BAP</div>
          <div class="checkbox-item">☐ BKSP</div>
          <div class="checkbox-item">☐ BULD</div>
          <div class="checkbox-item">☐ Karo. Setpim</div>
          <div class="checkbox-item">☐ Kabag. Set. Ketua</div>
          <div class="lines">
            <div>…………………………….</div>
            <div>…………………………….</div>
            <div>…………………………….</div>
          </div>
        </div>

        <div class="disposisi-col disposisi-right">
          <div class="col-title">Paraf</div>
        </div>
      </div>
    </body>
    </html>
    `;

      const puppeteer = require("puppeteer");

      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: "8mm",
          right: "8mm",
          bottom: "8mm",
          left: "8mm",
        },
      });

      await browser.close();

      const fileName = `DISPOSISI_${letter.no_disposisi.replace(
        /[\/\\]/g,
        "_"
      )}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Length", pdfBuffer.length);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      res.end(pdfBuffer);
      console.log("PDF sent successfully, size:", pdfBuffer.length);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({
        success: false,
        message: "Gagal generate PDF disposisi",
        error: error.message,
      });
    }
  },

  // Get stats by type untuk dashboard
  async getStatsByType(req, res) {
    try {
      const query = `
        SELECT 
          jenis,
          COUNT(*) as count
        FROM letters 
        WHERE YEAR(created_at) = 2025 
        GROUP BY jenis 
        ORDER BY jenis
      `;

      const [results] = await db.execute(query);

      // Pastikan semua jenis surat ada
      const allJenis = [
        "pengaduan",
        "pemberitahuan",
        "audiensi",
        "undangan",
        "proposal",
      ];
      const completeData = allJenis.map((jenis) => {
        const found = results.find((row) => row.jenis === jenis);
        return {
          jenis: jenis,
          count: found ? parseInt(found.count) : 0,
          monthlyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        };
      });

      res.json({
        success: true,
        data: completeData,
      });
    } catch (error) {
      console.error("Error fetching stats by type:", error);
      res.json({
        success: false,
        data: [],
      });
    }
  },
};

module.exports = lettersController;
