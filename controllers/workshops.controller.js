const Workshops = require("../models/workshops.model");

exports.addWorkshops = async (request, response) => {
  try {
    const { 
      idTaller, 
      idCapacitacion, 
      nombreTaller, 
      horaEntrada, 
      horaSalida, 
      estatus, 
      idUsuario,
      horarioTaller,
      fecha,
      url
    } = request.body;

    const taller = new Workshops(
      idTaller || null,
      idCapacitacion || null,
      nombreTaller || "",
      horaEntrada || "",
      horaSalida || "",
      estatus || "1",
      idUsuario || null,
      horarioTaller || "",
      fecha || "",
      url || ""
    );

    const result = await taller.save();

    response.status(201).json({
      message: "Taller agregado correctamente",
      data: {
        idTaller: taller.idTaller,
        idCapacitacion,
        nombreTaller,
        horaEntrada,
        horaSalida,
        estatus,
        idUsuario,
        horarioTaller,
        fecha,
        url
      }
    });

  } catch (error) {
    console.error("Error en addWorkshops():", error);
    response.status(500).json({
      error: error.message
    });
  }
};

exports.modifyWorkshops = async (request, response) => {
  try {
    const { idTaller } = request.params;
    const { 
      nombreTaller, 
      horaEntrada, 
      horaSalida, 
      estatus, 
      horarioTaller, 
      fecha, 
      url 
    } = request.body;

    const result = await Workshops.update(
      idTaller,
      nombreTaller,
      horaEntrada,
      horaSalida,
      estatus,
      horarioTaller,
      fecha,
      url
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
          ...(horarioTaller && { horarioTaller }),
          ...(fecha && { fecha }),
          ...(url && { url })
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

exports.deleteWorkshops = async (request, response) => {
  try {
    const { idTaller } = request.params;
    const result = await Workshops.changestatus(idTaller);

    if (!result || result.affectedRows === 0) {
      return response.status(404).json({ message: "Taller no encontrado." });
    }

    return response.status(200).json({
      affectedRows: result.affectedRows
    });

  } catch (error) {
    return response.status(500).json({ message: "Error interno del servidor." });
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
    } catch(error) {
        console.error("Error fetching workshop: ", error);
        response.status(500).json({message: "Failed to fetch workshop"});
    }
}
