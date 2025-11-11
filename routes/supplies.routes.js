const express = require("express");
const router = express.Router();

const suppliesController = require("../controllers/supplies.controller");

// Define a GET endpoint to retrieve all supplies
router.get("/", suppliesController.getSupplies);
router.post("/search", suppliesController.searchSupplies);
router.post("/add", suppliesController.addOneSupply);

// Define a Post endpoint to delete a supply (US: Delete Supply)
router.post("/delete", suppliesController.deleteOneSupply);

// Define a GET endpoint to retrieve supply categories, measures and workshops
router.get("/filter/data", suppliesController.getFilterData);

// Define a POST endpoint to filter or order supplies
router.post("/filter", suppliesController.filterOrderSupplies);


// Export the router to be used in the main routes file
module.exports = router;
