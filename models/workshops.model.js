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
            const query = `INSERT INTO taller 
                            (idTaller, 
                            idCapacitacion, 
                            nombreTaller, 
                            horaEntrada, 
                            horaSalida, 
                            estatus, 
                            idUsuario) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)`;
            
            const values = [
                this.idTaller,
                this.idCapacitacion,
                this.nombreTaller,
                this.horaEntrada,
                this.horaSalida,
                this.estatus,
                this.idUsuario
            ];
            const result = await db.query(query, values);
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
                'idUsuario'];
            const campos = Object.keys(tallerData).filter(key => camposValidos.includes(key));
            const placeholders = campos.map(() => '?').join(', ');
            const valores = campos.map(campo => tallerData[campo]);
            
            const query = `INSERT INTO taller (${campos.join(', ')}) VALUES (${placeholders})`;
            const result = await db.query(query, valores);
            return result;
            
        } catch (error) {
            console.error('Error en add():', error);
            throw error;
        }
    }

    static async getWorkshops(){
        try{
            const rows = await db.query
            (`
                SELECT t.idTaller, t.nombreTaller, t.horaEntrada, 
                t.horaSalida
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
	                u.nombre, u.apellidoPaterno
                FROM Taller t
                JOIN  UsuarioCapacitacion i
	                ON t.idCapacitacion = i.idCapacitacion
                JOIN Capacitaciones c
	                ON i.idCapacitacion = c.idCapacitacion
                JOIN Usuarios u
	                ON u.idUsuario = i.idUsuario
                WHERE t.estatus = ? AND c.estatus = ? AND t.idTaller = ?
                `, [1, 1, id]
            );
            const beneficiariesRows = await db.query(
                `SELECT  
	                b.nombre, b.apellidoMaterno, b.apellidoPaterno, b.foto
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
};