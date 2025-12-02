const express = require('express');
const multer  = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No se envió archivo." });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename
  });
});

exports.openFile = (request, response) => {
    // Gets the file name
    const fileName = request.params.fileID;

    // Gets the file address
    const directory = path.join(
        __dirname, 
        "..",
        "uploads",
        fileName
    );

    // Renders the file
    fs.access(directory, fs.constants.F_OK, (error) => {
        // In case the file wasn't found, sends an error
        if (error) {
            return response
                .status(404)
                .json({error: "The file doesn't exist"});
        }

        // Renders the file
        response.sendFile(directory);
    });
};

module.exports = router;
