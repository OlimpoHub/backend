const Discapacity = require("../models/discapacity.model");

exports.addDiscapacities = async (req, res) => {
  try {
    const {
      idDiscapacidad,
      nombre,
      descripcion,
      estatus
    } = req.body;

    const discapacidad = new Discapacity(
      idDiscapacidad || null,
      nombre || "",
      descripcion || "",
      estatus || "1"
    );

    const result = await discapacidad.save();

    res.status(201).json({
      message: "Discapacidad agregada correctamente",
      data: {
        idDiscapacidad: discapacidad.idDiscapacidad,
        nombre,
        descripcion,
        estatus
      }
    });

  } catch (error) {
    console.error("Error en addDiscapacities():", error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.modifyDiscapacities = async (req, res) => {
  try {
    const { idDiscapacidad } = req.params;
    const { nombre, descripcion, estatus } = req.body;

    const result = await Discapacity.update(
      idDiscapacidad,
      nombre,
      descripcion,
      estatus
    );

    res.status(200).json({
      message: "Discapacidad modificada correctamente",
      data: {
        idDiscapacidad,
        modifiedFields: {
          ...(nombre && { nombre }),
          ...(descripcion && { descripcion }),
          ...(estatus !== undefined && { estatus })
        },
        affectedRows: result[0]?.affectedRows || result.affectedRows
      }
    });

  } catch (error) {
    console.error("Error en modifyDiscapacities():", error);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.deleteDiscapacities = async (req, res) => {
  try {
    const { idDiscapacidad } = req.params;

    const result = await Discapacity.changestatus(idDiscapacidad);

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: "Discapacidad no encontrada." });
    }

    return res.status(200).json({
      affectedRows: result.affectedRows
    });

  } catch (error) {
    console.error("Error en deleteDiscapacities():", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};


exports.viewDiscapacities = async (req, res) => {
  try {
    const list = await Discapacity.getDiscapacities();
    res.status(200).json(list);
  } catch (error) {
    console.error("Error fetching discapacities list:", error);
    res.status(500).json({ message: "Failed to fetch discapacities list." });
  }
};

exports.viewOneDiscapacity = async (req, res) => {
  try {
    const { idDiscapacidad } = req.params;

    const discapacidad = await Discapacity.getOneDiscapacity(idDiscapacidad);

    res.status(200).json(discapacidad);
  } catch (error) {
    console.error("Error fetching discapacidad:", error);
    res.status(500).json({ message: "Failed to fetch discapacidad." });
  }
};

exports.searchDiscapacities = async (req, res) => {
  try {
    const { nameDiscapacity } = req.query;

    if (!nameDiscapacity || nameDiscapacity.trim() === "") {
      return res.status(400).json({ message: "The name is required" });
    }

    const discapacities = await Discapacity.findDiscapacity(nameDiscapacity);

    if (discapacities.length === 0) {
      return res.status(404).json({ message: "No disabilities found with that name." });
    }

    res.status(200).json(discipacities);

  } catch (error) {
    console.error("Error searching discapacidad:", error);
    res.status(500).json({
      message: "Error searching discapacidad",
      error: error.message
    });
  }
};

