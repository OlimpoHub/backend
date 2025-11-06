const db = require('../utils/db.js');
const { v4: uuidv4 } = require('uuid');

module.exports = class Workshops {
    constructor(idTaller, idCapacitacion, nombreTaller, horaEntrada, horaSalida, estatus, idUsuario, horarioTaller, fecha, url) {
        this.idTaller = idTaller || uuidv4();
        this.idCapacitacion = idCapacitacion;
        this.nombreTaller = nombreTaller;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
        this.estatus = estatus;
        this.idUsuario = idUsuario;
        this.horarioTaller = horarioTaller;
        this.fecha = fecha;
        this.url = url;
    }

    async save() {
        try {
            const query = `
                INSERT INTO Taller 
                (idTaller, idCapacitacion, nombreTaller, horaEntrada, horaSalida, estatus, idUsuario, HorarioTaller, Fecha, URL) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                this.idTaller,
                this.idCapacitacion,
                this.nombreTaller,
                this.horaEntrada,
                this.horaSalida,
                this.estatus,
                this.idUsuario,
                this.horarioTaller,
                this.fecha,
                this.url
            ];

            const result = await db.execute(query, values);
            return result;

        } catch (error) {
            console.error('Error en save():', error);
            throw error;
        }
    }

    static async add(tallerData) {
        try {
            const camposValidos = [
                'idTaller',
                'idCapacitacion',
                'nombreTaller',
                'horaEntrada',
                'horaSalida',
                'estatus',
                'idUsuario',
                'HorarioTaller',
                'Fecha',
                'URL'
            ];

            const campos = Object.keys(tallerData).filter(key => camposValidos.includes(key));
            const placeholders = campos.map(() => '?').join(', ');
            const valores = campos.map(campo => tallerData[campo]);
            
            const query = `INSERT INTO Taller (${campos.join(', ')}) VALUES (${placeholders})`;
            const result = await db.query(query, valores);
            return result;
            
        } catch (error) {
            console.error('Error en add():', error);
            throw error;
        }
    }

    static async update(idTaller, nombreTaller, horaEntrada, horaSalida, estatus, horarioTaller, fecha, url) {
        try {
            const query = `
                UPDATE Taller 
                SET nombreTaller = ?,
                    horaEntrada = ?,
                    horaSalida = ?,
                    estatus = ?,
                    HorarioTaller = ?,
                    Fecha = ?,
                    URL = ?
                WHERE idTaller = ?
            `;
            
            const params = [nombreTaller, horaEntrada, horaSalida, estatus, horarioTaller, fecha, url, idTaller];
            const result = await db.execute(query, params);
            return result;
            
        } catch (error) {
            console.error('Error update():', error);
            throw error;
        }
    }
};
