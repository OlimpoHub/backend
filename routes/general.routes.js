const express = require("express");
const router = express.Router();

const beneficiary_routes = require('./beneficiary.routes');
const user_routes = require('./user.routes');
const suppliesRoutes = require("./supplies.routes");
const workshopsRoutes = require("./workshops.routes");
const externalCollabsRoutes = require("./externalCollabs.routes");
const supplyBatchRouter = require("./supplyBatch.routes")
const productBatchRouter = require("./productBatch.routes")
const calendarRoutes = require('./calendar.routes');

router.use("/beneficiary", beneficiary_routes);
// Supplies routes
router.use("/supplies", suppliesRoutes);
router.use("/externalCollabs", externalCollabsRoutes);
router.use("/supplyBatch", supplyBatchRouter);
router.use("/workshop", workshopsRoutes);
router.use("/productBatch", productBatchRouter);
router.use("/calendar", calendarRoutes);

module.exports = router;