const express = require("express");
const router = express.Router();

const externalCollabsController = require("../controllers/externalCollabs.controller");
const user_controller = require('../controllers/user.controller');

router.get("/", user_controller.getAllUsers);
router.post("/delete/:id", externalCollabsController.deleteExternalCollab); 
router.get("/:id", externalCollabsController.getExternalCollabsByID);

router.post("/register", externalCollabsController.registerExternalCollabs);
router.post("/update", externalCollabsController.updateExternalCollabs);

router.post("/order", externalCollabsController.getExternalCollabsOrdered);
router.post("/filter", externalCollabsController.getExternalCollabsFiltered);
router.post("/search", externalCollabsController.searchExternalCollabs);

module.exports = router;