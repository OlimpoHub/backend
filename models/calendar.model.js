const database = require('../utils/db');

module.exports = class Calendar {
    constructor(
        idTaller,
        IdCapacitacion,
        idUsuario,
        nombreTaller,
        fecha,
        horarioTaller
    ) {
        this.idTaller = idTaller;
        this.IdCapacitacion = IdCapacitacion;
        this.idUsuario = idUsuario;
        this.nombreTaller = nombreTaller;
        this.fecha = fecha;
        this.horarioTaller = horarioTaller;
    }

    static async fetchById(idUsuario) {
        try {
            const rows = await database.query
            (`
            SELECT 
                Taller.idTaller, 
                Taller.IdCapacitacion, 
                Taller.idUsuario, 
                Taller.nombreTaller,
                Taller.fecha, 
                Taller.horarioTaller 
            FROM Taller 
            INNER JOIN Usuarios 
                ON Taller.idUsuario = Usuarios.idUsuario;
            `);
            console.log("ROWS:", rows);
            return rows;
        } catch (err) {
            console.error("Error fetching calendar info:", err);
            throw err;
        }
    }
};