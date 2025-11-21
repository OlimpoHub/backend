const express = require("express");
const router = express.Router();

const user_controller = require('../controllers/user.controller');

router.post("/login", user_controller.post_login);
router.post("/refresh", user_controller.post_refresh);
router.post('/recover-password', user_controller.recoverPassword);
router.get('/verify-token', user_controller.verifyToken);
router.post('/update-password', user_controller.updatePassword);
router.get("/", user_controller.getAllUsers);

module.exports = router;
