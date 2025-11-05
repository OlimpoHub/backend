const express = require("express");
const router = express.Router();

const beneficiary_routes = require('./beneficiary.routes');
const calendar_routes = require('./calendar.routes');

router.use("/beneficiary", beneficiary_routes);
router.use("/calendar", calendar_routes);


module.exports = router;