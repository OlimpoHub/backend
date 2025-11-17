// Import the Express library to create routes
const express = require("express");

// Create a new router instance to define endpoints for supply batches
const router = express.Router();

// Import the supply batch controller that contains all related logic
const supplyBatchController = require("../controllers/supplyBatch.controller");

/**
 * GET /
 * Retrieves all supply batches.
 */
router.get("/", supplyBatchController.getSupplyBatch);

/**
 * GET /:idInsumo
 * Retrieves a specific supply batch by its supply ID.
 */
router.get("/:idInsumo", supplyBatchController.getOneSupplyBatch);

/**
 * POST /addBatch
 * Adds a new supply batch to the inventory.
 */
router.post("/addBatch", supplyBatchController.addSupply);

/**
 * DELETE
 * Deletes a specific supply batch by its expiration date.
 */
router.post("/delete", supplyBatchController.deleteSupplyBatch);

// Define a GET endpoint to retrieve supply batches expiration date and acquisition type
router.get("/filter/data", supplyBatchController.getFilterData);

// Define a POST endpoint to filter or order supply batches
router.post("/filter", supplyBatchController.filterOrderSupplyBatch);

// Define a GET endpoint to retrieve acquisition types
router.get("/acquisition/types", supplyBatchController.getAcquisitionTypes);

// Define a POST endpoint to modify one supply batch
router.post("/update/:idSupplyBatch", supplyBatchController.modifySupplyBatch);

// Export the router to be used in the main application
module.exports = router;
