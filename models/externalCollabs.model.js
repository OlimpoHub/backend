const bodyParser = require('body-parser');
const db = require('../util/database')
module.exports = class Colaborador {
  constructor(
    externalCollab_name,
    externalCollab_lastname1,
    externalCollab_lastename2,
    externalCollab_fechaNacimiento,
    externalCollab_carrera,
    externalCollab_correoElectronico,
    externalCollab_contraseña,
    externalCollab_telefono,
    externalCollab_estatus,
    externalCollab_reglamentoInterno,
    externalCollab_copiaINE,
    externalCollab_avisoConfidencialidad,
    externalCollab_foto
  ) {
    this.nombre = externalCollab_nombre;
    this.apellidoPaterno = externalCollab_apellidoPaterno;
    this.apellidoMaterno = externalCollab_apellidoMaterno;
    this.fechaNacimiento = externalCollab_fechaNacimiento;
    this.carrera = externalCollab_carrera;
    this.correo = externalCollab_correoElectronico;
    this.contraseña = externalCollab_contraseña;
    this.telefono = externalCollab_telefono;
    this.estatus = externalCollab_estatus;
    this.modalidad = externalCollab_reglamentoInterno;
    this.curp = externalCollab_copiaINE;
    this.rfc = externalCollab_avisoConfidencialidad;
    this.foto = externalCollab_foto;
  }
   
   
   save(hashedPassword, foto) {
    return db
      .execute(
        `INSERT INTO colaborador (id_colaborador, nombre, apellidos, fechaNacimiento,
          telefono, puesto, email, contrasena, fechaIngreso, ubicacion, modalidad, foto, curp, rfc)
          VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          this.nombre,
          this.apellidos,
          this.fechaNacimiento,
          this.telefono,
          this.puesto,
          this.email,
          hashedPassword,
          this.fechaIngreso,
          this.ubicacion,
          this.modalidad,
          foto,
          this.curp,
          this.rfc,
        ]
      )
      .then(() => {
        return db.execute(
          "SELECT id_colaborador FROM colaborador WHERE email = ?",
          [this.email]
        );
      });
  }


}