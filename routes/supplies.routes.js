const express = require("express");
const router = express.Router();

const suppliesController = require("../controllers/supplies.controller");

// Define a GET endpoint to retrieve all supplies
router.get("/", suppliesController.getSupplies);
router.post("/search", suppliesController.searchSupplies);
router.post("/filter", suppliesController.filterSupplies);
router.post("/order", suppliesController.orderSupplies);
router.post("/add", suppliesController.addOneSupply);

// Define a Post endpoint to delete a supply (US: Delete Supply)
router.post("/delete", suppliesController.deleteOneSupply);

// Export the router to be used in the main routes file
module.exports = router;
