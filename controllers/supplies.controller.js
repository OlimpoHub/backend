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
        const idTaller = req.body.idTaller ?? req.body.idWorkshop;
        const nombre = req.body.nombre ?? req.body.name;
        const unidadMedida = req.body.unidadMedida ?? req.body.measureUnit;
        const idCategoria = req.body.idCategoria ?? req.body.idCategory;
        const imagenInsumo = req.file ? req.file.path : (req.body.imagenInsumo || req.body.image);

        // Check if supply name already exists (case-insensitive)
        const nameExists = await Supplies.checkSupplyNameExists(nombre);
        if (nameExists) {
            return res
                .status(400)
                .json({ message: "A supply with this name already exists." });
        }

        const supply = new Supplies(
            idTaller,
            nombre,
            unidadMedida,
            idCategoria,
            imagenInsumo,
            req.body.status || 1
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

// Get id and name for both workshop and supplies
exports.getWorkshopAndSupplies = async (req, res) => {
    try {
        const data = await Supplies.getWorkshopAndSupplies();
        res.status(200).json(data);
    } catch(err) {
        console.error("Error fetching workshop and supplies: ", err);
        res.status(500)
            .json({ 
                message: "Failed to fetch workshop and supplies." 
            });
    }
}

// Gathers the idSupply from the route and the other parameters from the body
// sent in the Front, and updates the information of the supply using its id.
exports.updateOneSupply = async (req, res) => {
    try {
        const idSupply = req.params.idSupply;
        const idWorkshop = req.body.idTaller ?? req.body.idWorkshop;
        const name = req.body.nombre ?? req.body.name;
        const measureUnit = req.body.unidadMedida ?? req.body.measureUnit;
        const idCategory = req.body.idCategoria ?? req.body.idCategory;
        const imageSupply = req.file ? req.file.path : (req.body.imagenInsumo || req.body.image);
        const status = req.body.status;

        // Check if supply name already exists (case-insensitive), excluding the current supply
        const nameExists = await Supplies.checkSupplyNameExists(name, idSupply);
        if (nameExists) {
            return res
                .status(400)
                .json({ message: "A supply with this name already exists." });
        }

        const supply = new Supplies(
            idWorkshop,
            name,
            measureUnit,
            idCategory,
            imageSupply,
            status
        )
        
        const result = Supplies.updateOneSupply(idSupply, supply);
        res.status(200).json({ message: "Supply updated successfully." });
    } catch(err) {
        console.log("Error updating a supply: ", err);
        res.status(500).json({ message: "Failed to update a supply." });
    }
} 
