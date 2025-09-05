const express = require('express')
const router = express.Router()
const disposisiController = require('../controllers/disposisi.controller')
const authMiddleware = require('../middleware/auth')

// Apply authentication middleware
router.use(authMiddleware)

// GET /api/letters/:id/disposisi - Download/view disposisi PDF
router.get('/:id/disposisi', disposisiController.getDisposisiFile)

// POST /api/letters/:id/disposisi/generate - Generate new disposisi PDF
router.post('/:id/disposisi/generate', disposisiController.generateDisposisiPDF)

// POST /api/letters/:id/disposisi/regenerate - Regenerate disposisi PDF
router.post('/:id/disposisi/regenerate', disposisiController.regenerateDisposisi)

module.exports = router