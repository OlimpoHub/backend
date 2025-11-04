const express = require("express");
const router = express.Router();

const externalCollabsController = require("../controllers/externalCollabs.controller");

router.get("/", externalCollabsController.getExternalCollabs);
router.post("/register", externalCollabsController.postExternalCollabs);


module.exports = router;
