const uidGenerator = require("../../utils/uniqueIDGenerator");
const mongoose = require("mongoose");
const constants = require("../../utils/constants");

require("../../models/notification");
require("../../models/product");
const notificationModel = mongoose.model("Notification");
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
    product.quantity = quantity ? quantity : 0;

    if (expiryDate) {
      product.expiryDate = expiryDate;
    }
    if (brand) {
      product.brand = brand;
    }
    await new productModel(product).save();
    // console.log(product);
    const notification = {
      title: `New Product Added`,
      body: `A new product with the name '${productName}' is added.`,
      isRead: false,
      accessLevel: 0
    };
    await new notificationModel(notification).save();
    res.status(200).json({ payload: product, message: "success" });
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const updateProduct = async ({ body, user }, res) => {
  const {
    _id,
    UPC,
    productName,
    description,
    quantity,
    manufacturingDate,
    expiryDate,
    brand,
    price,
    group
  } = body;
  if (user.role > 0) {
    const product = await productModel.findById(_id);
    if (product) {
      product.UPC = UPC;
      product.productName = productName;
      product.description = description;
      product.price = price;
      product.manufacturingDate = manufacturingDate;
      product.quantity = quantity;
      product.expiryDate = expiryDate;
      product.brand = brand;
      if (group) product.group = group;
      await product.save();
      const notification = {
        title: `Product Updated`,
        body: `The details of the product with the name '${productName}' is updated.`,
        isRead: false,
        accessLevel: 0
      };
      await new notificationModel(notification).save();
      res.status(200).json({
        payload: product,
        message: "Successfully updated Product"
      });
    } else {
      res.status(404).json({ message: "Product Not Found with the given ID" });
    }
    // await product.save();
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const deleteProduct = async ({ body, user }, res) => {
  const { id } = body;
  if (user.role > 0) {
    const product = await productModel.findByIdAndDelete(id);
    const notification = {
      title: `Product Deleted`,
      body: `The product with the name '${productName}' is deleted.`,
      isRead: false,
      accessLevel: 0
    };
    await new notificationModel(notification).save();
    if (product) {
      res.status(200).json({ payload: product, message: "success" });
    } else {
      res.status(200).json({ err: "product not found" });
    }
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const getProducts = async (req, res) => {
  // console.log(req);
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const products = await productModel
    .find()
    .skip(offset)
    .limit(limit);
  if (products.length > 0)
    res.status(200).json({ payload: products, message: "success" });
  else res.status(200).json({ err: "No Documents Found" });
};

const getProduct = async (req, res) => {
  const products = await productModel.findById(req.params.productID);
  if (products) res.status(200).json({ payload: product, message: "success" });
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
    res.status(200).json({ payload: products, message: "success" });
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
