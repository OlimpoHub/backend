const express = require('express');
const router = express.Router();

const WorkshopsController = require('../controllers/workshops.controller');

router.post('/add', WorkshopsController.addWorkshops);
router.get('/', WorkshopsController.viewWorkshops);
router.get('/:idWorkshop', WorkshopsController.viewOneWorkshop);

router.post('/modify/:idTaller', WorkshopsController.modifyWorkshops);

router.put('/delete/:idTaller', WorkshopsController.deleteWorkshops);

module.exports = router;