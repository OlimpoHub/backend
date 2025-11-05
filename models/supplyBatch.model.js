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
            
            // console.log("rows", rows);
            return rows;
        } catch(err) {
            console.log("Error fetching supply batch ", err);
            throw err;
        }
    }

    static async fetchOne(id) {
        try{
            const rows = await database.query
            (
                `SELECT 
                    i.idInsumo, i.nombre, i.unidadMedida, inv.FechaCaducidad,
                    SUM(inv.CantidadActual) AS cantidad
                FROM Insumo i
                JOIN InventarioInsumos inv 
                    ON inv.IdInsumo = i.idInsumo
                WHERE i.idInsumo = ?
                GROUP BY i.idInsumo, inv.FechaCaducidad`, [id]
            );

            // console.log("rows: ", rows);
            return rows;
        } catch(err) {
            console.log("Error fetching one supply batch", err);
            throw err;
        }
    }

    static async addSupply(supplyId, quantity, expirationDate, acquisitionId) {
        try {
            const result = await database.query
            (   
                `INSERT INTO InventarioInsumos 
                    (
                        idInsumo, 
                        CantidadActual, 
                        FechaCaducidad, 
                        idTipoAdquisicion
                VALUES (?, ?, ?, ?)`,
                [
                    supplyId,
                    quantity, 
                    expirationDate, 
                    acquisitionId
                ]
            );
            console.log("NEW SUPPLY ADDED: ", result);
            return result;
        } catch (err) {
            console.error("Error al agregar insumo: ", err);
            throw err;
        }
    }
}