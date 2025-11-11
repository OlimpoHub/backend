const db = require('../utils/db.js');
const { v4: uuidv4 } = require('uuid');

module.exports = class Workshops {
    constructor(idTaller, idCapacitacion, nombreTaller, horaEntrada, horaSalida, estatus, idUsuario, descripcion, fecha, url) {
        this.idTaller = idTaller || uuidv4();
        this.idCapacitacion = idCapacitacion;
        this.nombreTaller = nombreTaller;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
        this.estatus = estatus;
        this.idUsuario = idUsuario;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.url = url;
    }

    async save() {
        try {
            const query = `
                INSERT INTO Taller 
                (idTaller, idCapacitacion, nombreTaller, horaEntrada, horaSalida, estatus, idUsuario, Descripcion, Fecha, URL) 
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
                this.descripcion,
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
                'Descripcion',
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

    static async update(idTaller, nombreTaller, horaEntrada, horaSalida, estatus, descripcion, fecha, url) {
        try {
            const query = `
                UPDATE Taller 
                SET nombreTaller = ?,
                    horaEntrada = ?,
                    horaSalida = ?,
                    estatus = ?,
                    Descripcion = ?,
                    Fecha = ?,
                    URL = ?
                WHERE idTaller = ?
            `;
            
            const params = [nombreTaller, horaEntrada, horaSalida, estatus, descripcion, fecha, url, idTaller];
            const result = await db.execute(query, params);
            return result;
            
        } catch (error) {
            console.error('Error update():', error);
            throw error;
        }
    }

    static async changestatus(idTaller) {
        try {
            const query = `
            UPDATE Taller
            SET estatus = 0
            WHERE idTaller = ?;
            `;
            const result = await db.execute(query, [idTaller]);
            return result;
        } catch (error) {
            console.error("Error changestatus():", error);
            throw error;
        }
    }
    
    static async getWorkshops(){
        try{
            const rows = await db.query
            (`
                SELECT t.idTaller, 
                t.nombreTaller, 
                t.horaEntrada, 
                t.horaSalida,
                t.Descripcion,
                t.Fecha,
                t.URL
                FROM Taller t 
                WHERE t.estatus = ?`, [1]
            );
            return rows;
        } catch (err) {
            console.error("Error fetching workshop catalog:", err);
            throw err;
        }
    }

    static async getOneWorkshop(id){ 
        try{
            const rows = await db.query(
                `SELECT 
	                t.nombreTaller, t.horaEntrada, t.horaSalida, c.nombreCapacitacion, 
                    t.URL, t.fecha, u.nombre, u.apellidoPaterno, u.apellidoMaterno
                FROM Taller t
                JOIN Capacitaciones c
	                ON t.idCapacitacion = c.idCapacitacion
                JOIN Usuarios u
                    ON t.idUsuario = u.idUsuario
                WHERE t.estatus = ? AND t.idTaller = ?
                `, [1, id]
            );
            const beneficiariesRows = await db.query(
                `SELECT  
	                b.idbeneficiario, b.nombre, b.apellidoMaterno, b.apellidoPaterno, b.foto
                FROM Beneficiarios b
                JOIN BeneficiarioTaller e
	                ON e.idBeneficiario = b.idBeneficiario
                JOIN Taller t	
	                ON e.idTaller = t.idTaller
                WHERE t.estatus = ? AND b.estatus = ? AND t.idTaller = ?
                `, [1, 1, id]
            );
            return {
                workshop : rows,
                beneficiaries : beneficiariesRows
            };
        }
        catch(err) {
            console.log("Error fetching one workshop", err);
            throw err;
        }
        
    }
    static async getOneWorkshopBeneficiaries(id){ 
        try{
            
            return rows;
        }
        catch(err) {
            console.log("Error fetching workshop beneficiaries", err);
            throw err;
        }
        
    }

    static async findWorkshop(nameWorkshop) {
        try {
            const query = `
                SELECT 
                    t.idTaller, 
                    t.nombreTaller, 
                    t.horaEntrada, 
                    t.horaSalida,
                    t.Descripcion,
                    t.Fecha,
                    t.URL
                FROM Taller t
                WHERE t.estatus = 1 AND t.nombreTaller LIKE ?;
            `;
            
            const [rows] = await db.execute(query, [`%${nameWorkshop}%`]);
            return rows;
        } catch (error) {
            console.error("Error findWorkshop:", error);
            throw error;
        }
    }

};
