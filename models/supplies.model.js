const database =  require('../utils/db');

module.exports = class Supplies{
    constructor(idInsumo, nombre, imagenInsumo){
        this.idInsumo = idInsumo;
        this.nombre = nombre;
        this.imagenInsumo = imagenInsumo;
    }

    static async fetchAll(){
        try{
            const rows = await  database.query("SELECT nombre, imagenInsumo FROM Insumo");
            console.log("ROWS:", rows);
            return rows;
        }catch(err){
            console.error("Error al obtener catalogo de insumos:", err);
            throw err; 
        }
    }

}