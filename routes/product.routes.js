const express = require("express");
const router = express.Router();
const multer = require("multer");

const productController = require("../controllers/product.controller");

const storage = multer.diskStorage({
    destination: (request, file, cb) => cb(null, "uploads/"),
    filename: (request, file, cb) => cb(null, Date.now() + "_" + file.originalname)
})

const upload = multer({ storage });

// POST: Register a new product
router.get("/add", productController.getRegisterProduct);
router.post("/add", upload.single("image"), productController.postRegisterProduct);

// GET: Search products
router.get('/search', productController.searchP);

// GET: Filter products by price/availability/
router.get('/price', productController.filterPriceP);       
router.get('/disponible', productController.filterDisponibleP);   
router.get('/category', productController.filterCategoriaP);    
router.get('/workshop', productController.filterTallerP);   

// GET: Order products
router.get('/order', productController.getOrderedP);

// GET: Consult all products
router.get("/", productController.getProducts);

// GET: Consult one product
router.get("/:idProduct", productController.getOneProduct);

// DELETE: Delete one product
router.delete("/:idProduct", productController.deleteProduct);

//GET: Modify product
router.get("/:idProduct/update", productController.getOneProduct);
router.put("/:idProduct/update", productController.updateProduct);


module.exports = router;