const express = require('express');
const router = express.Router();

const workshopsController = require('../controllers/workshops.controller');

router.get('/search', workshopsController.searchWorkshops);

router.post('/add', workshopsController.addWorkshops);
router.get('/', workshopsController.viewWorkshops);
router.get('/:idTaller', workshopsController.viewOneWorkshop);

router.post('/modify/:idTaller', workshopsController.modifyWorkshops);

router.put('/delete/:idTaller', workshopsController.deleteWorkshops);

module.exports = router;