const express = require('express');
const router = express.Router();

const workshopsController = require('../controllers/workshops.controller');

/**
* GET /workshops/search
* @description Searches workshops by name
*/
router.get('/search', workshopsController.searchWorkshops);

/**
* POST /workshops/add
* @description Adds a new workshop
*/
router.post('/add', workshopsController.addWorkshops);

/**
* GET /workshops
* @description Gets the workshop list
*/
router.get('/', workshopsController.viewWorkshops);

/**
* GET /workshops/:idTaller
* @description Gets a single workshop with attendees
*/
router.get('/:idTaller', workshopsController.viewOneWorkshop);

/**
* POST /workshops/modify/:idTaller
* @description Updates a workshop by ID
*/
router.post('/modify/:idTaller', workshopsController.modifyWorkshops);

/**
* POST /workshops/delete
* @description Soft deletes a workshop
*/
router.post("/delete", workshopsController.deleteWorkshops);

/**
* GET /workshops/filter/data
* @description Gets category data for filters
*/
router.get("/filter/data", workshopsController.getWorkshopsCategories);

/**
* POST /workshops/filter
* @description Filters workshops by entry hour, date and order
*/
router.post('/filter', workshopsController.viewWorkshopsFiltered);

module.exports = router;
