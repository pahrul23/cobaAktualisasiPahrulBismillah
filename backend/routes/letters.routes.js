const express = require('express')
const router = express.Router()
const lettersController = require('../src/controllers/letters.controller')

// ============================================
// ✅ ROUTE SPESIFIK HARUS DI ATAS (IMPORTANT!)
// ============================================

// GET /api/letters/stats-by-type - untuk dashboard
router.get('/stats-by-type', lettersController.getStatsByType)

// GET /api/letters/:id/pdf - Generate PDF (HARUS SEBELUM /:id)
router.get('/:id/pdf', lettersController.generatePDF)  // ✅ PINDAH KE SINI

// ============================================
// ✅ ROUTE UMUM DI BAWAH
// ============================================

// GET /api/letters - Get all letters
router.get('/', lettersController.getAllLetters)

// GET /api/letters/:id - Get single letter (HARUS SETELAH /:id/pdf)
router.get('/:id', lettersController.getLetterById)

// POST /api/letters - Create new letter
router.post('/', lettersController.uploadFile, lettersController.createLetter)

// PUT /api/letters/:id - Update letter
router.put('/:id', lettersController.uploadFile, lettersController.updateLetter)

// DELETE /api/letters/:id - Delete letter
router.delete('/:id', lettersController.deleteLetter)

module.exports = router
