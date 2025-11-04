const bodyParser = require('body-parser');
const database =  require('../utils/db');
module.exports = class Colaborador {
  constructor(
    externalCollab_name,
    externalCollab_lastName,
    externalCollab_secondLastName,
    externalCollab_birthDate,
    externalCollab_degree,
    externalCollab_email,
    externalCollab_password,
    externalCollab_phone,
    externalCollab_status,
    externalCollab_internalRegulation,
    externalCollab_idCopy,
    externalCollab_confidentialityNotice,
    externalCollab_photo
  ) {
    this.name = externalCollab_name;
    this.lastName = externalCollab_lastName;
    this.secondLastName = externalCollab_secondLastName;
    this.birthDate = externalCollab_birthDate;
    this.degree = externalCollab_degree;
    this.email = externalCollab_email;
    this.password = externalCollab_password;
    this.phone = externalCollab_phone;
    this.status = externalCollab_status;
    this.internalRegulation = externalCollab_internalRegulation;
    this.idCopy = externalCollab_idCopy;
    this.confidentialityNotice = externalCollab_confidentialityNotice;
    this.photo = externalCollab_photo;
  }
   
  static async fetchAll() {
    try {
      const rows = await database.execute("SELECT * FROM Usuarios WHERE idRol IN (3, 4)");
      console.log("ROWS: ", rows);
      return rows;
    } catch (err) {
      console.error("Error in obtaining external collaborators: ", err);
    }
  }

  static async fetchOneByID(id){
    try {
      const [rows] = await database.execute("SELECT * FROM Usuarios WHERE idUsuario = ?", [id]);
      console.log("ROWS: ", rows);
      return rows;
    } catch (err) {
      console.error("Error in obtaining the external collaborator by ID: ", err);
    }
  }

}