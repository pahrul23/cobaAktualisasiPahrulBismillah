// agenda.routes.js - FIXED imports and routes
const express = require("express");
const router = express.Router();
const agendaController = require("../controllers/agenda.controller");

// Get all agenda
router.get("/", agendaController.getAllAgenda);

// Get single agenda by ID
router.get("/:id", agendaController.getAgendaById);

// Create new agenda (manual)
router.post("/", agendaController.createAgenda);

// Update agenda
router.put("/:id", agendaController.updateAgenda);

// Update attendance status only
router.put("/:id/attendance", agendaController.updateAttendance);

// Delete agenda
router.delete("/:id", agendaController.deleteAgenda);

// Get agenda statistics
router.get("/stats", agendaController.getAgendaStats);

module.exports = router;