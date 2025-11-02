const express = require("express");
const router = express.Router();

const suppliesController = require("../controllers/supplies.controller");

router.get("/", suppliesController.getSupplies);

module.exports = router;
