const express = require("express");
const router = express.Router();

const uploadsContoller = require('../controllers/uploads.controller');

router.get("/:fileID", uploadsContoller.openFile);

module.exports = router;