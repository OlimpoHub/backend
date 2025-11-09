const Workshops = require("../models/workshops.model");

function parseTimeTo24h(timeStr) {
  if (!timeStr) return null;

  const timeRegex24h = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
  if (timeRegex24h.test(timeStr)) {
    return timeStr.length === 5 ? timeStr + ":00" : timeStr;
  }

  const match12h = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s?(AM|PM)$/i);
  if (match12h) {
    let hour = parseInt(match12h[1], 10);
    const minutes = match12h[2];
    const seconds = match12h[3] || "00"; 
    const period = match12h[4].toUpperCase();

    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const hh = hour.toString().padStart(2, "0");
    return `${hh}:${minutes}:${seconds}`;
  }

  throw new Error(`Formato de hora inválido: ${timeStr}`);
}

function formatDateToSQL(date) {
  if (!date) date = new Date();

  if (date instanceof Date) {
    if (date.getTime() === 0) date = new Date();
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  throw new Error(`Formato de fecha inválido: ${date}`);
}

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

    const horaEntrada24 = parseTimeTo24h(horaEntrada);
    const horaSalida24 = parseTimeTo24h(horaSalida);
    const fechaSQL = formatDateToSQL(fecha);

    const taller = new Workshops(
      idTaller || null,
      idCapacitacion || null,
      nombreTaller,
      horaEntrada24,
      horaSalida24,
      estatus || 1,
      idUsuario || null,
      horarioTaller || null,
      fechaSQL,
      url || null
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
        const id = request.params.idWorkshop;
        const workshop = await Workshops.getOneWorkshop(id);
        response.status(200).json(workshop);
    } catch(error) {
        console.error("Error fetching workshop: ", error);
        response.status(500).json({message: "Failed to fetch workshop"});
    }
}
