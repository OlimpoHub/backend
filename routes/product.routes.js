const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");

// POST: Register a new product
router.post("/add", productController.postRegisterProduct);

// GET: Consult all products
router.get("/", productController.getProducts);

// GET: Consult one product
router.get("/:idProduct", productController.getOneProduct);


module.exports = router;