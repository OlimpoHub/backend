const express = require('express');
const router = express.Router();

const discapacityController = require('../controllers/discapacity.controller.js');

router.get('/', discapacityController.viewDiscapacities);
router.get('/:idDiscapacidad', discapacityController.viewOneDiscapacity);

router.post('/add', discapacityController.addDiscapacities);
router.post('/search', discapacityController.searchDiscapacities);
router.post('/modify/:idDiscapacidad', discapacityController.modifyDiscapacities);

router.put('/delete/:idDiscapacidad', discapacityController.deleteDiscapacities);

module.exports = router;

