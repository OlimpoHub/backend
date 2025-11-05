const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/login", authController.post_login);
router.post("/refresh", authController.post_refresh);

module.exports = router;