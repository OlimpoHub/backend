const Supplies = require("../models/supplies.model");

exports.getSupplies = async (request, response) => {
    try {
        const supplies = await Supplies.fetchAll();
        response.status(200).json(supplies);
    } catch (error) {
        console.error("Error fetching supplies:", error);
        response.status(500).json({ message: "Failed to fetch supplies." });
    }
};
