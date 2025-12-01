const express = require("express");
const router = express.Router();

const beneficiary_routes = require('./beneficiary.routes');
const user_routes = require('./user.routes');
const suppliesRoutes = require("./supplies.routes");
const workshopsRoutes = require("./workshops.routes");
const externalCollabsRoutes = require("./externalCollabs.routes");
const supplyBatchRouter = require("./supplyBatch.routes")
const productBatchRouter = require("./productBatch.routes")
const productRoutes = require("./product.routes")
const calendarRoutes = require('./calendar.routes');
const qrRoutes = require('./qr.routes');
const discapacityRoutes = require("./discapacity.routes");
const disabilitiesRoutes = require('./disabilities.routes');
const notificationsRoutes = require('./notifications.routes');
const {authenticateToken} = require("../utils/auth.middleware");

router.use(authenticateToken);

router.use("/beneficiary", beneficiary_routes);
// Supplies routes
router.use("/supplies", suppliesRoutes);
router.use("/user", externalCollabsRoutes);
router.use("/supplyBatch", supplyBatchRouter);
router.use("/workshop", workshopsRoutes);
router.use("/productBatch", productBatchRouter);
router.use("/product", productRoutes);
router.use("/calendar", calendarRoutes);
router.use("/qr", qrRoutes);
router.use("/discapacity", discapacityRoutes);
router.use("/disabilities", disabilitiesRoutes);
router.use("/notifications", notificationsRoutes);


module.exports = router;