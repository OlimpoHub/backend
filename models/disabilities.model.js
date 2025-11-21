const database = require('../utils/db.js');
module.exports = class Disability {
    constructor(idDisability, name, description) {
        this.idDisability = idDisability;
        this.name = name;
        this.description = description;
    }

    static async fetchAll() {
        const sql = `
            SELECT * FROM ListaDiscapacidades
        `;
        const rows = await database.query(sql);
        return rows;
    }
}