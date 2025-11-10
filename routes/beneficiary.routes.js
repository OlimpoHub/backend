const express = require("express");
const router = express.Router();

const beneficiary_controller = require('../controllers/beneficiary.controller');

router.get('/', beneficiary_controller.get_beneficiaries);
router.get('/:id', beneficiary_controller.get_beneficiary);
// Ruta para BEN-04
router.delete('/:id', beneficiary_controller.deleteBeneficiary);
//Ruta para BEN-001
router.post('/create', beneficiary_controller.post_beneficiary);

module.exports = router;