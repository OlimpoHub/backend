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
 * DELETE /:idInventario
 * Deletes a specific supply batch by its inventory ID.
 */
router.delete("/:idInventario", supplyBatchController.deleteSupplyBatch);

/**
 * POST /filter
 * Filters supply batches by expiration date or acquisition type.
 */
router.post("/filter", supplyBatchController.filterSupplyBatch);

/**
 * POST /order
 * Orders supply batches in ascending and descending order.
 */
router.post("/order", supplyBatchController.orderSupplyBatch);

// Export the router to be used in the main application
module.exports = router;
