const database = require('../utils/db');

module.exports = class Calendar {
    constructor(
        idTaller,
        idUsuario,
        nombreTaller,
        horaEntrada, 
        horaSalida,
        fecha,
    ) {
        this.idTaller = idTaller;
        this.idUsuario = idUsuario;
        this.nombreTaller = nombreTaller;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
        this.fecha = fecha;
    }

    static async fetchById(idUsuario) {
        try {
            const rows = await database.query
            (`
            SELECT 
                Taller.idTaller, 
                Taller.idUsuario, 
                Taller.nombreTaller,
                Taller.horaEntrada,
                Taller.horaSalida,
                Taller.Fecha 
            FROM Taller 
            INNER JOIN Usuarios 
                ON Taller.idUsuario = Usuarios.idUsuario 
            WHERE Usuarios.idUsuario = ?;
            `,[idUsuario]);
            console.log("ROWS:", rows);
            return rows;
        } catch (err) {
            console.error("Error fetching calendar info:", err);
            throw err;
        }
    }
};