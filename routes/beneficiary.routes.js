const express = require("express");
const router = express.Router();

const beneficiary_controller = require('../controllers/beneficiary.controller');

router.get('/beneficiary', beneficiary_controller.get_beneficiaries);

module.exports = router;