// Path: /backend/src/routes/executive.routes.js
const express = require('express');
const router = express.Router();
const executiveController = require('../controllers/executive.controller');

// GET /api/executive/surat-summary?month=YYYY-MM
router.get('/surat-summary', executiveController.getSuratSummary);

// GET /api/executive/proposals - Get proposals needing approval
router.get('/proposals', executiveController.getProposalsForApproval);

// PUT /api/executive/proposals/:id - Update proposal decision
router.put('/proposals/:id', executiveController.updateProposalDecision);

// GET /api/executive/undangan - Get undangan/audiensi for confirmation
router.get('/undangan', executiveController.getUndanganAudiensi);

// PUT /api/executive/undangan/:id - Update attendance status
router.put('/undangan/:id', executiveController.updateAttendanceStatus);

// GET /api/executive/notifications - Get executive notifications history
router.get('/notifications', executiveController.getExecutiveNotifications);

// Tambahkan sebelum module.exports
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