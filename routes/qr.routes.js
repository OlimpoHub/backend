const express = require("express");
const router = express.Router();

const qrController = require("../controllers/qr.controller.js");

router.get("/create", qrController.createQR);
router.post("/validate", qrController.validateQR);

module.exports = router;
