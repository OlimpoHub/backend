const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

module.exports = class Category {
    // GET: Obtener idCategoria por categoria
    static async getId(Categoria) {
        try {
            const rows = await db.query
            (
                `SELECT idCategoria
                 FROM Categoria 
                 WHERE Descripcion = ?`,
                [Categoria]
            );
            return rows.length > 0 ? rows[0].idCategoria : null;
        } catch (err) {
            console.error("Error fetching category ID by name:", err);
            throw err;
        }
    }
}