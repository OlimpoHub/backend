const express = require('express');
const app = express();
const PORT = 8080;
// No es necesario body-parser si usas express.json() y express.urlencoded()
// const bodyParser = require('body-parser'); 
const path = require('path');
const cors = require('cors'); // Añadir CORS para desarrollo/producción

const user_routes = require("./routes/user.routes");
const general_routes = require("./routes/general.routes");
const upload_routes = require("./routes/upload.routes");

// MIDDLEWARE TEMPORAL DE LOGGING PARA DEBUGGING
app.use((req, res, next) => {
    console.log(`[Petición Recibida] ${req.method} ${req.originalUrl}`);
    next();
});

// 1. MIDDLEWARES GENERALES
app.use(cors()); // Permite peticiones desde otros orígenes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. MIDDLEWARE PARA SERVIR ARCHIVOS ESTÁTICOS
// Esto permite acceder a archivos en uploads/ a través de la URL /uploads/
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. MONTAJE DE ROUTERS
app.use("/user", user_routes);
// Ruta para subir archivos (POST http://[HOST]:8080/upload)
app.use("/upload", upload_routes); 
app.use("/", general_routes);

// 4. INICIO DEL SERVIDOR
app.listen(
    PORT,
    '0.0.0.0', // <-- CAMBIO CLAVE: Escuchar en todas las interfaces
    () => console.log(`Servidor vivo en http://0.0.0.0:${PORT}`)
);