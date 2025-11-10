const express = require("express");
const router = express.Router();

const beneficiaryController = require('../controllers/beneficiary.controller');

// Ruta para BEN-02
router.get('/list', beneficiaryController.beneficiariesList);
router.get('/', beneficiaryController.get_beneficiaries);
router.get('/:id', beneficiaryController.get_beneficiary);
// Ruta para BEN-04
router.delete('/:id', beneficiaryController.deleteBeneficiary);

module.exports = router;