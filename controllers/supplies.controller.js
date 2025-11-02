const Supplies = require("../models/supplies.model");

// Controller function to handle the GET /supplies request
exports.getSupplies = async (request, response) => {
    try {
        // Retrieve all supplies from the model
        const supplies = await Supplies.fetchAll();

        // Respond with the list of supplies in JSON format
        response.status(200).json(supplies);
    } catch (error) {
        // Log and return an error response if the operation fails
        console.error("Error fetching supplies:", error);
        response.status(500).json({ message: "Failed to fetch supplies." });
    }
};