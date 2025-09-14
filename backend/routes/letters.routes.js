const express = require('express')
const router = express.Router()
const lettersController = require('../src/controllers/letters.controller')

// GET /api/letters/stats-by-type - untuk dashboard
router.get('/stats-by-type', lettersController.getStatsByType)

// Route lainnya bisa ditambah di sini nanti
router.get('/', lettersController.getAllLetters)
router.get('/:id', lettersController.getLetterById)
router.post('/', lettersController.uploadFile, lettersController.createLetter)
router.put('/:id', lettersController.uploadFile, lettersController.updateLetter)
router.delete('/:id', lettersController.deleteLetter)
router.get('/:letterId/pdf', lettersController.generatePDF)

module.exports = router