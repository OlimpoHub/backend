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
      descripcion,
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
      descripcion || "",
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
        descripcion,
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
      descripcion, 
      fecha, 
      url 
    } = request.body;

    const result = await Workshops.update(
      idTaller,
      nombreTaller,
      horaEntrada,
      horaSalida,
      estatus,
      descripcion,
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
          ...(descripcion && { descripcion }),
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

exports.searchWorkshops = async (request, response) => {
    try {
        const { nameWorkshop } = request.query;

        const workshops = await Workshops.findWorkshop(nameWorkshop);

        return response.status(200).json(Array.isArray(workshops) ? workshops : []);
        
    } catch (error) {
        return response.status(500).json({
            error: error.message
        });
    }
};


/* Controller function to get all diferent results by date or entry hour*/
exports.getWorkshopsCategories = async (request, response) => {
  try{
    const categories = await Workshops.getWorkshopsCategories();
    response.status(200).json(categories);
  } catch(error){
    console.error("Error fetching filter data: ", error);
    response.status(500).json({ message: "Failed to fetch filter data." });
  }
}

/* Controller function to filter the workshops depending on a type*/
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


