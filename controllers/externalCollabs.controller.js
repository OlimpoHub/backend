const externalCollabs = require("../models/externalCollabs.model");
const generator = require("generate-password-browser");
const argon2 = require('argon2');


exports.getExternalCollabs = async (request, response) => {
    try {
        const externalCollaborators = await externalCollabs.fetchAll();
        response.status(200).json(externalCollaborators);
    } catch (error) {
        console.error("Error fetching external collaborators:", error);
        response.status(500).json({ message: "Failed to fetch external collaborators." });
    }
};

// Register a external collab
exports.registerExternalCollabs = (request, response) => {
  const new_externalCollabs = new externalCollabs(
    request.body.externalCollab_roleId,
    request.body.externalCollab_name,
    request.body.externalCollab_lastName,
    request.body.externalCollab_secondLastName,
    request.body.externalCollab_birthDate,
    request.body.externalCollab_degree,
    request.body.externalCollab_email,
    request.body.externalCollab_phone,
    request.body.externalCollab_status,
    request.body.externalCollab_internalRegulation,
    request.body.externalCollab_idCopy,
    request.body.externalCollab_confidentialityNotice,
  );

  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  const photo = "link";
  argon2.hash(password)
    .then(hashedPassword => {
      const firstPassword = 'first' + hashedPassword;
      return new_externalCollabs.save(firstPassword,photo);
    })
    .then(() => {
      response.status(200).json({ 
        status: true ,
        message: "Succes to Register external collab."});
    })
    .catch((error) => {
    console.error("Error register external collab:", error);
    response.status(500).json({ 
      status: false,
      message: "Failed to register external collab." });
  });
};

//Modify externalCollab

exports.updateExternalCollabs = async (request, response) => {
  try {
    const idUsuario = request.body.id;
    const edit_externalCollabs = new externalCollabs(
    request.body.externalCollab_roleId,
    request.body.externalCollab_name,
    request.body.externalCollab_lastName,
    request.body.externalCollab_secondLastName,
    request.body.externalCollab_birthDate,
    request.body.externalCollab_degree,
    request.body.externalCollab_email,
    request.body.externalCollab_phone,
    request.body.externalCollab_status,
    request.body.externalCollab_internalRegulation,
    request.body.externalCollab_idCopy,
    request.body.externalCollab_confidentialityNotice,
  );

    await edit_externalCollabs.updateById(idUsuario);

    response.status(200).json({ 
        status: true ,
        message: "Succes to update external collab."});

  } catch (error) {
    console.error("Error updating external collaborator:", error);
    response.status(500).json({ 
      status: false,
      message: "Failed to update external collaborator." });
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
