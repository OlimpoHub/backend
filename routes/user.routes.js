const express = require("express");
const router = express.Router();

const user_controller = require('../controllers/user.controller');

/**
 * POST /login
 * @description Authenticate user credentials and return access + refresh tokens
 */
router.post("/login", user_controller.post_login);

/**
 * POST /refresh
 * @description Generate a new access token using a valid refresh token
 */
router.post("/refresh", user_controller.post_refresh);

/**
 * POST /recover-password
 * @description Send a password recovery email containing a temporary JWT link
 */
router.post('/recover-password', user_controller.recoverPassword);

/**
 * GET /verify-token
 * @description Validate the recovery JWT sent to the user to confirm it is still valid
 */
router.get('/verify-token', user_controller.verifyToken);

/**
 * POST /update-password
 * @description Update user password after validating a recovery or authentication token
 */
router.post('/update-password', user_controller.updatePassword);

module.exports = router;
