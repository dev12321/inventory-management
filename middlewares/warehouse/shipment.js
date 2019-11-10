const uidGenerator = require("../../utils/uniqueIDGenerator");
const mongoose = require("mongoose");
const constants = require("../../utils/constants");

require("../../models/shipment");
require("../../models/user");
const shipmentModel = mongoose.model("Shipment");

const addShipment = async ({ body, user }, res) => {
  const { products, status } = body;
  if (user.role > 0) {
    const shipment = {
      products,
      status,
      type: 0,
      user: user._id
    };

    await new shipmentModel(shipment).save();
    res.status(200).json({ payload: shipment, msg: "success" });
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const updateShipment = async ({ body, user }, res) => {
  const { id, products, status, type } = body;
  const shipment = shipmentModel.findById(id);
  shipment.status = status;

  await shipment.save();
  res.status(200).json({ payload: shipment, msg: "success" });
};

const deleteShipment = async ({ body, user }, res) => {
  const { id } = body;
  if (user.role > 0) {
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

const getShipments = async (req, res) => {
  const shipments = await shipmentModel
    .find()
    .skip(req.query.offset)
    .limit(req.query.limit)
    .populate();
  if (shipments.length > 0)
    res.status(200).json({ payload: shipments, msg: "success" });
  else res.status(200).json({ err: "No Documents Found" });
};

const getShipment = async ({ user }, res) => {
  const shipment = await shipmentModel
    .findById(req.params.shipmentID)
    .populate();
  if (shipment) res.status(200).json({ payload: shipment, msg: "success" });
  else res.status(200).json({ err: "No Document Found" });
};

const getShipmentsByStatus = async (req, res) => {
  const shipments = await shipmentModel
    .find({ status: req.params.status })
    .skip(req.query.offset)
    .limit(req.query.limit)
    .populate();
  if (shipments.length > 0)
    res.status(200).json({ payload: shipments, msg: "success" });
  else res.status(200).json({ err: "No Documents Found" });
};
const getShipmentsByType = async (req, res) => {
  const shipments = await shipmentModel
    .find({ type: req.params.type })
    .skip(req.query.offset)
    .limit(req.query.limit)
    .populate();
  if (shipments.length > 0)
    res.status(200).json({ payload: shipments, msg: "success" });
  else res.status(200).json({ err: "No Documents Found" });
};

module.exports = {
  addShipment,
  updateShipment,
  deleteShipment,
  getShipments,
  getShipment,
  getShipmentsByStatus,
  getShipmentsByType
};
