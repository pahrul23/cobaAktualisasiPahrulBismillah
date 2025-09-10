const express = require('express');
const router = express.Router();
const dispositionsController = require('../src/controllers/dispositions.controller');

// GET all dispositions dengan parameter pencarian
router.get('/', dispositionsController.getAllDispositions);

// POST create new disposition
router.post('/', dispositionsController.createDisposition);

// DELETE disposition by ID
router.delete('/:id', dispositionsController.deleteDisposition);

// GET download file by disposition ID
router.get('/:id/download', dispositionsController.downloadFile);

module.exports = router;