const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs'); // Añadir importación de fs

const router = express.Router();

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    // Asegúrate de que la carpeta 'uploads/' exista en el root de tu proyecto
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST /upload (Endpoint de subida)
router.post('/', upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No se envió archivo." });
  }

  // Construye la URL del archivo
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename
  });
});


// NOTA: La lógica de openFile (GET /uploads/:fileID) 
// es manejada de forma más eficiente por 'express.static' 
// en server.js. Si necesitas validación adicional al obtener 
// el archivo, entonces sí montarías esta ruta:

router.get('/:fileID', (request, response) => {
    // ... lógica de validación usando fs y response.sendFile
});
// En este caso, el endpoint sería POST /upload y GET /upload/:fileID


// Dejo la función de "openFile" comentada, ya que app.js ya está sirviendo archivos
// estáticos a través del middleware express.static('/uploads').

exports.openFile = (request, response) => {
    // ... (Tu lógica de openFile)
};


module.exports = router;