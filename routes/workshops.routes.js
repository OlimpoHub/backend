const express = require('express');
const router = express.Router();

const WorkshopsController = require('../controllers/workshops.controller');

router.post('/add', WorkshopsController.addWorkshops);

module.exports = router;