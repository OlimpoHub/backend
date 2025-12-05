const Workshops = require("../models/workshops.model");

/**
 * Converts a date string to SQL format (yyyy-mm-dd).
 * Accepts formats: dd/mm/yyyy or yyyy-mm-dd.
 * Returns SQL formatted date or null if invalid.
 */
function convertirFechaSQL(fechaStr) {
  if (!fechaStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    return fechaStr;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(fechaStr)) {
    const [dia, mes, anio] = fechaStr.split("/");
    return `${anio}-${mes}-${dia}`;
  }
  return null;
}

/**
 * POST /workshops/add
 * Creates a new workshop record in the database.
 */
exports.addWorkshops = async (request, response) => {
  try {
    let { 
      idTaller, 
      nombreTaller, 
      horaEntrada, 
      horaSalida, 
      estatus, 
      idUsuario,
      descripcion,
      fecha,
      Fecha,
      url,
      URL
    } = request.body;

    fecha = fecha || Fecha || null;
    url = url || URL || null;

    const fechaSQL = convertirFechaSQL(fecha);

    if (!fechaSQL) {
      return response.status(400).json({
        error: "Invalid date format. Use dd/mm/yyyy or yyyy-mm-dd."
      });
    }

    const taller = new Workshops(
      idTaller || null,
      nombreTaller || "",
      horaEntrada || null,
      horaSalida || null,
      estatus || "1",
      idUsuario || null,
      descripcion || "",
      fechaSQL, 
      url
    );

    await taller.save();

    response.status(201).json({
      message: "Workshop added successfully",
      data: {
        idTaller,
        nombreTaller,
        horaEntrada,
        horaSalida,
        estatus,
        idUsuario,
        descripcion,
        fecha: fechaSQL,
        url
      }
    });

  } catch (error) {
    console.error("Error in addWorkshops():", error);
    response.status(500).json({ error: error.message });
  }
};

/**
 * POST /workshops/modify/:idTaller
 * Updates an existing workshop by ID.
 */
exports.modifyWorkshops = async (request, response) => {
  try {
    const { idTaller } = request.params;
    let { 
      nombreTaller, 
      horaEntrada, 
      horaSalida, 
      estatus, 
      descripcion, 
      Fecha, 
      URL,
      idUsuario
    } = request.body;

    Fecha = Fecha || Fecha || null;
    URL = URL || URL || null;

    const fechaSQL = convertirFechaSQL(Fecha);

    if (!fechaSQL) {
      return response.status(400).json({
        error: "Invalid date format. Use dd/mm/yyyy or yyyy-mm-dd."
      });
    }

    const result = await Workshops.update(
      idTaller,
      nombreTaller,
      horaEntrada,
      horaSalida,
      estatus,
      descripcion,
      fechaSQL,
      URL,
      idUsuario
    );

    response.status(200).json({
      message: "Workshop updated successfully",
      data: {
        idTaller,
        modifiedFields: {
          ...(nombreTaller && { nombreTaller }),
          ...(horaEntrada && { horaEntrada }),
          ...(horaSalida && { horaSalida }),
          ...(estatus !== undefined && { estatus }),
          ...(descripcion && { descripcion }),
          ...(Fecha && { Fecha }),
          ...(URL && { URL }),
          ...(idUsuario && { idUsuario })
        },
        affectedRows: result[0]?.affectedRows || result.affectedRows
      }
    });

  } catch (error) {
    console.error("Error in modifyWorkshops():", error);
    response.status(500).json({
      error: error.message
    });
  }
};

/**
 * POST /workshops/delete
 * Performs a soft delete (sets status to 0).
 */
exports.deleteWorkshops = async (request, response) => {
  try {
    const idTaller = request.body.id;
    const result = await Workshops.delete(idTaller);

    response.status(result.success ? 200 : 404).json(result);

  } catch (error) {
    console.error("Error deleting workshop", error);
    response.status(500).json({
      success: false,
      message: "Failed to delete workshop",
      error,
    });
  }
};

/**
 * GET /workshops
 * Returns a list of active workshops.
 */
exports.viewWorkshops = async (request, response) => {
  try {
    const workshopList = await Workshops.getWorkshops();
    response.status(200).json(workshopList);
  } catch (error) {
    console.error("Error fetching workshop list:", error);
    response.status(500).json({ message: "Failed to fetch workshop list" });
  }
};

/**
 * GET /workshops/:idTaller
 * Retrieves detailed workshop information including beneficiaries.
 */
exports.viewOneWorkshop = async (request, response) => {
  try {
    const id = request.params.idTaller;
    const workshop = await Workshops.getOneWorkshop(id);
    response.status(200).json(workshop);
  } catch (error) {
    console.error("Error fetching workshop:", error);
    response.status(500).json({ message: "Failed to fetch workshop" });
  }
};

/**
 * GET /workshops/search?nameWorkshop=
 * Searches workshops by partial name match.
 */
exports.searchWorkshops = async (request, response) => {
  try {
    let { nameWorkshop } = request.query;

    if (nameWorkshop) {
      nameWorkshop = nameWorkshop
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    }

    const workshops = await Workshops.findWorkshop(nameWorkshop);

    return response.status(200).json(
      Array.isArray(workshops) ? workshops : []
    );

  } catch (error) {
    return response.status(500).json({
      error: error.message
    });
  }
};

/**
 * GET /workshops/filter/data
 * Retrieves filter options such as hours and dates.
 */
exports.getWorkshopsCategories = async (request, response) => {
  try {
    const categories = await Workshops.getWorkshopsCategories();
    response.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching filter data:", error);
    response.status(500).json({ message: "Failed to fetch filter data." });
  }
};

/**
 * POST /workshops/filter
 * Returns workshops filtered by hour, date, and sort order.
 */
exports.viewWorkshopsFiltered = async (request, response) => {
  try {
    const filters = request.body;
    const workshopsFiltered = await Workshops.getWorkshopsFiltered(filters);
    response.status(200).json(workshopsFiltered);
  } catch (error) {
    console.error("Error filtering workshops:", error);
    response.status(500).json({ message: "Error filtering workshops." });
  }
};
