const express = require("express");
const router = express.Router();

const productBatchController = require("../controllers/productBatch.controller");

/**
 * GET /productBatch
 * @description Retrieves all product batches with their details
 * @returns {Array} List of batches containing:
 * - Nombre: product name
 * - imagen: product image URL
 * - PrecioUnitario: product base price
 * - idProducto: unique product identifier
 * - Descripcion: product description
 * - Disponible: whether the product is available (1) or not (0)
 * - idInventario: unique batch identifier
 * - CantidadProducida: batch quantity
 * - PrecioVenta: batch sale price
 * - FechaCaducidad: expiration date (YYYY-MM-DD)
 * - FechaRealizacion: production date (YYYY-MM-DD)
 */
router.get("/", productBatchController.getAllPb);

/**
 * GET /productBatch/search?q=term
 * @description Search product batches by name or description
 */
router.get("/search", productBatchController.searchPb);

/**
 * GET /productBatch/order?orderBy=PrecioVenta&direction=DESC
 * @description Get product batches ordered by a field
 */
router.get("/order", productBatchController.getOrderedPb);

/**
 * GET /productBatch/filter?disponible=1&startDate=2025-01-01&endDate=2025-12-31
 * @description Filter product batches by availability and/or date range
 */
// Separate filters
router.get("/filter/price", productBatchController.filterPricePb);
router.get("/filter/disponible", productBatchController.filterDisponiblePb);
router.get("/filter/date", productBatchController.filterDatePb);

router.post("/filter", productBatchController.filterPb);

/**
 * GET /productBatch/:idProductBatch
 * @description Retrieves details of a specific batch
 * @param {string} idProductBatch - ID of the product to query
 * @returns {Object|Array} Details of the batch or product batches
 */
router.get("/:idProductBatch", productBatchController.getOnePb);

/**
 * POST /productBatch
 * @description Creates a new product batch
 * @param {Object} request.body - Data for the new batch
 * - idProducto: Product ID (required)
 * - PrecioVenta: Batch sale price (required)
 * - CantidadProducida: Quantity produced (required)
 * - FechaCaducidad: Expiration date (optional, YYYY-MM-DD)
 * - FechaRealizacion: Production date (optional, YYYY-MM-DD)
 * @returns {Object} Created batch with its generated idInventario
 */
router.post("/", productBatchController.addPb)

/**
 * PUT /productBatch/:idProductBatch
 * @description Updates an existing batch
 * @param {string} idProductBatch - ID of the inventory (batch) to update
 * @param {Object} request.body - Fields to update
 * - PrecioVenta: new sale price (optional)
 * - CantidadProducida: new quantity (optional)
 * - FechaCaducidad: new expiration date (optional)
 * - FechaRealizacion: new production date (optional)
 * @returns {Object} Updated batch or 404 if not found
 */
router.put("/:idProductBatch", productBatchController.updatePb)

/**
 * DELETE /productBatch/:idProductBatch
 * @description Deletes a batch from inventory
 * @param {string} idProductBatch - ID of the inventory (batch) to delete
 * @returns {undefined} 204 if deleted, 404 if not found
 */
router.delete("/:idProductBatch", productBatchController.removePb)

module.exports = router;

