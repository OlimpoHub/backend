const SupplyBatch = require("../models/supplyBatch.model");

/**
 * Retrieves all supply batches from the database.
 */
exports.getSupplyBatch = async (req, res) => {
    try {
        const supplyBatchList = await SupplyBatch.fetchAll();
        res.status(200).json(supplyBatchList);
    } catch (err) {
        console.log("Error fetching supply batch ", err);
        res.status(500).json({ message: "Failed to fetch supply batch" });
    }
};

/**
 * Retrieves one supply batch by its supply ID.
 * Combines the general supply information with its related batch data
 * (quantity and expiration date).
 */
exports.getOneSupplyBatch = async (req, res) => {
    try {
        const id = req.params.idInsumo;
        console.log("Params", id);
        const supplyBatch = await SupplyBatch.fetchOne(id);

        const {
            idInsumo,
            nombre,
            unidadMedida,
            imagenInsumo,
            cantidad,
            nombreTaller,
            Descripcion,
            status,
        } = supplyBatch[0];
        const supplyBatchJson = supplyBatch.map((r) => ({
            cantidad: r.cantidad,
            FechaCaducidad: r.FechaCaducidad,
            adquisicion: r.adquisicion,
        }));

        res.status(200).json({
            idInsumo,
            nombre,
            unidadMedida,
            imagenInsumo,
            cantidad,
            nombreTaller,
            Descripcion,
            status,
            supplyBatchJson,
        });
    } catch (err) {
        console.log("Error fetching one supply batch", err);
        res.status(500).json({ message: "Failed to fetch one supply batch" });
    }
};

/**
 * Adds a new supply batch entry into the inventory.
 */
exports.addSupply = async (request, response) => {
    try {
        const { supplyId, quantity, expirationDate, acquisitionId } =
            request.body;
        await SupplyBatch.addSupply(
            supplyId,
            quantity,
            expirationDate,
            acquisitionId
        );
        response.status(200).json({ message: "Supply added successfully" });
    } catch (error) {
        console.error("Error adding supply: ", error);
        response.status(500).json({ message: "Failed to add supply" });
    }
};

/**
 * Deletes a specific supply batch record from the inventory.
 */
exports.deleteSupplyBatch = async (request, response) => {
    try {
        const idInventario = request.params.idInventario;
        const result = await SupplyBatch.delete(idInventario);
        response.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        console.error("Error deleting supply batch: ", error);
        response.status(500).json({
            success: false,
            message: "Failed to delete a supply batch",
            error,
        });
    }
};

/**
 * Filters supply batches by expiration date or acquisition type.
 */
exports.filterSupplyBatch = async (request, response) => {
    try {
        const { type, value } = request.body;
        const supplyBatch = await SupplyBatch.filter(type, value);
        response.status(200).json(supplyBatch);
    } catch (error) {
        console.error("Error filtering supply batch: ", error);
        response
            .status(500)
            .json({ message: "Failed to filter supply batches" });
    }
};
