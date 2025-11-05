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

// Search supplies by name
exports.searchSupplies = async (request, response) => {
    try {
        const { value } = request.body;
        const supplies = await Supplies.searchSupplies(value);
        response.status(200).json(supplies);
    } catch (error) {
        console.error("Error searching supplies: ", error);
    }
};

// Filter supplies by category, measure, or workshop
exports.filterSupplies = async (request, response) => {
    try {
        const { type, value } = request.body;
        const supplies = await Supplies.filter(type, value);
        response.status(200).json(supplies);
    } catch (error) {
        console.error("Error filtering supplies: ", error);
    }
};

// Order supplies by name (asc or desc)
exports.orderSupplies = async (request, response) => {
    try {
        const { value } = request.body;
        const supplies = await Supplies.orderSupplies(value);
        response.status(200).json(supplies);
    } catch (error) {
        console.error("Error ordering supplies: ", error);
    }
};

exports.addOneSupply = async (req, res) => {
    try {
        console.log(req.body);
        const supply = new Supplies(
            req.body.idTaller,
            req.body.nombre,
            req.body.unidadMedida,
            req.body.idCategoria,
            req.body.imagenInsumo,
            req.body.status
        );

        const result = await supply.save();
        res.status(201).json({ message: "Supply added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to add a supply", err });
    }
};
