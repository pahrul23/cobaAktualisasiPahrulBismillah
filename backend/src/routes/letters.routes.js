// Path: /backend/src/routes/letters.routes.js
const express = require('express')
const router = express.Router()
const lettersController = require('../controllers/letters.controller')
const authMiddleware = require('../middlewares/auth.middleware') // Sesuaikan dengan auth middleware

// Apply auth middleware to all routes
// router.use(authMiddleware)

// GET /api/letters - Get all letters dengan filtering dan pagination
router.get('/', lettersController.getAllLetters)

// GET /api/letters/stats - Get dashboard statistics  
router.get('/stats', lettersController.getDashboardStats)

// GET /api/letters/:id - Get single letter dengan detail
router.get('/:id', lettersController.getLetterById)

// POST /api/letters - Create new letter dengan file upload
router.post('/', 
  lettersController.uploadFile,  // Multer middleware untuk handle file upload
  lettersController.createLetter
)

// PUT /api/letters/:id - Update letter
router.put('/:id', 
  lettersController.uploadFile,  // Handle file update juga
  lettersController.updateLetter
)

// DELETE /api/letters/:id - Delete letter
router.delete('/:id', lettersController.deleteLetter)

module.exports = router