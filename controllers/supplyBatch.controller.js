const SupplyBatch = require("../models/supplyBatch.model")

exports.getSupplyBatch = async (req, res) => {
    try {
        const supplyBatchList = await SupplyBatch.fetchAll();
        res.status(200).json(supplyBatchList);
    } catch(err) {
        console.log("Error fetching supply batch ", err);
        res.status(500).json({message: "Failed to fetch supply batch"});
    }
}

exports.getOneSupplyBatch = async (req, res) => {
    try {
        const id = req.params.idInsumo;
        // console.log(id);
        const supplyBatch = await SupplyBatch.fetchOne(id);
        const { idInsumo: idInsumo, nombre, unidadMedida } = supplyBatch[0];
        const supplyBatchJson = supplyBatch.map(r => ({
            cantidad: r.cantidad,
            FechaCaducidad: r.FechaCaducidad
        }));

        res.status(200)
            .json({ idInsumo: idInsumo, nombre, unidadMedida, supplyBatchJson });
    } catch(err) {
        console.log("Error fetching one supply batch", err);
        res.status(500).json({message: "Failed to fetch one supply batch"});
    }
}