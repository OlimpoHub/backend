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