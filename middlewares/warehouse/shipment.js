const uidGenerator = require("../../utils/uniqueIDGenerator");
const mongoose = require("mongoose");
const constants = require("../../utils/constants");

require("../../models/shipment");
require("../../models/user");
const ShipmentModel = mongoose.model("Shipment");
const ProductModel = mongoose.model("Product");

const addShipment = async ({ body, user }, res) => {
  const { products, shipmentType, shipmentName, description } = body;
  // console.log(user);
  // console.log(shipmentName, description);
  if (user.role > 0) {
    const shipment = {
      products,
      shipmentType,
      shipmentName,
      description,
      shipmentStatus: 0,
      user: user._id
    };
    if (shipmentType === 1) {
      const bulkWriteRes = await ProductModel.bulkWrite(
        products.map(prod => {
          return {
            updateOne: {
              filter: { _id: prod.product },
              update: { $inc: { quantity: -1 * prod.quantity } }
            }
          };
        })
      );
      console.log(bulkWriteRes);
    }
    await new ShipmentModel(shipment).save();
    res
      .status(200)
      .json({ payload: shipment, message: "Shipment succesfully added" });
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const updateShipment = async ({ body, user }, res) => {
  const { id, type } = body;

  const shipment = await ShipmentModel.findById(id);
  // console.log(shipment);
  const { products } = shipment;

  if (type === "CANCEL") {
    if (shipment.shipmentType === 1) {
      const bulkWriteRes = await ProductModel.bulkWrite(
        products.map(prod => {
          return {
            updateOne: {
              filter: { _id: prod.product },
              update: { $inc: { quantity: prod.quantity } }
            }
          };
        })
      );
      console.log(bulkWriteRes);
    }
    shipment.shipmentStatus = 2;
  } else if (type === "COMPLETE") {
    if (shipment.shipmentType === 0) {
      const bulkWriteRes = await ProductModel.bulkWrite(
        products.map(prod => {
          return {
            updateOne: {
              filter: { _id: prod.product },
              update: { $inc: { quantity: prod.quantity } }
            }
          };
        })
      );
      console.log(bulkWriteRes);
    }
    shipment.shipmentStatus = 1;
  }

  await shipment.save();
  res.status(200).json({ payload: shipment, message: "success" });
};

const deleteShipment = async ({ body, user }, res) => {
  const { id } = body;
  if (user.role > 0) {
    const shipment = ShipmentModel.findByIdAndDelete(id);
    if (shipment) {
      res.status(200).json({ payload: shipment, message: "success" });
    } else {
      res.status(200).json({ err: "shipment not found" });
    }
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const getShipments = async (req, res) => {
  const shipments = await ShipmentModel.find()
    .skip(req.query.offset)
    .limit(req.query.limit)
    .populate();
  if (shipments.length > 0)
    res.status(200).json({ payload: shipments, message: "success" });
  else res.status(200).json({ err: "No Documents Found" });
};

const getShipment = async ({ user }, res) => {
  const shipment = await ShipmentModel.findById(
    req.params.shipmentID
  ).populate();
  if (shipment) res.status(200).json({ payload: shipment, message: "success" });
  else res.status(200).json({ err: "No Document Found" });
};

const getShipmentsByStatus = async (req, res) => {
  const shipments = await ShipmentModel.find({
    shipmentStatus: req.params.shipmentStatus
  })
    .skip(req.query.offset)
    .limit(req.query.limit)
    .populate();
  if (shipments.length > 0)
    res.status(200).json({ payload: shipments, message: "success" });
  else res.status(200).json({ err: "No Documents Found" });
};
const getShipmentsByType = async (req, res) => {
  const shipments = await ShipmentModel.find({
    shipmentType: req.params.shipmentType
  })
    .skip(req.query.offset)
    .limit(req.query.limit)
    .populate();
  if (shipments.length > 0)
    res.status(200).json({ payload: shipments, message: "success" });
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
