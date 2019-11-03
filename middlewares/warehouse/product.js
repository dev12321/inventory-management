const uidGenerator = require("../../utils/uniqueIDGenerator");
const mongoose = require("mongoose");
const constants = require("../../utils/constants");

require("../../models/product");
const productModel = mongoose.model("Product");

const addProduct = async ({ body, user }, res) => {
  const {
    UPC,
    productName,
    description,
    quantity,
    manufacturingDate,
    expiryDate,
    price,
    brand,
    group
  } = body;

  if (user.role > 0) {
    const product = {
      UPC,
      productName,
      price,
      description,
      group,
      user: user._id
    };

    if (manufacturingDate) {
      product.manufacturingDate = manufacturingDate;
    }
    if (quantity) {
      product.quantity = quantity;
    }
    if (expiryDate) {
      product.expiryDate = expiryDate;
    }
    if (brand) {
      product.brand = brand;
    }
    await new productModel(product).save();
    console.log(product);

    res.status(200).json({ payload: product, msg: "success" });
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const updateProduct = async ({ body, user }, res) => {
  const {
    id,
    UPC,
    productName,
    description,
    quantity,
    manufacturingDate,
    expiryDate,
    brand,
    group
  } = body;
  if (user.role > 0) {
    const product = await productModel.findById(id);
    // product.UPC = UPC;
    // product.productName = productName;
    product.description = description;
    // product.group = group;

    // if (manufacturingDate) {
    // product.manufacturingDate = manufacturingDate;
    // }
    if (quantity) {
      product.quantity = quantity;
    }
    // if (expiryDate) {
    // product.expiryDate = expiryDate;
    // }
    // if (brand) {
    // product.brand = brand;
    // }
    await product.save();
    res.status(200).json({ payload: product, msg: "success" });
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const deleteProduct = async ({ body, user }, res) => {
  const { id } = body;
  if (user.role > 0) {
    const product = await productModel.findByIdAndDelete(id);

    if (product) {
      res.status(200).json({ payload: product, msg: "success" });
    } else {
      res.status(200).json({ err: "product not found" });
    }
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const getProducts = async (req, res) => {
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const products = await productModel
    .find()
    .skip(offset)
    .limit(limit);
  if (products.length > 0)
    res.status(200).json({ payload: products, msg: "success" });
  else res.status(200).json({ err: "No Documents Found" });
};

const getProduct = async (req, res) => {
  const products = await productModel.findById(req.params.productID);
  if (products) res.status(200).json({ payload: product, msg: "success" });
  else res.status(200).json({ err: "No Document Found" });
};

const getProductsByGroup = async (req, res) => {
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const products = await productModel
    .find({ group: req.params.groupID })
    .skip(offset)
    .limit(limit);
  if (products.length > 0)
    res.status(200).json({ payload: products, msg: "success" });
  else res.status(200).json({ err: "No Documents Found" });
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProduct,
  getProductsByGroup
};
