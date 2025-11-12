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
exports.filterOrderSupplies = async (request, response) => {
    try {
        console.log("BODY: ", request.body);
        const filters  = request.body;
        const supplies = await Supplies.filterOrder(filters);
        console.log("SUPPLIES", supplies);
        response.status(200).json(supplies);
    } catch (error) {
        console.error("Error filtering supplies: ", error);
        response.status(500).json({ message: "Error filtering supplies." });
    }
};

// Get supply categories, measures and workshops for filters
exports.getFilterData = async (request, response) => {
    try {
        const filterData = await Supplies.getFiltersData();
        response.status(200).json(filterData);
    } catch (error) {
        console.error("Error fetching filter data: ", error);
        response.status(500).json({ message: "Failed to fetch filter data." });
    }
}

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

// softdelete a supply (US: delete supply)
exports.deleteOneSupply = async (request, response) => {
    try {
        // get the supply id from request body
        const idInsumo = request.body.id

        // call the model method to delete the supply
        const result = await Supplies.delete(idInsumo);

        // send 200 if deleted, 404 if not found
        response.status(result.success ? 200:404).json(result)
    } catch (error) {
        console.error()

        // return 500 internal server error response
        response.status(500).json({
            succes: false,
            message: "Failed to delete a supply", 
            error,
        });
    }
};
