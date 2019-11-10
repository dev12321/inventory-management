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
    status: {
      type: mongoose.SchemaTypes.Number,
      required: [true, "Specify the status"]
    },
    name: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Specify the Name"]
    },
    description: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Specify the description"]
    },
    type: {
      type: mongoose.SchemaTypes.Number,
      required: [true, "Specify the type"]
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

ShipmentSchema.plugin(uniqueValidator, { message: "is already taken." });

mongoose.model("Shipment", ShipmentSchema);
