const express = require("express");
const router = express.Router();
const db = require("../src/config/database");

// Middleware untuk authentication (jika diperlukan)
const authMiddleware = require("../src/middlewares/auth.middleware");

// GET - Ambil semua undangan yang belum dikonfirmasi
router.get("/undangan", async (req, res) => {
  try {
    console.log("📅 GET /api/approval/undangan - Request received");

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
    console.log(`✅ Found ${rows.length} undangan records`);

    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error("❌ Error in GET /api/approval/undangan:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch undangan data",
      message: error.message,
    });
  }
});

// GET - Ambil audiensi yang pending approval (untuk Ketua)
router.get("/audiensi/pending", async (req, res) => {
  try {
    console.log("🤝 GET /api/approval/audiensi/pending - Request received");

    const query = `
      SELECT 
        l.id as letter_id,
        l.jenis, l.no_disposisi, l.no_surat, l.asal_surat,
        l.perihal, l.tanggal_terima, l.tanggal_surat, l.uraian,
        l.keterangan, l.label, l.status, l.created_at,
        la.hari_tanggal, la.pukul, la.tempat, la.nama_pemohon,
        la.instansi_organisasi, la.jumlah_peserta, la.topik_audiensi,
        la.dokumentasi,
        COALESCE(a.status_kehadiran, 'belum_konfirmasi') as status_kehadiran,
        a.catatan_kehadiran, a.tanggal_konfirmasi, a.tanggal_agenda,
        'pending' as approved_status,
        NULL as approved_by,
        NULL as approved_at
      FROM letters l
      LEFT JOIN letter_audiensi la ON l.id = la.letter_id
      LEFT JOIN agenda a ON l.id = a.letter_id AND a.jenis_surat = 'audiensi'
      WHERE l.jenis = 'audiensi' 
        AND COALESCE(a.status_kehadiran, 'belum_konfirmasi') = 'belum_konfirmasi'
      ORDER BY l.tanggal_terima DESC, l.created_at DESC
    `;

    const [rows] = await db.execute(query);
    console.log(`✅ Found ${rows.length} pending audiensi records`);

    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error) {
    console.error("❌ Error in GET /api/approval/audiensi/pending:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch pending audiensi data",
      message: error.message,
    });
  }
});

