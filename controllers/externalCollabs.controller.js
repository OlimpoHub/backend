const Supplies = require("../models/externalCollabs.model");

exports.getExternalCollabs = async (request, response) => {
    try {
        const externalCollabs = await externalCollabs.fetchAll();
        response.status(200).json(externalCollabs);
    } catch (error) {
        console.error("Error fetching supplies:", error);
        response.status(500).json({ message: "Failed to fetch supplies." });
    }
};

// Register a external collab
exports.postExternalCollabs = (request, response) => {
  const new_ExternalColab = new Usuario(
    request.body.nombre,
    request.body.apellidoPaterno,
    request.body.apellidoMaterno,
    request.body.fechaNacimiento,
    request.body.carrera,
    request.body.correoElectronico,
    request.body.telefono,
    request.body.estatus,
    request.body.reglamentoInterno,
    request.body.copiaINE,
    request.body.avisoConfidencialidad,
    request.body.foto
  );
}
