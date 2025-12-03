const db = require('../utils/db.js');
const { v4: uuidv4 } = require('uuid');

module.exports = class Workshops {
    constructor(idTaller, nombreTaller, horaEntrada, horaSalida, estatus, idUsuario, descripcion, fecha, url) {
        this.idTaller = idTaller || uuidv4();
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
                (idTaller, nombreTaller, horaEntrada, horaSalida, estatus, idUsuario, Descripcion, Fecha, URL) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                this.idTaller,
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

    static async update(idTaller, nombreTaller, horaEntrada, horaSalida, estatus, descripcion, fecha, url, idUsuario) {
        try {
            const query = `
                UPDATE Taller 
                SET nombreTaller = ?,
                    horaEntrada = ?,
                    horaSalida = ?,
                    estatus = ?,
                    Descripcion = ?,
                    Fecha = ?,
                    URL = ?,
                    idUsuario = ?
                WHERE idTaller = ?
            `;
            
            const params = [nombreTaller, horaEntrada, horaSalida, estatus, descripcion, fecha, url, idUsuario, idTaller];
            const result = await db.execute(query, params);
            return result;
            
        } catch (error) {
            console.error('Error update():', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const result = await db.execute(
                `UPDATE Taller SET estatus = 0 WHERE idTaller = ?`, 
                [id]
            );

            if (result.affectedRows === 0) 
                return { success: false, message: "No workshop found with that ID." };
        
            return { success: true, message: "Workshop deleted successfully." };

        } catch (error) {
            console.error("Error deleting workshop:", error);
            throw error;
        }
    }
    
    static async getWorkshops(){
        try{
            const rows = await db.query(
            `
                SELECT t.idTaller, 
                t.nombreTaller, 
                t.horaEntrada, 
                t.horaSalida,
                t.Descripcion,
                t.Fecha,
                t.URL
                FROM Taller t 
                WHERE t.estatus = ?
            `, [1]);
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
	                t.nombreTaller, t.horaEntrada, t.horaSalida, t.Descripcion,
                    t.URL, t.Fecha, t.idUsuario,
                    u.nombre, u.apellidoPaterno, u.apellidoMaterno
                FROM Taller t
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

        } catch(err) {
            console.log("Error fetching one workshop", err);
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
                WHERE t.estatus = 1 
                AND LOWER(t.nombreTaller) LIKE LOWER(?)
            `;
            
            const searchTerm = `%${nameWorkshop}%`;
            const [rows] = await db.execute(query, [searchTerm]);
            return rows;

        } catch (error) {
            console.error("Error findWorkshop:", error);
            throw error;
        }
    }

    static async getWorkshopsFiltered(body = {}){
        const filters = body.filter;
        try{
            let query = `
            SELECT t.idTaller, 
                t.nombreTaller, 
                t.horaEntrada, 
                t.horaSalida,
                t.Descripcion,
                t.Fecha,
                t.URL
                FROM Taller t
                WHERE t.estatus = 1
            `;
            const  params =[];

            if (filters["entryHour"] && filters["entryHour"].length > 0) {
                query += ` AND t.horaEntrada IN (${filters["entryHour"].map(() => '?').join(', ')})`;
                params.push(...filters["entryHour"]);
            }

            if (filters["date"] && filters["date"].length > 0) {
                query += ` AND t.Fecha IN (${filters["date"].map(() => '?').join(', ')})`;
                params.push(...filters["date"]);
            }

            if (body.order){
                query += ` ORDER BY t.nombreTaller ${body.order}`;
            }

            const rows = await db.query(query, params);
            return rows;

        } catch(error){
            console.log("Error fetching workshops filtered", error);
            throw error;
        }
    }

    static async getWorkshopsCategories(){
        try{
            const entryHour = await db.query(`SELECT DISTINCT horaEntrada FROM Taller`);
            const date = await db.query(`SELECT DISTINCT Fecha FROM Taller`);

            return {
                entryHour: entryHour.map(e => e.horaEntrada),
                date: date.map(d => d.Fecha)
            };

        } catch(error){
            console.error("Error fetching filter data:", error);
            throw error;
        }
    }

    static async getId(nombreTaller) {
        try {
            const rows = await db.query(
                `SELECT idTaller FROM Taller WHERE nombreTaller = ?`,
                [nombreTaller]
            );

            return rows.length > 0 ? rows[0].idTaller : null;

        } catch (err) {
            console.error("Error fetching workshop ID by name:", err);
            throw err;
        }
    }

    static async getName() {
        try {
            const rows = await db.query(
                `SELECT nombreTaller FROM Taller WHERE estatus = 1`
            );
            return rows;

        } catch (err) {
            console.error("Error fetching all categories", err);
            throw err;
        }
    }
};
