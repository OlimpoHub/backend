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

// Exportar el pool para usarlo en otros archivos
module.exports = pool;

// // Función execute con logging (opcional - quitar si es necesario)
// async function execute(query, params) {
  
//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const result = await conn.query(query, params);
    
//     return result;
//   } catch (error) {
//     console.error('Error en execute():', error.message);
//     throw error;
//   } finally {
//     if (conn) {
//       conn.release();
//     }
//   }
// }

// // Función para consultas simples (opcional - quitar si es necesario)
// async function query(sql, params) {
//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const result = await conn.query(sql, params);
//     return result;
//   } finally {
//     if (conn) conn.release();
//   }
// }

// // TEST DE CONEXIÓN (opcional)
// (async () => {
//   try {
//     const conn = await pool.getConnection();
//     console.log('✅ Conexión exitosa a la base de datos');

//     const rows = await conn.query('SELECT * FROM Usuarios');
//     console.log('Test:', rows);

//     conn.release();
//   } catch (err) {
//     console.error('❌ Error al conectar a la base de datos:', err);
//   }
// })();

// // Exportar las funciones
// module.exports = {
//   execute,
//   query
// };