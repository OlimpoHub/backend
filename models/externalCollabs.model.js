const bodyParser = require('body-parser');
const database =  require('../utils/db');
module.exports = class externalCollabs {
  constructor(
    externalCollab_roleId,
    externalCollab_name,
    externalCollab_lastName,
    externalCollab_secondLastName,
    externalCollab_birthDate,
    externalCollab_degree,
    externalCollab_email,
    externalCollab_phone,
    externalCollab_status,
    externalCollab_internalRegulation,
    externalCollab_idCopy,
    externalCollab_confidentialityNotice,
  ) {
    this.roleId = externalCollab_roleId;
    this.name = externalCollab_name;
    this.lastName = externalCollab_lastName;
    this.secondLastName = externalCollab_secondLastName;
    this.birthDate = externalCollab_birthDate;
    this.degree = externalCollab_degree;
    this.email = externalCollab_email;
    this.phone = externalCollab_phone;
    this.status = externalCollab_status;
    this.internalRegulation = externalCollab_internalRegulation;
    this.idCopy = externalCollab_idCopy;
    this.confidentialityNotice = externalCollab_confidentialityNotice;
  }
    
  //Insert into table `Users` using parameters (safe SQL).
  static async save(hashedPassword,photo) {
    return database
      .execute(
        `INSERT INTO Usuarios (
          idRol,
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          fechaNacimiento,
          carrera,
          correoElectronico,
          contrasena,
          telefono,
          estatus,
          reglamentoInterno,
          copiaINE,
          avisoConfidencialidad,
          foto
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          this.roleId,
          this.name, 
          this.lastName, 
          this.secondLastName, 
          this.birthDate, 
          this.degree, 
          this.email,
          hashedPassword, 
          this.phone, 
          this.status, 
          this.internalRegulation, 
          this.idCopy,
          this.confidentialityNotice, 
          photo 
        ]
      )
      .then(() => {
        return database.execute
        (
          `SELECT idUsuario 
            FROM Usuarios 
            WHERE correoElectronico = ?`,[this.email]
        );
      });
  }

  async updateById(idUsuario) {
    return database
      .execute(
        `UPDATE Usuarios 
        SET
          idRol = ?,
          nombre = ?,
          apellidoPaterno = ?,
          apellidoMaterno = ?,
          fechaNacimiento = ?,
          carrera = ?,
          correoElectronico = ?,
          telefono = ?,
          estatus = ?,
          reglamentoInterno = ?,
          copiaINE = ?,
          avisoConfidencialidad = ?
        WHERE idUsuario = ?`,
        [
          this.roleId,                
          this.name,                   
          this.lastName,             
          this.secondLastName,        
          this.birthDate,             
          this.degree,                 
          this.email,                
          this.phone,                  
          this.status,               
          this.internalRegulation, 
          this.idCopy,          
          this.confidentialityNotice,
          idUsuario
        ]
      )
      .then(() => {
        return database.execute(
          `SELECT * 
          FROM Usuarios 
          WHERE idUsuario = ?`, [idUsuario]
        );
      });
  }

  static async fetchAll() {
    try {
      const rows = await database.execute
      (
        `SELECT * 
        FROM Usuarios 
        WHERE idRol 
          IN (3, 4)`
      );

      return rows;
    } catch (err) {
      console.error("Error in obtaining external collaborators: ", err);
    }
  }

  static async fetchOneByID(id){
    try {
      const rows = await database.execute
      (
        `SELECT * 
        FROM Usuarios 
        WHERE idUsuario = ?`, [id]
      );
      return rows;
    } catch (err) {
      console.error("Error in obtaining the external collaborator by ID: ", err);
    }
  }

  static async delete(id) {
    try {
      const result = await database.execute
      (
        `UPDATE Usuarios 
        SET estatus = 0 
        WHERE idUsuario = ?`, [id]
      );

      if (result.affectedRows === 0) return { success: false, message: "No user found with that ID." };

      return { success: true, message: "External collaborator deleted successfully." };
    } catch (err) {
      console.error("Error deleting external collaborator:", err);
      throw err;
    }
  }

  /* ------------------------------------------------------------------------- *
  * Order --> receives a param type, which is the order type desired, it could 
  * be either ASC(A-Z) or DESC(Z-A), and returns the external colaborators 
  * ordered depending on the type
  * 
  * @param type: String -> order type (ASC || DESC)
  * @returns rows: array || object of externalCollabs
  * ------------------------------------------------------------------------- */
  static async order(type) {
    try {
      if (type === "asc") {
        const rows = await database.query(
          `SELECT u.idUsuario, u.nombre, u.estatus, u.apellidoPaterno, 
            u.apellidoMaterno
          FROM Usuarios u
          JOIN Roles r
            ON r.idRol = u.idRol
          ORDER BY r.nombreRol ASC, u.nombre ASC`
        );
        console.log(rows);
        return rows;
      } else if(type === "desc") {
        const rows = await database.query(
          `SELECT u.idUsuario, u.nombre, u.estatus, u.apellidoPaterno, 
            u.apellidoMaterno
          FROM Usuarios u
          JOIN Roles r
            ON r.idRol = u.idRol
          ORDER BY r.nombreRol ASC, u.nombre DESC`
        );
        console.log(rows);
        return rows;
      }
    } catch(err) {
      throw err;
    }
  }
};

