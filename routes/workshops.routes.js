const express = require('express');
const router = express.Router();

const WorkshopsController = require('../controllers/workshops.controller');

router.post('/add', WorkshopsController.addWorkshops);

router.post('/modify', WorkshopsController.modifyWorkshops);

router.post('/delete', WorkshopsController.deleteWorkshops);

module.exports = router;