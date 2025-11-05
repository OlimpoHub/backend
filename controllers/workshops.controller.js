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

        // Convertir BigInt a string (serialización)
        const serializedResult = JSON.parse(JSON.stringify(result, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
};