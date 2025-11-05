const express = require("express");
const router = express.Router();

const beneficiary_routes = require('./beneficiary.routes');
const suppliesRoutes = require("./supplies.routes");
const externalCollabsRoutes = require("./externalCollabs.routes");
const supplyBatchRouter = require("./supplyBatch.routes")
const productBatchRouter = require("./productBatch.routes")

router.use("/beneficiary", beneficiary_routes);
router.use("/supplies", suppliesRoutes);
router.use("/externalCollabs", externalCollabsRoutes);
router.use("/supplyBatch", supplyBatchRouter);
router.use("/productBatch", productBatchRouter);

module.exports = router;