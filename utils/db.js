import mariadb from "mariadb";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10,
});


// USE THIS TO TEST THE CONNECTION WITH THE DATABASE AND SEE THE ERRORS IF THERE ARE ANY
try {
  const conn = await pool.getConnection();
  console.log("✅ Conexión exitosa a la base de datos");
  // conn.release();

  // QUERY TO TEST IF THE CONNECTION WORKS
  const rows = await conn.query("SELECT * FROM Usuarios")
  console.log(rows);
} catch (err) {
  console.error("❌ Error al conectar a la base de datos:", err);
} finally {
  process.exit();
}