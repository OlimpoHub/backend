const express = require("express");
const router = express.Router();

const externalCollabsController = require("../controllers/externalCollabs.controller");

router.get("/", externalCollabsController.getExternalCollabs);
router.get("/:id", externalCollabsController.getExternalCollabsByID);


module.exports = router;