// PUT - Approve/Reject audiensi - DIPERBAIKI
router.put("/audiensi/:letterId/approval", async (req, res) => {
  const { letterId } = req.params;
  const { action, approved_by = 1, notes = "", schedule } = req.body;

  console.log(
    `🔄 PUT /api/approval/audiensi/${letterId}/approval - Action: ${action}`
  );
  console.log("📋 Request body:", { action, approved_by, notes, schedule });

  try {
    // Validation
    if (!["approve", "reject"].includes(action)) {
      console.log("❌ Invalid action:", action);
      return res.status(400).json({
        success: false,
        error: "Invalid action. Must be: approve, reject",
      });
    }

    // Verify audiensi exists dan ambil detail
    const [audiensiExists] = await db.execute(
      `SELECT l.id, l.perihal, l.asal_surat, l.tanggal_terima 
       FROM letters l 
       WHERE l.id = ? AND l.jenis = ?`,
      [letterId, "audiensi"]
    );

    if (audiensiExists.length === 0) {
      console.log("❌ Audiensi not found:", letterId);
      return res.status(404).json({
        success: false,
        error: "Audiensi not found",
      });
    }

    const audiensi = audiensiExists[0];
    console.log("✅ Audiensi verified:", audiensi);

    // Update letter_audiensi dengan schedule data jika approve
    let tanggal_agenda = null;

    if (action === "approve" && schedule) {
      console.log("📅 Updating letter_audiensi with schedule:", schedule);

      await db.execute(
        "UPDATE letter_audiensi SET hari_tanggal = ?, pukul = ?, tempat = ?, updated_at = CURRENT_TIMESTAMP WHERE letter_id = ?",
        [schedule.hari_tanggal, schedule.pukul, schedule.tempat, letterId]
      );

      tanggal_agenda = schedule.hari_tanggal;
      console.log("✅ Schedule updated in letter_audiensi");
    } else {
      // Ambil data lama jika tidak ada schedule baru
      const [audiensiDetails] = await db.execute(
        "SELECT hari_tanggal FROM letter_audiensi WHERE letter_id = ?",
        [letterId]
      );
      tanggal_agenda = audiensiDetails[0]?.hari_tanggal || null;
    }

    // Determine new status
    const statusKehadiran = action === "approve" ? "hadir" : "tidak_hadir";
    const catatanKehadiran =
      action === "approve"
        ? `Ketua menyetujui audiensi ini. ${notes}`.trim()
        : `Ketua menolak audiensi ini. ${notes}`.trim();

    console.log("📝 Status dan catatan:", {
      statusKehadiran,
      catatanKehadiran,
    });

    // Check if agenda record already exists
    const [existing] = await db.execute(
      "SELECT id FROM agenda WHERE letter_id = ? AND jenis_surat = ?",
      [letterId, "audiensi"]
    );

    let result;
    if (existing.length > 0) {
      // Update existing record
      console.log("🔄 Updating existing agenda record");
      const updateQuery = `
        UPDATE agenda
        SET status_kehadiran = ?,
            catatan_kehadiran = ?,
            tanggal_konfirmasi = CURRENT_TIMESTAMP,
            tanggal_agenda = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE letter_id = ? AND jenis_surat = ?
      `;

      [result] = await db.execute(updateQuery, [
        statusKehadiran,
        catatanKehadiran,
        tanggal_agenda,
        letterId,
        "audiensi",
      ]);
    } else {
      // Insert new record
      console.log("➕ Creating new agenda record");
      const insertQuery = `
        INSERT INTO agenda
        (letter_id, jenis_surat, status_kehadiran, catatan_kehadiran,
         tanggal_konfirmasi, tanggal_agenda, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;

      [result] = await db.execute(insertQuery, [
        letterId,
        "audiensi",
        statusKehadiran,
        catatanKehadiran,
        tanggal_agenda,
        approved_by,
      ]);
    }

    console.log("✅ Agenda updated, affected rows:", result.affectedRows);

    // Create notification for staff - DIPERBAIKI
    await createAudiensiNotification(
      letterId,
      action,
      audiensi,
      catatanKehadiran,
      schedule
    );

    console.log(
      `✅ Audiensi ${
        action === "approve" ? "approved" : "rejected"
      } successfully`
    );

    res.status(200).json({
      success: true,
      message: `Audiensi berhasil ${
        action === "approve" ? "disetujui" : "ditolak"
      }`,
      data: {
        letterId,
        action,
        status_kehadiran: statusKehadiran,
        catatan_kehadiran: catatanKehadiran,
        tanggal_agenda,
        affectedRows: result.affectedRows,
      },
    });
  } catch (error) {
    console.error(`❌ Error in audiensi approval ${action}:`, error);
    res.status(500).json({
      success: false,
      error: `Failed to ${action} audiensi`,
      message: error.message,
    });
  }
});

// Ganti fungsi createAudiensiNotification di approval.routes.js dengan yang ini:

const createAudiensiNotification = async (
  letterId,
  action,
  audiensi,
  catatan,
  schedule = null
) => {
  try {
    console.log("🔔 Creating audiensi notification...");
    console.log("📋 Notification data:", {
      letterId,
      action,
      audiensi,
      catatan,
      schedule,
    });

    const statusText = action === "approve" ? "DISETUJUI" : "DITOLAK";

    let pesan;
    if (action === "approve" && schedule) {
      const formatDate = new Date(schedule.hari_tanggal).toLocaleDateString(
        "id-ID",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      pesan = `Audiensi "${audiensi.perihal}" dari ${
        audiensi.asal_surat
      } telah ${statusText.toLowerCase()} oleh Ketua DPD RI dan dijadwalkan pada ${formatDate} pukul ${
        schedule.pukul
      } di ${schedule.tempat}. Catatan: ${catatan}`;
    } else {
      pesan = `Permohonan audiensi "${audiensi.perihal}" dari ${
        audiensi.asal_surat
      } telah ${statusText.toLowerCase()} oleh Ketua DPD RI. Catatan: ${catatan}`;
    }

    console.log("📝 Final notification message:", pesan);

    // PERBAIKAN: Gunakan struktur yang sama dengan createAttendanceNotification
    const notifQuery = `
      INSERT INTO notifications
      (staff_id, jenis, pesan, letter_id, status_read, created_at)
      VALUES (NULL, 'attendance_update', ?, ?, 0, CURRENT_TIMESTAMP)
    `;

    // PERBAIKAN: Hanya gunakan parameter yang ada di tabel
    const notifParams = [pesan, letterId];

    const [result] = await db.execute(notifQuery, notifParams);
    console.log("✅ Audiensi notification insert result:", result);

    // Verify notification was created
    const [checkNotif] = await db.execute(
      "SELECT id, pesan FROM notifications WHERE letter_id = ? ORDER BY created_at DESC LIMIT 1",
      [letterId]
    );

    if (checkNotif.length > 0) {
      console.log("✅ Notification verified in database:", checkNotif[0]);
    } else {
      console.log(
        "⚠️ Warning: Notification not found in database after creation"
      );

      // Fallback: Coba insert dengan struktur minimal
      console.log("🔄 Trying fallback notification insert...");
      const fallbackQuery = `
        INSERT INTO notifications (staff_id, jenis, pesan, letter_id, status_read, created_at)
        VALUES (NULL, 'attendance_update', ?, ?, 0, NOW())
      `;

      await db.execute(fallbackQuery, [
        `Audiensi "${audiensi.perihal}" telah disetujui oleh Ketua DPD RI`,
        letterId,
      ]);

      console.log("✅ Fallback notification created");
    }
  } catch (error) {
    console.error("❌ Error creating audiensi notification:", error);
    console.error("❌ Error details:", error.message);
    console.error("❌ Error stack:", error.stack);

    // Ultimate fallback - basic insert
    try {
      console.log("🆘 Attempting ultimate fallback notification...");
      await db.execute(
        "INSERT INTO notifications (staff_id, jenis, pesan, letter_id, status_read) VALUES (NULL, ?, ?, ?, 0)",
        [
          "attendance_update",
          `Audiensi telah diproses oleh Ketua DPD RI`,
          letterId,
        ]
      );
      console.log("✅ Ultimate fallback notification created");
    } catch (fallbackError) {
      console.error("💥 Even fallback notification failed:", fallbackError);
    }
  }
};

// PUT - Update status kehadiran di tabel agenda
router.put("/agenda/:letterId", async (req, res) => {
  const { letterId } = req.params;
  const {
    jenis_surat,
    status_kehadiran,
    catatan_kehadiran,
    created_by = 1,
  } = req.body;

  console.log(`🔄 PUT /api/approval/agenda/${letterId} - Request received`);
  console.log("📝 Request body:", {
    jenis_surat,
    status_kehadiran,
    catatan_kehadiran,
    created_by,
  });

  // Validation
  if (!letterId || !jenis_surat || !status_kehadiran) {
    console.log("❌ Missing required fields");
    return res.status(400).json({
      success: false,
      error: "Missing required fields: letterId, jenis_surat, status_kehadiran",
    });
  }

  if (
    !["hadir", "tidak_hadir", "belum_konfirmasi"].includes(status_kehadiran)
  ) {
    console.log("❌ Invalid status_kehadiran:", status_kehadiran);
    return res.status(400).json({
      success: false,
      error:
        "Invalid status_kehadiran. Must be: hadir, tidak_hadir, belum_konfirmasi",
    });
  }

  if (!["undangan", "audiensi"].includes(jenis_surat)) {
    console.log("❌ Invalid jenis_surat:", jenis_surat);
    return res.status(400).json({
      success: false,
      error: "Invalid jenis_surat. Must be: undangan, audiensi",
    });
  }

  try {
    // Verify letter exists
    const [letterExists] = await db.execute(
      "SELECT id, jenis FROM letters WHERE id = ? AND jenis = ?",
      [letterId, jenis_surat]
    );

    if (letterExists.length === 0) {
      console.log("❌ Letter not found:", letterId, jenis_surat);
      return res.status(404).json({
        success: false,
        error: "Letter not found or jenis_surat mismatch",
      });
    }

    console.log("✅ Letter verified:", letterExists[0]);

    // Get letter and event date info
    let tanggal_agenda = null;

    if (jenis_surat === "undangan") {
      const [undanganData] = await db.execute(
        "SELECT hari_tanggal_acara FROM letter_undangan WHERE letter_id = ?",
        [letterId]
      );
      tanggal_agenda = undanganData[0]?.hari_tanggal_acara || null;
      console.log("📅 Undangan tanggal_agenda:", tanggal_agenda);
    } else {
      const [audiensiData] = await db.execute(
        "SELECT hari_tanggal FROM letter_audiensi WHERE letter_id = ?",
        [letterId]
      );
      tanggal_agenda = audiensiData[0]?.hari_tanggal || null;
      console.log("🤝 Audiensi tanggal_agenda:", tanggal_agenda);
    }

    // Check if agenda record already exists
    const checkQuery = `
      SELECT id FROM agenda 
      WHERE letter_id = ? AND jenis_surat = ?
    `;
    const [existing] = await db.execute(checkQuery, [letterId, jenis_surat]);
    console.log("🔍 Existing agenda records:", existing.length);

    let result;

    if (existing.length > 0) {
      // Update existing record
      console.log("🔄 Updating existing agenda record");
      const updateQuery = `
        UPDATE agenda 
        SET status_kehadiran = ?, 
            catatan_kehadiran = ?, 
            tanggal_konfirmasi = CURRENT_TIMESTAMP,
            tanggal_agenda = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE letter_id = ? AND jenis_surat = ?
      `;

      [result] = await db.execute(updateQuery, [
        status_kehadiran,
        catatan_kehadiran,
        tanggal_agenda,
        letterId,
        jenis_surat,
      ]);
    } else {
      // Insert new record
      console.log("➕ Creating new agenda record");
      const insertQuery = `
        INSERT INTO agenda 
        (letter_id, jenis_surat, status_kehadiran, catatan_kehadiran, 
         tanggal_konfirmasi, tanggal_agenda, created_by, created_at, updated_at) 
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;

      [result] = await db.execute(insertQuery, [
        letterId,
        jenis_surat,
        status_kehadiran,
        catatan_kehadiran,
        tanggal_agenda,
        created_by,
      ]);
    }

    console.log("✅ Database operation result:", {
      affectedRows: result.affectedRows,
    });

    // Create notification for staff
    await createAttendanceNotification(
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
        affectedRows: result.affectedRows,
      },
    });
  } catch (error) {
    console.error("❌ Error in PUT /api/approval/agenda:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update agenda status",
      message: error.message,
    });
  }
});

