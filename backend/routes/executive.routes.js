const express = require('express');
const router = express.Router();
const executiveController = require('../controllers/executive.controller');

// Middleware untuk logging (optional)
router.use((req, res, next) => {
  console.log(`Executive API: ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// GET /api/executive/surat-summary?month=YYYY-MM
// Summary surat masuk per bulan dengan filter
router.get('/surat-summary', executiveController.getSuratSummary);

// GET /api/executive/proposals
// Get proposals yang menunggu approval dari Ketua
router.get('/proposals', executiveController.getProposalsForApproval);

// PUT /api/executive/proposals/:id
// Update keputusan proposal (setuju/tolak/revisi)
router.put('/proposals/:id', executiveController.updateProposalDecision);

// GET /api/executive/undangan
// Get undangan & audiensi untuk konfirmasi kehadiran
router.get('/undangan', executiveController.getUndanganAudiensi);

// PUT /api/executive/undangan/:id
// Update status kehadiran (hadir/tidak_hadir/ditunda)
router.put('/undangan/:id', executiveController.updateAttendanceStatus);

// GET /api/executive/notifications
// Get riwayat aksi Ketua dan notifikasi untuk staff
router.get('/notifications', executiveController.getExecutiveNotifications);

// Health check endpoint khusus executive
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Executive API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      'GET /surat-summary': 'Ringkasan surat masuk',
      'GET /proposals': 'Proposal untuk approval',
      'PUT /proposals/:id': 'Update keputusan proposal',
      'GET /undangan': 'Undangan & audiensi',
      'PUT /undangan/:id': 'Update status kehadiran',
      'GET /notifications': 'Riwayat aksi & notifikasi'
    }
  });
});

module.exports = router;