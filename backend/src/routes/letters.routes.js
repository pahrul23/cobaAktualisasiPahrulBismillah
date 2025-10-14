const express = require('express')
const router = express.Router()
// const lettersController = require('../src/controllers/letters.controller')
const lettersController = require('../controllers/letters.controller')


// ✅ Route spesifik HARUS DI ATAS
router.get('/stats-by-type', lettersController.getStatsByType)
router.get('/:id/pdf', lettersController.generatePDF)  // ⬆️ PINDAH KE SINI

// ✅ Route umum di bawah  
router.get('/', lettersController.getAllLetters)
router.get('/:id', lettersController.getLetterById)
router.post('/', lettersController.uploadFile, lettersController.createLetter)
router.put('/:id', lettersController.uploadFile, lettersController.updateLetter)
router.delete('/:id', lettersController.deleteLetter)

module.exports = router
