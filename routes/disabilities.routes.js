const express = require("express");
const router = express.Router();

const disabilityController = require('../controllers/disabilities.controller');

// Ruta para BEN-001
router.get('/list', disabilityController.fetchAll);

// Ruta para modificar discapacidad (US CAP-003)
router.post("/update", disabilityController.updateDisabilities);

module.exports = router;