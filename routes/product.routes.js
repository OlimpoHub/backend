const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");

//router.get("/", productController.registerProduct); 
router.post("/", productController.postRegisterProduct)

module.exports = router;