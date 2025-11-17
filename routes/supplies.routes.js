const express = require("express");
const router = express.Router();
const multer = require("multer");

const suppliesController = require("../controllers/supplies.controller");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname)
})

const upload = multer({ storage });

// Define a GET endpoint to retrieve all supplies
router.get("/", suppliesController.getSupplies);
router.post("/search", suppliesController.searchSupplies);
router.post("/add", upload.single("imagenInsumo"), suppliesController.addOneSupply);

// Define a Post endpoint to delete a supply (US: Delete Supply)
router.post("/delete", suppliesController.deleteOneSupply);

// Define a GET endpoint to retrieve supply categories, measures and workshops
router.get("/filter/data", suppliesController.getFilterData);

// Define a POST endpoint to filter or order supplies
router.post("/filter", suppliesController.filterOrderSupplies);

// Define a GET enpoint to get workshop and supplies
router.get("/workshop/category", suppliesController.getWorkshopAndSupplies)

// Define a PUT endpoint to update one supply
router.put("/update/:idSupply", upload.single("imagenInsumo"), suppliesController.updateOneSupply)

// Export the router to be used in the main routes file
module.exports = router;
