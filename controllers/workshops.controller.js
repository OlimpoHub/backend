const Workshops = require("../models/workshops.model");

exports.addWorkshops = async (request, response) => {
  try {
    const { 
      idTaller, 
      nombreTaller, 
      horaEntrada, 
      horaSalida, 
      estatus, 
      idUsuario,
      descripcion,
      fecha,
      url,
      videoCapacitacion
    } = request.body;

    const taller = new Workshops(
      idTaller || null,
      nombreTaller || "",
      horaEntrada || "",
      horaSalida || "",
      estatus || "1",
      idUsuario || null,
      descripcion || "",
      fecha || "",
      url || "",
      videoCapacitacion || ""
    );

    const result = await taller.save();

    response.status(201).json({
      message: "Taller agregado correctamente",
      data: {
        idTaller: taller.idTaller,
        nombreTaller,
        horaEntrada,
        horaSalida,
        estatus,
        idUsuario,
        descripcion,
        fecha,
        url,
        videoCapacitacion
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
      url,
      videoCapacitacion
    } = request.body;

    const result = await Workshops.update(
      idTaller,
      nombreTaller,
      horaEntrada,
      horaSalida,
      estatus,
      descripcion,
      fecha,
      url,
      videoCapacitacion
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
          ...(url && { url }),
          ...(videoCapacitacion && {videoCapacitacion})
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


// softdelete a Workshop (US: delete workshop)
exports.deleteWorkshops = async (request, response) => {
    try {
        // get the workshop id from request body
        const idTaller = request.body.id

        // call the model method to delete the workshop
        const result = await Workshops.delete(idTaller);

        // send 200 if deleted, 404 if not found
        response.status(result.success ? 200:404).json(result)
    } catch (error) {
        console.error()

        // return 500 internal server error response
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


