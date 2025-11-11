const express = require("express");
const router = express.Router();

const beneficiaryController = require('../controllers/beneficiary.controller');

// Ruta para BEN-02
router.get('/list', beneficiaryController.beneficiariesList);

router.get('/', beneficiaryController.getBeneficiaries);
router.get('/:id', beneficiaryController.getBeneficiary);
// Ruta para BEN-04
router.delete('/:id', beneficiaryController.deleteBeneficiary);
// Ruta para BEN-003
router.post('/update/:id', beneficiaryController.updateBeneficiary);
// Ruta para BEN-001
router.post('/create', beneficiaryController.postBeneficiary);

module.exports = router;