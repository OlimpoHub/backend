const SupplyBatch = require("../models/supplyBatch.model")

exports.getSupplyBatch = async (request, response) => {
    try {
        const supplyBatchList = await SupplyBatch.fetchAll();
        response.status(200).json(supplyBatchList);
    } catch(err) {
        console.log("Error fetching supply batch ", err);
        response.status(500).json({message: "Failed to fetch supply batch"});
    }
}