// Function untuk membuat notifikasi attendance
const createAttendanceNotification = async (
  letterId,
  jenisAcara,
  statusKehadiran,
  catatan
) => {
  try {
    console.log("🔔 Creating attendance notification...");

    // Get letter details
    const letterQuery = `
      SELECT perihal, asal_surat, tanggal_terima 
      FROM letters 
      WHERE id = ?
    `;
    const [letterData] = await db.execute(letterQuery, [letterId]);

    if (letterData.length === 0) {
      console.log("❌ Letter not found for notification");
      return;
    }

    const letter = letterData[0];
    const statusText =
      statusKehadiran === "hadir" ? "AKAN HADIR" : "TIDAK HADIR";
    const jenisText = jenisAcara === "undangan" ? "undangan" : "audiensi";

    const pesan = `Ketua DPD RI ${statusText} pada ${jenisText} "${
      letter.perihal
    }" dari ${letter.asal_surat} tanggal ${new Date(
      letter.tanggal_terima
    ).toLocaleDateString("id-ID")}. Catatan: ${catatan}`;

    const notifQuery = `
      INSERT INTO notifications 
      (staff_id, jenis, letter_jenis, pesan, letter_id, perihal, asal_surat, status_read, created_at)
      VALUES (NULL, 'attendance_update', ?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
    `;

    await db.execute(notifQuery, [
      jenisText,
      pesan,
      letterId,
      letter.perihal,
      letter.asal_surat,
    ]);
    console.log(
      "✅ Attendance notification created successfully for letter ID:",
      letterId
    );
  } catch (error) {
    console.error("❌ Error creating attendance notification:", error);
  }
};

