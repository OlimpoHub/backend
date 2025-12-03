const Discapacity = require("../models/discapacity.model");

// Add a new disability
exports.addDiscapacities = async (req, res) => {
    try {   
        const { idDiscapacidad, nombre, descripcion } = req.body;

        // Create a new disability instance
        const discapacidad = new Discapacity(
            idDiscapacidad || null,
            nombre || "",
            descripcion || ""
        );

        // Save into database
        await discapacidad.save();

        res.status(201).json({
            message: "Discapacidad agregada correctamente",
            data: {
                idDiscapacidad: discapacidad.idDiscapacidad,
                nombre,
                descripcion
            }
        });

    } catch (error) {
        // Internal server error
        res.status(500).json({ error: error.message });
    }
};

// Modify an existing disability
exports.modifyDiscapacities = async (req, res) => {
    try {
        const { idDiscapacidad } = req.params;
        const { nombre, descripcion } = req.body;

        // Update disability record
        const result = await Discapacity.update(
            idDiscapacidad,
            nombre,
            descripcion
        );

        res.status(200).json({
            message: "Discapacidad modificada correctamente",
            data: {
                idDiscapacidad,
                modifiedFields: {
                    ...(nombre && { nombre }),
                    ...(descripcion && { descripcion })
                },
                // Adapt to MySQL driver variations
                affectedRows: result[0]?.affectedRows || result.affectedRows
            }
        });

    } catch (error) {
        // Internal server error
        res.status(500).json({ error: error.message });
    }
};

// Delete a disability
exports.deleteDiscapacities = async (req, res) => {
    try {
        const { idDiscapacidad } = req.params;

        // Execute delete operation
        const result = await Discapacity.delete(idDiscapacidad);

        // If no record was deleted
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: "Discapacidad no encontrada." });
        }

        res.status(200).json({ affectedRows: result.affectedRows });

    } catch (error) {
        // General server error
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

// Get all disabilities
exports.viewDiscapacities = async (req, res) => {
    try {
        // Retrieve complete list
        const list = await Discapacity.getDiscapacities();
        res.status(200).json(list);
    } catch (error) {
        // Failed request
        res.status(500).json({ message: "Error al obtener la lista de discapacidades." });
    }
};

// Get a single disability by ID
exports.viewOneDiscapacity = async (req, res) => {
    try {
        const { idDiscapacidad } = req.params;

        // Retrieve disability by ID
        const discapacidad = await Discapacity.getOneDiscapacity(idDiscapacidad);

        res.status(200).json(discapacidad);

    } catch (error) {
        // Error during fetch
        res.status(500).json({ message: "Error al obtener la discapacidad." });
    }
};

// Search disabilities by name
exports.searchDiscapacities = async (req, res) => {
    try {
        const { nombre } = req.body;

        // Validate required field
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ message: "El nombre es requerido." });
        }

        // Search disabilities
        const results = await Discapacity.findByName(nombre);

        // No matches found
        if (results.length === 0) {
            return res.status(404).json({ message: "No se encontraron discapacidades con ese nombre." });
        }

        res.status(200).json(results);

    } catch (error) {
        // Error while searching
        res.status(500).json({
            message: "Error al buscar discapacidades.",
            error: error.message
        });
    }
};
