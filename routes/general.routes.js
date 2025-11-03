const express = require("express");
const router = express.Router();

const beneficiary_routes = require('./beneficiary.routes');

router.use("/beneficiary", beneficiary_routes);


module.exports = router;