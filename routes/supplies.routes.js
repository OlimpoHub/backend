const express = require("express");
const router = express.Router();

const suppliesController = require("../controllers/supplies.controller");

router.get("/", suppliesController.getSupplies);
router.post("/search", suppliesController.searchSupplies);
router.post("/filter", suppliesController.filterSupplies);
router.post("/order", suppliesController.orderSupplies);

module.exports = router;
