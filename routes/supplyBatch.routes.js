const express = require("express");
const router = express.Router();

const supplyBatchController = require("../controllers/supplyBatch.controller");

router.get("/", supplyBatchController.getSupplyBatch);
router.get("/:idInsumo", supplyBatchController.getOneSupplyBatch);

module.exports = router;