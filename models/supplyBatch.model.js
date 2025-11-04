const database = require("../utils/db")
module.exports = class SupplyBatch {
    constructor
    (
        idInsumos, 
        cantidadActual, 
        fechaCaducidad, 
        idTipoAdquisicion
    ){
        this.idInsumos = idInsumos;
        this.cantidadActual = cantidadActual;
        this.fechaCaducidad = fechaCaducidad;
        this.idTipoAdquisicion = idTipoAdquisicion;
    }

    static async fetchAll() {
        try {
            const rows = await database.query
            (
                `SELECT i.nombre, i.imagenInsumo, i.unidadMedida, 
                    i.idInsumo, inv.idInventario, inv.cantidadActual, 
                    inv.fechaCaducidad
                FROM Insumo i
                JOIN InventarioInsumos inv
                    ON i.idInsumo = inv.idInsumo
                GROUP BY i.idInsumo, i.nombre, i.imagenInsumo`
            );
            
            console.log("rows", rows);
            return rows;
        } catch(err) {
            console.log("Error fetching supply batch ", err);
            throw err;
        }
    }
}