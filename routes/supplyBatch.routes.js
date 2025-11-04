const express = require("express");
const router = express.Router();

const supplyBatchController = require("../controllers/supplyBatch.controller");

router.get("/", supplyBatchController.getSupplyBatches);

module.exports = router;