// GET - Gabungan undangan dan audiensi untuk approval center
router.get("/all", async (req, res) => {
  try {
    console.log("📋 GET /api/approval/all - Request received");

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
    console.log(`✅ Found ${rows.length} total approval records`);

    // Separate data by type
    const undangan = rows.filter((row) => row.jenis === "undangan");
    const audiensi = rows.filter((row) => row.jenis === "audiensi");

    // Calculate statistics
    const stats = {
      totalPending: rows.filter(
        (row) => row.status_kehadiran === "belum_konfirmasi"
      ).length,
      undanganCount: undangan.length,
      audiensiCount: audiensi.length,
      urgentCount: rows.filter((row) => row.label === "merah").length,
      akanHadirCount: rows.filter((row) => row.status_kehadiran === "hadir")
        .length,
      tidakHadirCount: rows.filter(
        (row) => row.status_kehadiran === "tidak_hadir"
      ).length,
    };

    console.log("📊 Statistics calculated:", stats);

    res.status(200).json({
      success: true,
      data: {
        all: rows,
        undangan,
        audiensi,
        stats,
      },
      count: rows.length,
    });
  } catch (error) {
    console.error("❌ Error in GET /api/approval/all:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch approval data",
      message: error.message,
    });
  }
});

// GET - Get audiensi detail for modal/preview
router.get("/audiensi/:letterId/detail", async (req, res) => {
  const { letterId } = req.params;

  try {
    console.log(
      `📋 GET /api/approval/audiensi/${letterId}/detail - Request received`
    );

    const query = `
      SELECT 
        l.id as letter_id,
        l.jenis, l.no_disposisi, l.no_surat, l.asal_surat,
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
      WHERE l.id = ? AND l.jenis = 'audiensi'
    `;

    const [rows] = await db.execute(query, [letterId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Audiensi not found",
      });
    }

    console.log(`✅ Audiensi detail found for ID: ${letterId}`);

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(
      `❌ Error fetching audiensi detail for ID ${letterId}:`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Failed to fetch audiensi detail",
      message: error.message,
    });
  }
});

