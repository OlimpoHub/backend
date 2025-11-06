const express = require("express");
const router = express.Router();

const externalCollabsController = require("../controllers/externalCollabs.controller");

router.get("/", externalCollabsController.getExternalCollabs);
router.post("/deleteExternalCollab", externalCollabsController.deleteExternalCollab);
router.get("/:id", externalCollabsController.getExternalCollabsByID);

router.post("/register", externalCollabsController.registerExternalCollabs);
router.post("/update", externalCollabsController.updateExternalCollabs);

router.post("/order", externalCollabsController.getExternalCollabsOrdered)


module.exports = router;
