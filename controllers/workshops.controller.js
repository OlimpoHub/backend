const Workshops = require("../models/workshops.model");

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
        error: "Formato de fecha inválido. Usa dd/mm/yyyy o yyyy-mm-dd."
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

    const result = await taller.save();

    response.status(201).json({
      message: "Taller agregado correctamente",
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
    console.error("Error en addWorkshops():", error);
    response.status(500).json({ error: error.message });
  }
};

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
    console.log(request.body)

    Fecha = Fecha || Fecha || null;
    URL = URL || URL || null;

    const fechaSQL = convertirFechaSQL(Fecha);

    if (!fechaSQL) {
      return response.status(400).json({
        error: "Formato de fecha inválido. Usa dd/mm/yyyy o yyyy-mm-dd."
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
      message: "Taller modificado correctamente",
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
          ...(idUsuario && { idUsuario})
        },
        affectedRows: result[0]?.affectedRows || result.affectedRows
      }
    });

  } catch (error) {
    console.error("Error en modifyWorkshops():", error);
    response.status(500).json({
      error: error.message
    });
  }
}

// softdelete a Workshop
exports.deleteWorkshops = async (request, response) => {
  try {
      const idTaller = request.body.id
      const result = await Workshops.delete(idTaller);

      response.status(result.success ? 200:404).json(result)
  } catch (error) {
      console.error()
      response.status(500).json({
          succes: false,
          message: "Failed to delete a workshop", 
          error,
      });
  }
};

exports.viewWorkshops = async (request, response) => {
  try{
      const workshopList = await Workshops.getWorkshops();
      response.status(200).json(workshopList);
  } catch(error) {
      console.error("Error fetching workshop list: ", error);
      response.status(500).json({message: "Failed to fetch workshop list"});
  }
}

exports.viewOneWorkshop = async (request, response) => {
  try{
      const id = request.params.idTaller;
      const workshop = await Workshops.getOneWorkshop(id);
      response.status(200).json(workshop);
      console.log(workshop);
  } catch(error) {
      console.error("Error fetching workshop: ", error);
      response.status(500).json({message: "Failed to fetch workshop"});
  }
}

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

exports.getWorkshopsCategories = async (request, response) => {
  try{
    const categories = await Workshops.getWorkshopsCategories();
    response.status(200).json(categories);
  } catch(error){
    console.error("Error fetching filter data: ", error);
    response.status(500).json({ message: "Failed to fetch filter data." });
  }
}

exports.viewWorkshopsFiltered = async (request, response) => {
  try {
      const filters  = request.body;
      const workshopsFiltered = await Workshops.getWorkshopsFiltered(filters);
      response.status(200).json(workshopsFiltered);
  } catch(error) {
      console.error("Error filtering Workshops: ", error);
      response.status(500).json({ message: "Error filtering Workshops." });
  }
}