// GET - Get agenda detail for modal
router.get("/agenda/:agendaId", async (req, res) => {
  const { agendaId } = req.params;

  try {
    console.log(`GET /api/approval/agenda/${agendaId} - Request received`);

    const query = `
      SELECT 
        a.*,
        l.perihal as letter_perihal,
        l.asal_surat,
        l.no_surat as letter_no_surat,
        -- Audiensi data
        la.hari_tanggal as audiensi_tanggal,
        la.pukul as audiensi_pukul, 
        la.tempat as audiensi_tempat,
        la.nama_pemohon,
        la.instansi_organisasi,
        la.jumlah_peserta,
        la.topik_audiensi,
        la.dokumentasi as audiensi_dokumentasi,
        -- Undangan data
        lu.hari_tanggal_acara as undangan_tanggal_acara,
        lu.pukul as undangan_pukul,
        lu.tempat as undangan_tempat,
        lu.jenis_acara,
        lu.dress_code,
        lu.rsvp_required,
        lu.dokumentasi as undangan_dokumentasi
      FROM agenda a
      LEFT JOIN letters l ON a.letter_id = l.id
      LEFT JOIN letter_audiensi la ON a.letter_id = la.letter_id AND a.jenis_surat = 'audiensi'
      LEFT JOIN letter_undangan lu ON a.letter_id = lu.letter_id AND a.jenis_surat = 'undangan'
      WHERE a.id = ?
    `;

    const [rows] = await db.execute(query, [agendaId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Agenda not found",
      });
    }

    console.log("Agenda detail found:", rows[0]);

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error getting agenda detail:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve agenda detail",
      message: error.message,
    });
  }
});

// GET - Dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    console.log("📊 GET /api/approval/stats - Request received");

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
    console.log("✅ Statistics retrieved:", stats[0]);

    res.status(200).json({
      success: true,
      data: stats[0],
    });
  } catch (error) {
    console.error("❌ Error in GET /api/approval/stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch approval statistics",
      message: error.message,
    });
  }
});

// GET - Health check untuk approval routes
router.get("/health", (req, res) => {
  console.log("🏥 GET /api/approval/health - Health check");
  res.json({
    success: true,
    message: "Approval routes are healthy",
    timestamp: new Date().toISOString(),
    endpoints: {
      "GET /undangan": "Get all undangan data",
      "GET /audiensi/pending": "Get pending audiensi data",
      "PUT /audiensi/:letterId/approval": "Approve/reject audiensi",
      "GET /all": "Get combined approval data",
      "PUT /agenda/:letterId": "Update attendance status",
      "GET /stats": "Get approval statistics",
      "GET /health": "Health check",
    },
  });
});

// Tambahkan route debug sederhana di approval.routes.js

// Simple test route untuk cek apakah bisa insert ke notifications
router.get("/test-notification/:letterId", async (req, res) => {
  const { letterId } = req.params;

  try {
    console.log("🧪 Testing notification insert for letter:", letterId);

    // Test insert paling sederhana
    const query = `
      INSERT INTO notifications (staff_id, jenis, pesan, letter_id, status_read, created_at)
      VALUES (NULL, 'attendance_update', ?, ?, 0, NOW())
    `;

    const testMessage = `TEST: Audiensi untuk letter ID ${letterId} berhasil disetujui`;

    const [result] = await db.execute(query, [testMessage, letterId]);

    console.log("✅ Test notification result:", result);

    // Verify
    const [check] = await db.execute(
      "SELECT * FROM notifications WHERE letter_id = ? ORDER BY created_at DESC LIMIT 1",
      [letterId]
    );

    res.json({
      success: true,
      message: "Test notification created successfully",
      insertId: result.insertId,
      affectedRows: result.affectedRows,
      verification: check[0] || null,
    });
  } catch (error) {
    console.error("❌ Test notification error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
    });
  }
});

module.exports = router;
module.exports.createAttendanceNotification = createAttendanceNotification;
module.exports.createAudiensiNotification = createAudiensiNotification;
