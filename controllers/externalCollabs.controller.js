const externalCollabs = require("../models/externalCollabs.model");

exports.getExternalCollabs = async (request, response) => {
    try {
        const externalCollaborators = await externalCollabs.fetchAll();
        response.status(200).json(externalCollaborators);
    } catch (error) {
        console.error("Error fetching external collaborators:", error);
        response.status(500).json({ message: "Failed to fetch external collaborators." });
    }
};

exports.getExternalCollabsByID = async (request, response) => {
  try {
    const externalCollabId = await externalCollabs.fetchOneByID(request.params.id);
    response.status(200).json(externalCollabId);
  } catch (error) {
    console.error("Error fetching external collab by ID:", error);
    response.status(500).json({ message: "Failed to fetch external collab by ID." });
  }
};

exports.deleteExternalCollab = async (request, response) => {
  try {
    const idUsuario   = request.body.id;
    const result = await externalCollabs.delete(idUsuario);
    response.status(200).json(result);
  } catch (error) {
    console.error("Error deleting external collaborator:", error);
    response.status(500).json({ message: "Failed to delete external collaborator." });
  }
}
