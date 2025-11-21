const Discapacity = require("../models/discapacity.model");

exports.addDiscapacities = async (req, res) => {
  try {
    const { idDiscapacidad, nombre, descripcion } = req.body;

    const discapacidad = new Discapacity(
      idDiscapacidad || null,
      nombre || "",
      descripcion || ""
    );

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
    res.status(500).json({ error: error.message });
  }
};

exports.modifyDiscapacities = async (req, res) => {
  try {
    const { idDiscapacidad } = req.params;
    const { nombre, descripcion } = req.body;

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
        affectedRows: result[0]?.affectedRows || result.affectedRows
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDiscapacities = async (req, res) => {
  try {
    const { idDiscapacidad } = req.params;

    const result = await Discapacity.delete(idDiscapacidad);

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: "Discapacidad no encontrada." });
    }

    res.status(200).json({ affectedRows: result.affectedRows });

  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.viewDiscapacities = async (req, res) => {
  try {
    const list = await Discapacity.getDiscapacities();
    res.status(200).json(list);
    console.log(list);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch discapacities list." });
  }
};

exports.viewOneDiscapacity = async (req, res) => {
  try {
    const { idDiscapacidad } = req.params;
    const discapacidad = await Discapacity.getOneDiscapacity(idDiscapacidad);

    res.status(200).json(discapacidad);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch discapacidad." });
  }
};

exports.searchDiscapacities = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ message: "El nombre es requerido." });
    }

    const results = await Discapacity.findByName(nombre);

    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontraron discapacidades con ese nombre." });
    }

    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({ message: "Error al buscar discapacidades.", error: error.message });
  }
};
