const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const constants = require("../utils/constants");
require("./product");
require("./user");

const ShipmentSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: mongoose.SchemaTypes.Number,
          required: true
        }
      }
    ],
    shipmentStatus: {
      type: mongoose.SchemaTypes.Number,
      required: [true, "Specify the shipmentStatus"]
    },
    shipmentName: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Specify the Name"]
    },
    description: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Specify the description"]
    },
    shipmentType: {
      type: mongoose.SchemaTypes.Number,
      required: [true, "Specify the shipmentType"]
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User"
    },
    createdAt: {
      type: mongoose.SchemaTypes.Date,
      default: Date.now()
    }
  }
  // { timestamps: true }
);

ShipmentSchema.plugin(uniqueValidator, { message: "is already taken." });

mongoose.model("Shipment", ShipmentSchema);
