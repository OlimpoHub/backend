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
        const { 
            adquisicion,
            FechaCompra,
            FechaCaducidad,
            cantidad,
            idInsumo
        } = request.body;

        console.log(request.body);
        await SupplyBatch.addSupply(
            idInsumo,
            cantidad,
            FechaCaducidad,
            adquisicion,
            FechaCompra
        );
        response.status(200).json({ message: "Supply added successfully" });
    } catch (error) {
        console.error("Error adding supply: ", error);
        response.status(500).json({ message: "Failed to add supply" });
    }
};

/**
 * Deletes all supply batch records with a specific expiration date for a given supply.
 */
exports.deleteSupplyBatch = async (request, response) => {
    try {
        const { idInsumo, fechaCaducidad } = request.body;
        const result = await SupplyBatch.delete(idInsumo, fechaCaducidad);
        response.status(result.success ? 200 : 404).json(result);
    } catch (error) {
        response.status(500).json({
            success: false,
            message: "Failed to delete supply batch",
            error,
        });
    }
};

/**
 * Filters supply batches by expiration date or acquisition type.
 */
exports.filterOrderSupplyBatch = async (request, response) => {
    try {
        console.log("BODY: ", request.body);
        const filters  = request.body;
        const supplyBatch = await SupplyBatch.filterOrder(filters);
        console.log("SUPPLY BATCH", supplyBatch);
        response.status(200).json(supplyBatch);
    } catch (error) {
        console.error("Error filtering supply Batch: ", error);
        response.status(500).json({ message: "Error filtering supply Batch." });
    }
};

// Get supply categories, measures and workshops for filters
exports.getFilterData = async (request, response) => {
    try {
        const filterData = await SupplyBatch.getFiltersData();
        response.status(200).json(filterData);
    } catch (error) {
        console.error("Error fetching filter data: ", error);
        response.status(500).json({ message: "Failed to fetch filter data." });
    }
}

// Get Acquisition Types 
exports.getAcquisitionTypes = async (request, response) => {
    try {
        const acquisitionTypes = await SupplyBatch.fetchAcquisitionTypes();
        response.status(200).json(acquisitionTypes);
    } catch (error) {
        console.error("Error fetching acquisition types: ", error);
        response.status(500).json({ message: "Failed to fetch acquisition types." });
    }
}

/**
 * Modify supply batches by etheir ID
 */ 
exports.modifySupplyBatch = async (request, response) => {
    try {
        console.log(request.params);
        console.log(request.body);
        let { idSupplyBatch } = request.params; 
        console.log(idSupplyBatch);
        
        if (idSupplyBatch && idSupplyBatch.startsWith(':')) {
            idSupplyBatch = idSupplyBatch.replace(':', '');
        }
        console.log(idSupplyBatch);
        const { 
            adquisicion,
            FechaCompra,
            FechaCaducidad,
            cantidad,
            idInsumo
        } = request.body;
        const result = await SupplyBatch.modifySupplyBatch(
            idSupplyBatch,
            idInsumo,
            cantidad,
            FechaCaducidad,
            adquisicion,
            FechaCompra
        )

        response.status(200).json({ message: "Supply modified successfully" });
    } catch (error) {
        console.error("Error en modifySupplyBatch():", error);
        response.status(500).json({
        error: error.message
        });
    }
};

exports.getSupplyBatchOne = async (request, response) => {
    try {
        let { idSupplyBatch } = request.params; 
        if (idSupplyBatch && idSupplyBatch.startsWith(':')) {
            idSupplyBatch = idSupplyBatch.replace(':', '');
        }

        const result = await SupplyBatch.getSupplyBatchOne(
            idSupplyBatch,
        )
        response.status(200).json(result);
    } catch (error) {
        console.error("Error en getSupplyBatchOne():", error);
        response.status(500).json({
            error: error.message
        });
    }
}

exports.getSupplyBatchDates = async (request, response) => {
    try {
        let { date, idInsumo } = request.params;
        if (date && date.startsWith(':')) date = date.replace(':', '');
        if (idInsumo && idInsumo.startsWith(':')) idInsumo = idInsumo.replace(':', '');

        const result = await SupplyBatch.getSupplyBatchDates(
            date,
            idInsumo,
        )
        response.status(200).json(result);
    } catch (error) {
        console.error("Error en getSupplyBatchDates():", error);
        response.status(500).json({
            error: error.message
        });
    }
}