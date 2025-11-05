const express = require("express");
const router = express.Router();

const calendar_controller = require('../controllers/calendar.controller');

router.get('/', calendar_controller.get_calendar);

module.exports = router;