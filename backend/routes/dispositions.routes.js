const express = require('express');
const router = express.Router();
// const dispositionsController = require('../controllers/dispositions.controller');
const dispositionsController = require('../src/controllers/dispositions.controller')


router.get('/', dispositionsController.getAllDispositions);
router.post('/', dispositionsController.createDisposition);

module.exports = router;