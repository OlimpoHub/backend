const database = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

module.exports = class Supplies {
    constructor(
        idTaller,
        nombre,
        unidadMedida,
        idCategoria,
        imagenInsumo,
        status
    ) {
        this.idTaller = idTaller;
        this.nombre = nombre;
        this.unidadMedida = unidadMedida;
        this.idCategoria = idCategoria;
        this.imagenInsumo = imagenInsumo;
        this.status = status;
    }

    // Static method to fetch all supplies from the database
    static async fetchAll() {
        try {
            const rows = await database.query
            (`
                SELECT idInsumo, nombre, imagenInsumo 
                FROM Insumo`
            );
            console.log("ROWS:", rows);
            return rows; // Return the result to the controller
        } catch (err) {
            console.error("Error fetching supply catalog:", err);
            throw err;
        }
    }

    // Search supplies by name
    static async searchSupplies(value) {
        try {
            const rows = await database.query
            (
                `SELECT idInsumo, nombre, imagenInsumo 
                FROM Insumo 
                WHERE nombre 
                    LIKE ?`,[`%${value}%`]
            );
            return rows;
        } catch (err){
            console.error("Error searching supplies: ", err);
            throw err;
        }
    }

    static async filterOrder(body = {}) {
        // console.log("ENTRO AL FILTER POST", body);

        const filters = body.filters || {};

        try {
            let query = `
                SELECT i.idInsumo, i.nombre, i.imagenInsumo
                FROM Insumo i
                LEFT JOIN Categoria c ON i.idCategoria = c.idCategoria
                LEFT JOIN Taller t ON i.idTaller = t.idTaller
                WHERE 1 = 1
            `;

            const params = [];

            // Categorías
            if (filters["Categorías"] && filters["Categorías"].length > 0) {
                query += ` AND c.descripcion IN (${filters["Categorías"].map(() => '?').join(', ')})`;
                params.push(...filters["Categorías"]);
            }

            // Medidas
            if (filters["Medidas"] && filters["Medidas"].length > 0) {
                query += ` AND i.unidadMedida IN (${filters["Medidas"].map(() => '?').join(', ')})`;
                params.push(...filters["Medidas"]);
            }

            // Talleres
            if (filters["Talleres"] && filters["Talleres"].length > 0) {
                query += ` AND t.nombreTaller IN (${filters["Talleres"].map(() => '?').join(', ')})`;
                params.push(...filters["Talleres"]);
            }

            // Orden
            if (body.order) {
                query += ` ORDER BY i.nombre ${body.order}`;
            }

            const rows = await database.query(query, params);
            console.log("ROWS:", rows);

            return rows;

        } catch (err) {
            console.error("Error filtering supplies:", err);
            throw err;
        }
    }



    static async getFiltersData() {
        try {
            // Get all unique categories
            const categories = await database.query(
                `SELECT DISTINCT idCategoria, descripcion 
                FROM Categoria`
            );
            // Get all unique measures
            const measures = await database.query(
                `SELECT DISTINCT unidadMedida FROM Insumo`
            );
            // Get all unique workshops
            const workshops = await database.query(
                `SELECT DISTINCT idTaller, nombreTaller 
                FROM Taller`
            );
            // Return simplified arrays with raw values
            console.log("ENTRO AL GET FILTERS DATA");

            return {
                categories: categories.map(c => c.descripcion),
                measures: measures.map(m => m.unidadMedida),
                workshops: workshops.map(t => t.nombreTaller)
            };

        } catch (err) {
            console.error("Error fetching filter data:", err);
            throw err;
        }
    }

    async save() {
        try {
            const idInsumo = uuidv4();
            const result = await database.query(
                `INSERT INTO Insumo
                    (
                        idInsumo, 
                        idTaller, 
                        nombre, 
                        unidadMedida, 
                        idCategoria, 
                        imagenInsumo, 
                        status
                    ) 
                VALUES (?,?,?,?,?,?,?)`,
                [
                    idInsumo,
                    this.idTaller,
                    this.nombre,
                    this.unidadMedida,
                    this.idCategoria,
                    this.imagenInsumo,
                    this.status,
                ]
            );
            return result;
        } catch (err) {
            console.log("Error adding a new supply", err);
            throw err;
        }
    }

    // performs a soft delete by updating status = 0
    static async delete(id) {
        try {

        // run SQL query to set the supply status to 0 
        const result = await database.execute
        (
            `UPDATE Insumo 
            SET status = 0 
            WHERE idInsumo = ?`, 
            [id]
        );

        // check if any row was affected (supply found)
        if (result.affectedRows === 0) return { success: false, message: "No supplie found with that ID." };

        
        return { success: true, message: "Supplie deleted successfully." };
        } catch (error) {
        console.error("Error deleting supplie:", error);
        
        // rethrow the error to be handled by the controller
        throw error;
        }
    }

};
