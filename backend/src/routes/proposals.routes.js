// Path: /backend/src/routes/proposals.routes.js
const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposal.controller');

// GET /api/proposals - Get all proposals
router.get('/', proposalController.getAllProposals);

// GET /api/proposals/stats - Get proposal statistics  
router.get('/stats', proposalController.getProposalStats);

// GET /api/proposals/:id - Get single proposal detail
router.get('/:id', proposalController.getProposalById);

// PUT /api/proposals/:id - Update proposal
router.put('/:id', proposalController.updateProposal);

module.exports = router;