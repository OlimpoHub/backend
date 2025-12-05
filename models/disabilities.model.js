const database = require('../utils/db.js');
module.exports = class Disability {
    constructor(name, description) {
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

    async updateById(idDiscapacidad) {
        return database
          .execute(
            `UPDATE ListaDiscapacidades
            SET
              nombre = ?,
              caracteristicas = ?
            WHERE idDiscapacidad = ?`,
            [
              this.name,
              this.description,
              idDiscapacidad
            ]
          )
          .then(() => {
            return database.execute(
              `SELECT *
              FROM ListaDiscapacidades
              WHERE idDiscapacidad = ?`, [idDiscapacidad]
            );
          });
      }

      static async fetchDisability(id) {
        const query = `
            SELECT *
            FROM ListaDiscapacidades
            WHERE idDiscapacidad = ?
        `;

        const rows = await database.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
      }
}