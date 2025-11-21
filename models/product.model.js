const database = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

module.exports = class Products {
    constructor(
        miIdTaller,
        miNombre,
        miPrecioUnitario,
        miIdCategoria,
        miDescripcion,
        miImagen,
        miDisponible,
    ) {
        this.idProducto = uuidv4();
        this.idTaller = miIdTaller;
        this.nombre = miNombre;
        this.precioUnitario = miPrecioUnitario;
        this.idCategoria = miIdCategoria;
        this.descripcion = miDescripcion;
        this.imagen = miImagen;
        this.disponible = miDisponible;
    }

    // Add a new product
    async save() {
        try {
            const result = await database.query (
                `INSERT INTO Productos 
                (
                    idProducto, 
                    idTaller, 
                    Nombre, 
                    PrecioUnitario, 
                    idCategoria, 
                    Descripcion, 
                    imagen, 
                    Disponible
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    this.idProducto,
                    this.idTaller,
                    this.nombre,
                    this.precioUnitario,
                    this.idCategoria,
                    this.descripcion,
                    this.imagen,
                    this.disponible,
                ]
            );
            return result;
        } catch (err) {
            console.log("Error adding a new product", err);
            throw err;
        }
    }

    // Consult all products
    static async fetchAll() {
    try {
        const rows = await database.query(
            `SELECT 
                p.idProducto,
                p.idTaller,
                p.Nombre, 
                p.PrecioUnitario,
                p.idCategoria,
                p.Descripcion,
                p.imagen,
                p.Disponible,
                t.nombreTaller 
             FROM Productos as p
             INNER JOIN Taller as t ON p.idTaller = t.idTaller`
        );
        console.log("ROWS:", rows);
        return rows;
    } catch (err) {
        console.error("Error fetching products:", err);
        throw err;
    }
}

    // Consult one product
    static async fetchOne(id) {
        try{
            const rows = await database.query
            (
                `SELECT p.idProducto, p.Nombre, p.PrecioUnitario, t.nombreTaller, 
                        c.Descripcion AS Categoria, p.Disponible, 
                        p.Descripcion, p.imagen 
                 FROM Productos as p, Taller as t, Categoria as c 
                 WHERE p.idTaller = t.idTaller 
                   and p.idCategoria = c.idCategoria 
                   and p.idProducto = ?`, [id]
            );

            return rows.length > 0 ? rows[0] : null;
        } catch(err) {
            console.log("Error fetching one product", err);
            throw err;
        }
    }

    // Update a product
    static async update(id, product) {
        try {

            const result = await database.query (
                `UPDATE Productos 
                 SET nombre = ?, imagen = ?, PrecioUnitario = ?, 
                     idTaller = ?, idCategoria = ?, Disponible = ?, 
                     Descripcion = ? 
                 WHERE idProducto = ?`,
                [
                    product.Nombre,
                    product.imagen,
                    product.PrecioUnitario,
                    product.idTaller,
                    product.idCategoria,
                    product.Disponible,
                    product.Descripcion,
                    id
                ]
            );
            return result;
        } catch (err) {
            console.log("Error adding a new product", err);
            throw err;
        }
    }

  // DELETE PRODUCT
  static async remove(idProducto) {
    try {
      const result = await database.query(
        `DELETE FROM Productos WHERE idProducto = ?`,
        [idProducto]
      );
      return !!(result.affectedRows && result.affectedRows > 0);
    } catch (err) {
      console.error("Error deleting product", err);
      throw err;
    }
  }

  // search products
  static async search(term) {
    try {
      const like = `%${term}%`;
      const isNumber = !isNaN(Number(term));

      const params = [like, like, like]; // Nombre, Descripcion, idCategoria
      const extra = isNumber ? ' OR p.PrecioUnitario = ?' : '';
      if (isNumber) params.push(Number(term));

      const rows = await database.query(
        `SELECT
            p.idProducto, p.idTaller, p.Nombre, p.PrecioUnitario,
            p.idCategoria, p.Descripcion, p.imagen, p.Disponible
         FROM Productos p
         WHERE p.Nombre LIKE ?
            OR p.Descripcion LIKE ?
            OR p.idCategoria LIKE ?
            ${extra}`,
        params
      );
      return rows;
    } catch (err) {
      console.error('Error searching products', err);
      throw err;
    }
  }

  // Order products
  static async fetchAllWithOrder(orderBy = "p.Nombre", direction = "ASC") {
    try {
      const validColumns = [
        "p.Nombre",
        "p.PrecioUnitario",
        "p.idCategoria",
        "p.idProducto",
        "p.Disponible"
      ];

      if (!validColumns.includes(orderBy)) orderBy = "p.Nombre";
      const dir = String(direction || "").toUpperCase();
      direction = (dir === "DESC" ? "DESC" : "ASC");

      const rows = await database.query(
        `SELECT
            p.idProducto,
            p.idTaller,
            p.Nombre,
            p.PrecioUnitario,
            p.idCategoria,
            p.Descripcion,
            p.imagen,
            p.Disponible
         FROM Productos p
         ORDER BY ${orderBy} ${direction}`
      );

      return rows;
    } catch (err) {
      console.error("Error fetching ordered products", err);
      throw err;
    }
  }

  // Filtrar por precio (rango o valor único) — p.PrecioUnitario
  static async filterPrice({ minPrecio, maxPrecio }) {
    try {
      let conditions = [];
      let values = [];

      if (minPrecio !== undefined && minPrecio !== '') {
        conditions.push('p.PrecioUnitario >= ?');
        values.push(parseFloat(minPrecio));
      }
      if (maxPrecio !== undefined && maxPrecio !== '') {
        conditions.push('p.PrecioUnitario <= ?');
        values.push(parseFloat(maxPrecio));
      }

      const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

      const rows = await database.query(
        `SELECT
            p.idProducto, p.idTaller, p.Nombre, p.PrecioUnitario,
            p.idCategoria, p.Descripcion, p.imagen, p.Disponible
         FROM Productos p
         ${whereClause}
         ORDER BY p.PrecioUnitario ASC, p.Nombre ASC`,
        values
      );
      return rows;
    } catch (err) {
      console.error('Error filtering products by price', err);
      throw err;
    }
  }

  // Filtrar por disponibilidad — p.Disponible 
  static async filterDisponible({ disponible }) {
    try {
      const rows = await database.query(
        `SELECT
            p.idProducto, p.idTaller, p.Nombre, p.PrecioUnitario,
            p.idCategoria, p.Descripcion, p.imagen, p.Disponible
         FROM Productos p
         WHERE p.Disponible = ?
         ORDER BY p.Nombre ASC`,
        [disponible]
      );
      return rows;
    } catch (err) {
      console.error('Error filtering products by availability', err);
      throw err;
    }
  }

  // Filtrar por categoría — p.idCategoria
  static async filterByCategory({ idCategoria }) {
    try {
      const rows = await database.query(
        `SELECT
            p.idProducto, p.idTaller, p.Nombre, p.PrecioUnitario,
            p.idCategoria, p.Descripcion, p.imagen, p.Disponible
         FROM Productos p
         WHERE p.idCategoria = ?
         ORDER BY p.Nombre ASC`,
        [idCategoria]
      );
      return rows;
    } catch (err) {
      console.error('Error filtering products by category', err);
      throw err;
    }
  }

  // Filtrar por taller — p.idTaller
  static async filterByWorkshop({ idTaller }) {
    try {
      const rows = await database.query(
        `SELECT
            p.idProducto, p.idTaller, p.Nombre, p.PrecioUnitario,
            p.idCategoria, p.Descripcion, p.imagen, p.Disponible
         FROM Productos p
         WHERE p.idTaller = ?
         ORDER BY p.Nombre ASC`,
        [idTaller]
      );
      return rows;
    } catch (err) {
      console.error('Error filtering products by workshop', err);
      throw err;
    }
  }
};
