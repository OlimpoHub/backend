const db = require('../utils/db.js');
const { v4: uuidv4 } = require('uuid');

module.exports = class Workshops {
  constructor(idTaller, idCapacitacion, nombreTaller, horaEntrada, horaSalida, estatus, idUsuario) {
    this.idTaller = idTaller || uuidv4();
    this.idCapacitacion = idCapacitacion;
    this.nombreTaller = nombreTaller;
    this.horaEntrada = horaEntrada;
    this.horaSalida = horaSalida;
    this.estatus = estatus;
    this.idUsuario = idUsuario;
  }

  async save() {
    try {
      const query = `INSERT INTO Taller (idTaller, idCapacitacion, nombreTaller, horaEntrada, horaSalida, estatus, idUsuario) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
      
      const params = [
        this.idTaller,
        this.idCapacitacion,
        this.nombreTaller,
        this.horaEntrada,
        this.horaSalida,
        this.estatus,
        this.idUsuario
      ];
      
      const result = await db.execute(query, params);
      return result;
      
    } catch (error) {
      console.error('Error save():', error);
      throw error;
    }
  }

  static async update(idTaller, nombreTaller, horaEntrada, horaSalida, estatus) {
    try {
        const query = `
        UPDATE Taller 
        SET nombreTaller = ?,
            horaEntrada = ?,
            horaSalida = ?,
            estatus = ?
        WHERE idTaller = ?
        `;
        
        const params = [nombreTaller, horaEntrada, horaSalida, estatus, idTaller];
        const result = await db.execute(query, params);
        return result;
        
    } catch (error) {
        console.error('Error update():', error);
        throw error;
    }
  }

  static async delete(idTaller) {
    try {
        const query = `DELETE FROM Taller WHERE idTaller = ?`;
        
        const params = [idTaller];
        const result = await db.execute(query, params);
        return result;
        
    } catch (error) {
        console.error('Error delete():', error);
        throw error;
    }
   }
};