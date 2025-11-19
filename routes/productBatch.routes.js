const express = require("express");
const router = express.Router();

const productBatchController = require("../controllers/productBatch.controller");

/**
 * GET /productBatch
 * @description Obtiene todos los lotes de productos con sus detalles
 * @returns {Array} Lista de lotes con:
 *  - Nombre: nombre del producto
 *  - imagen: URL de la imagen del producto
 *  - PrecioUnitario: precio base del producto
 *  - idProducto: identificador único del producto
 *  - Descripcion: descripción del producto
 *  - Disponible: si el producto está disponible (1) o no (0)
 *  - idInventario: identificador único del lote
 *  - CantidadProducida: cantidad del lote
 *  - PrecioVenta: precio de venta del lote
 *  - FechaCaducidad: fecha de caducidad (YYYY-MM-DD)
 *  - FechaRealizacion: fecha de producción (YYYY-MM-DD)
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
// Filtros separados
router.get("/filter/price", productBatchController.filterPricePb);
router.get("/filter/disponible", productBatchController.filterDisponiblePb);
router.get("/filter/date", productBatchController.filterDatePb);

router.post("/filter", productBatchController.filterPb);

/**
 * GET /productBatch/:idProductBatch
 * @description Obtiene los detalles de un lote específico
 * @param {string} idProductBatch - ID del producto a consultar
 * @returns {Object|Array} Detalles del lote o lotes del producto
 */
router.get("/:idProductBatch", productBatchController.getPbById);

/**
 * POST /productBatch
 * @description Crea un nuevo lote de producto
 * @param {Object} request.body - Datos del nuevo lote
 *  - idProducto: ID del producto (requerido)
 *  - PrecioVenta: precio de venta del lote (requerido)
 *  - CantidadProducida: cantidad producida (requerido)
 *  - FechaCaducidad: fecha de caducidad (opcional, YYYY-MM-DD)
 *  - FechaRealizacion: fecha de realización (opcional, YYYY-MM-DD)
 * @returns {Object} Lote creado con su idInventario generado
 */
router.post("/", productBatchController.addPb)

/**
 * PUT /productBatch/:idProductBatch
 * @description Actualiza un lote existente
 * @param {string} idProductBatch - ID del inventario a actualizar
 * @param {Object} request.body - Campos a actualizar
 *  - PrecioVenta: nuevo precio de venta (opcional)
 *  - CantidadProducida: nueva cantidad (opcional)
 *  - FechaCaducidad: nueva fecha de caducidad (opcional)
 *  - FechaRealizacion: nueva fecha de realización (opcional)
 * @returns {Object} Lote actualizado o 404 si no existe
 */
router.put("/:idProductBatch", productBatchController.updatePb)

/**
 * DELETE /productBatch/:idProductBatch
 * @description Elimina un lote del inventario
 * @param {string} idProductBatch - ID del inventario a eliminar
 * @returns {undefined} 204 si se eliminó, 404 si no existe
 */
router.delete("/:idProductBatch", productBatchController.removePb)

module.exports = router;

