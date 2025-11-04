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
      idUsuario 
    } = request.body;

    const taller = new Workshops(
      idTaller || null,
      idCapacitacion || null,
      nombreTaller,
      horaEntrada || null,
      horaSalida || null,
      estatus || 1,
      idUsuario || null
    );

    const result = await taller.save();

    response.status(201).json({
      data: {
        idTaller: taller.idTaller,
        idCapacitacion,
        nombreTaller,
        horaEntrada,
        horaSalida,
        estatus,
        idUsuario
      }
    });

  } catch (error) {
    response.status(500).json({
      error: error.message
    });
  }
};


exports.modifyWorkshops = async (request, response) => {
  try {
    const { idTaller } = request.params;
    const { nombreTaller, horaEntrada, horaSalida} = request.body;

    const result = await Workshops.update(
      idTaller,
      nombreTaller,
      horaEntrada,
      horaSalida
    );

    response.status(200).json({
      data: {
        idTaller,
        modifiedFields: {
          ...(nombreTaller && { nombreTaller }),
          ...(horaEntrada && { horaEntrada }),
          ...(horaSalida && { horaSalida })
        },
        affectedRows: result[0]?.affectedRows || result.affectedRows
      }
    });

  } catch (error) {
    response.status(500).json({
      error: error.message
    });
  }
};

