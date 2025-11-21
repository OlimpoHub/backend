const express = require('express');
const router = express.Router();

const workshopsController = require('../controllers/workshops.controller');

router.get('/search', workshopsController.searchWorkshops);

router.post('/add', workshopsController.addWorkshops);
router.get('/', workshopsController.viewWorkshops);
router.get('/:idTaller', workshopsController.viewOneWorkshop);

router.post('/modify/:idTaller', workshopsController.modifyWorkshops);

// Define a Post endpoint to delete a Workshop (US: Delete Workshop)
router.post("/delete", workshopsController.deleteWorkshops);


/* Get categories of workshops in horaEntrada*/
router.get("/filter/data", workshopsController.getWorkshopsCategories);

/* POST - Filters Workshops */
router.post('/filter', workshopsController.viewWorkshopsFiltered);


module.exports = router;