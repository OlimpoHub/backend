const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");

//router.get("/", productController.registerProduct); 

// POST: Register a new product
router.post("/", productController.postRegisterProduct)

module.exports = router;