const express = require("express");
const router = express.Router();

const beneficiary_controller = require('../controllers/beneficiary.controller');

// Ruta para BEN-02
router.get('/list', beneficiary_controller.beneficiaries_list);
router.get('/', beneficiary_controller.get_beneficiaries);
router.get('/:id', beneficiary_controller.get_beneficiary);
// Ruta para BEN-04
router.delete('/:id', beneficiary_controller.deleteBeneficiary);

module.exports = router;