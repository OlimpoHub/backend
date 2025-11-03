const express = require("express");
const router = express.Router();

const beneficiary_routes = require('./beneficiary.routes');
const suppliesRoutes = require("./supplies.routes");

router.use("/beneficiary", beneficiary_routes);
// Supplies routes
router.use("/supplies", suppliesRoutes);


module.exports = router;
