const database = require('../utils/db.js');

module.exports = class Attendance {
    constructor(
        _idUsuario,
        _idTaller,
        _fechaInicio,
    ) {
        this.idUsuario = _idUsuario;
        this.idTaller = _idTaller;
        this.fechaInicio = _fechaInicio;
    }

    static async getCurrentAttendance(userID, readTime) {
        const rows = await database.query(
            `SELECT idAsistencia, fechaInicio, fechaFin
            FROM Asistencia
            WHERE idUsuario = ?
            AND DATE(fechaInicio) = ?`
            , [userID, readTime]);
        return rows;
    }

    static async addExitAttendance(idAttendance, readTime) {
        try {
            const result = await database.query(
                `UPDATE Asistencia 
                SET fechaFin = ?
                WHERE idAsistencia = ?`,
                [readTime, idAttendance]
            );
            return result;
        } catch (err) {
            console.error("Error adding exit attendance: ", err);
            throw err;
        }
    }

    async save() {
        try {
            const result = await database.query(
                `INSERT INTO Asistencia 
                (idUsuario, idTaller, fechaInicio) 
                VALUES (?, ?, ?)`,
                [this.idUsuario, this.idTaller, this.fechaInicio]
            );
            return result;
        } catch (err) {
            console.error("Error adding entrance attendance: ", err);
            throw err;
        }
    }

    static async fetchAttendancesByUser(userId) {
      const rows = await database.query(
        `SELECT
            a.idAsistencia,
            a.idUsuario,
            a.idTaller,
            t.nombreTaller,       -- 👈 NUEVO
            a.fechaInicio,
            a.fechaFin
         FROM Asistencia a
         JOIN Taller t ON a.idTaller = t.idTaller
         WHERE a.idUsuario = ?`,
        [userId]
      );
      return rows;
    }


}   