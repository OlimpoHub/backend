const express = require("express");
const router = express.Router();

const suppliesController = require("../controllers/supplies.controller");

// Define a GET endpoint to retrieve all supplies
router.get("/", suppliesController.getSupplies);

// Export the router to be used in the main routes file
module.exports = router;
