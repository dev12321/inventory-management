const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require("./group");
require("./user");
const ProductSchema = new mongoose.Schema(
  {
    UPC: {
      type: mongoose.SchemaTypes.Number,
      unique: true,
      required: [true, "UPC can't be blank"]
    },
    productName: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Name is Required"]
    },
    description: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Please provide a description"]
    },
    quantity: {
      type: mongoose.SchemaTypes.Number,
      default: 0
    },
    manufacturingDate: {
      type: mongoose.SchemaTypes.Date
    },
    expiryDate: {
      type: mongoose.SchemaTypes.Date
    },
    brand: {
      type: mongoose.SchemaTypes.String
    },
    group: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Group",
      required: [true, "Specify the group"]
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

ProductSchema.plugin(uniqueValidator, { message: "is already taken." });

mongoose.model("Product", ProductSchema);
