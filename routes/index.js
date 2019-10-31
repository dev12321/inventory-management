const express = require("express");
const router = express.Router();

const users = require("./users");
const warehouse = require("./warehouse");

router.use("/users", users);
router.use("/warehouse", warehouse);

module.exports = router;
