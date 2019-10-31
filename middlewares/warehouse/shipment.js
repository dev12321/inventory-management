const uidGenerator = require("../../utils/uniqueIDGenerator");
const mongoose = require("mongoose");
const constants = require("../../utils/constants");

require("../../models/shipment");
require("../../models/user");
const shipmentModel = mongoose.model("Shipment");

const addShipment = async ({ body }, res) => {
  const { products, status, type, user } = body;
  if (user.role < 2) {
    const shipment = {
      products,
      status,
      type,
      user: user._id
    };

    await new shipmentModel(shipment).save();
    res.status(200).json({ payload: shipment, msg: "success" });
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const updateShipment = async ({ body }, res) => {
  const { id, products, status, type, user } = body;
  if (user.role < 2) {
    const shipment = shipmentModel.findById(id);
    shipment.products = products;
    shipment.status = status;
    shipment.type = type;

    await shipment.save();
    res.status(200).json({ payload: shipment, msg: "success" });
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const deleteShipment = async ({ body }, res) => {
  const { id, user } = body;
  if (user.role < 2) {
    const shipment = ShipmentModel.findByIdAndDelete(id);
    if (shipment) {
      res.status(200).json({ payload: shipment, msg: "success" });
    } else {
      res.status(200).json({ err: "shipment not found" });
    }
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

module.exports = {
  addShipment,
  updateShipment,
  deleteShipment
};
