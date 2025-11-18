const mariadb = require('mariadb');
const dotenv = require('dotenv');

// Carga las variables de entorno
dotenv.config({ path: require('path').join(__dirname, '../.env') });

// Crear el pool de conexiones
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10,
  acquireTimeout: 10000
});

// Probar conexión
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Conexión a la base de datos establecida");
    conn.release();
  } catch (err) {
    console.error("❌ Error conectando a la base de datos:", err);
  }
})();

// Exportar el pool para usarlo en otros archivos
module.exports = pool;


