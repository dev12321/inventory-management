const express = require("express");
const passport = require("passport");
require("./../config/passportjwt");
const router = express.Router();

const group = require("../middlewares/warehouse/group");
const product = require("../middlewares/warehouse/product");
const shipment = require("../middlewares/warehouse/shipment");

// const validateRegisterInput = require("../middlewares/users/validation/register");
// const validateLoginInput = require("../middlewares/users/validation/login");

router.use(passport.authenticate("jwt", { session: false }));
router.post("/product", product.addProduct);
router.put("/product", product.updateProduct);
router.delete("/product", product.deleteProduct);
router.get("/product/:productID", product.getProduct);
router.get("/product", product.getProducts);
router.get("/product/bygroup/:groupID", product.getProductsByGroup);

router.post("/group", group.addGroup);
router.put("/group", group.updateGroup);
router.delete("/group", group.deleteGroup);
router.get("/group", group.getGroups);

router.post("/shipment", shipment.addShipment);
router.put("/shipment", shipment.updateShipment);
router.delete("/shipment", shipment.deleteShipment);
router.get("/shipment", shipment.getShipments);
router.get("/shipment/bystatus/:status", shipment.getShipmentsByStatus);
router.get("/shipment/bytype/:type", shipment.getShipmentsByType);
router.get("/shipment/:shipmentID", shipment.getShipment);

module.exports = router;
