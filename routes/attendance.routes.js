const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");

// GET
router.get("/", attendanceController.getAttendance);

module.exports = router;
