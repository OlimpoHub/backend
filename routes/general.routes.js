const express = require("express");
const router = express.Router();

const beneficiary_routes = require('./beneficiary.routes');
const user_routes = require('./user.routes');

router.use("/beneficiary", beneficiary_routes);
router.use("/user", user_routes);


module.exports = router;