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
};
