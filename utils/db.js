// db.js
const mariadb = require('mariadb');
const dotenv = require('dotenv');

// Carga las variables de entorno
dotenv.config({ path: './.env' });

// Crear el pool de conexiones
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10,
});

// Exportar el pool para usarlo en otros archivos
module.exports = pool;

// TEST DE CONEXIÓN (opcional)
// (async () => {
//   try {
//     const conn = await pool.getConnection();
//     console.log('✅ Conexión exitosa a la base de datos');

//     // Prueba una consulta
//     const rows = await conn.query('SELECT * FROM Usuarios');
//     console.log(rows);

//     conn.release();
//   } catch (err) {
//     console.error('❌ Error al conectar a la base de datos:', err);
//   } finally {
//     process.exit();
//   }
// })();
