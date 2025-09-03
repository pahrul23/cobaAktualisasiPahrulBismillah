const express = require('express');
const lettersController = require('../controllers/letters.controller');
const { authGuard } = require('../middlewares/authGuard');

const router = express.Router();

// Semua routes memerlukan authentication
router.use(authGuard);

// GET /api/letters - Get all letters with filters
router.get('/', lettersController.getLetters);

// POST /api/letters - Create new letter
router.post('/', lettersController.createLetter);

// GET /api/letters/:id - Get letter by ID
router.get('/:id', lettersController.getLetterById);

// PUT /api/letters/:id - Update letter
router.put('/:id', lettersController.updateLetter);

// DELETE /api/letters/:id - Delete letter
router.delete('/:id', lettersController.deleteLetter);

module.exports = router;