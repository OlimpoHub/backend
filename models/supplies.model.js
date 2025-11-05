const database = require('../utils/db');

// Define the Supplies model class to represent supply entities
module.exports = class Supplies {
    constructor(idInsumo, nombre, imagenInsumo) {
        this.idInsumo = idInsumo;
        this.nombre = nombre;
        this.imagenInsumo = imagenInsumo;
    }

    // Static method to fetch all supplies from the database
    static async fetchAll() {
        try {
            const rows = await database.query("SELECT nombre, imagenInsumo FROM Insumo");
            console.log("ROWS:", rows);
            return rows; // Return the result to the controller
        } catch (err) {
            console.error("Error fetching supply catalog:", err);
            throw err;
        }
    }

    // Search supplies by name
    static async searchSupplies(value){
        try {
            const rows = await database.query("SELECT idInsumo, nombre, imagenInsumo FROM Insumo WHERE nombre LIKE ?", [`%${value}%`]);
            return rows;
        } catch (err){
            console.error("Error searching supplies: ", err);
            throw err;
        }
    }

    // Filter supplies by category, measure, or workshop
    static async filter(type, value){
        try {
            if (type == "category"){
                const rows = await database.query("SELECT i.idInsumo, i.nombre, i.imagenInsumo FROM Insumo i, Categoria c WHERE i.idCategoria = c.idCategoria AND c.descripcion = ?", [value]);
                return rows;
            } else if (type == "measure"){
                const rows = await database.query("SELECT idInsumo, nombre, imagenInsumo FROM Insumo WHERE unidadMedida = ?", [value]);
                return rows;
            } else if (type == "workshop"){
                const rows = await database.query("SELECT i.idInsumo, i.nombre, i.imagenInsumo FROM Insumo i, Taller t WHERE i.idTaller = t.idTaller AND t.nombreTaller = ?", [value]);
                return rows;
            }
            
        } catch (err){
            console.error("Error searching supplies: ", err);
            throw err;
        }
    }


    // Order supplies by name (asc or desc)
    static async orderSupplies(value){
        try {
            if (value == "asc"){
                const rows = await database.query("SELECT idInsumo, nombre, imagenInsumo FROM Insumo ORDER BY nombre ASC");
                return rows;
            } else if (value == "desc"){
                const rows = await database.query("SELECT idInsumo, nombre, imagenInsumo FROM Insumo ORDER BY nombre DESC");
                return rows;
            }
        } catch (err){
            console.error("Error ordering supplies: ", err);
            throw err;
        }
    }
}
