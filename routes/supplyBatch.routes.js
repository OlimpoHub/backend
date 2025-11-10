// Import the Express library to create routes
const express = require("express");

// Create a new router instance to define endpoints for supply batches
const router = express.Router();

// Import the supply batch controller that contains all related logic
const supplyBatchController = require("../controllers/supplyBatch.controller");

/**
 * GET /
 * Retrieves all supply batches.
 * Example: GET http://localhost:3000/supplybatch
 */
router.get("/", supplyBatchController.getSupplyBatch);

/**
 * GET /:idInsumo
 * Retrieves a specific supply batch by its supply ID.
 * Example: GET http://localhost:3000/supplybatch/5
 */
router.get("/:idInsumo", supplyBatchController.getOneSupplyBatch);

/**
 * POST /addBatch
 * Adds a new supply batch to the inventory.
 * Example: POST http://localhost:3000/supplybatch/addBatch
 * Body: { idInsumo: 3, cantidad: 10, fechaCaducidad: "2025-10-20" }
 */
router.post("/addBatch", supplyBatchController.addSupply);

/**
 * DELETE /:idInventario
 * Deletes a specific supply batch by its inventory ID.
 * Example: DELETE http://localhost:3000/supplybatch/8
 */
router.delete("/:idInventario", supplyBatchController.deleteSupplyBatch);

// Export the router to be used in the main application
module.exports = router;
