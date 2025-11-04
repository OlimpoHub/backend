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
  const new_externalCollab = new externalCollabs(
    request.body.nombre,
    request.body.apellidos,
    request.body.fechaNacimiento,
    request.body.telefono,
    request.body.puesto,
    request.body.email,
    request.body.fechaIngreso,
    request.body.ubicacion,
    request.body.modalidad,
    request.body.curp,
    request.body.rfc
  );

  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  const foto = "link";
  argon2.hash(password)
    .then(hashedPassword => {
      const firstPassword = 'first' + hashedPassword;
      return new_Colab.save(firstPassword,foto);
    })
    .then(([rows]) => {
      if (rows.length === 0)
        throw new Error("No se encontró el colaborador insertado.");
      const idcolab = rows[0].id_colaborador;

      const new_equipo = new Equipo(
        request.body.id_departamento,
        request.body.id_rol
      );
      return new_equipo.save(idcolab);
    })
    .then(() => {
      request.session.successData = {
        email: request.body.email,
        password: password,
      };

      response.redirect("/view_collabs");
    })
    .catch((error) => {
      console.error(error);
      response.redirect("/view_collabs?error=true&message=ER_DUP_ENTRY");
    });
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
