const express = require("express");
const router = express.Router();

const users = require("./users");
const inventory = require("./inventory");

router.use("/users", users);
router.use("/inventory", inventory);

module.exports = router;
