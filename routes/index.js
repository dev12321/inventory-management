const express = require("express");
const router = express.Router();

const users = require("./users");
const warehouse = require("./warehouse");
const notification = require("./notification");

router.use("/users", users);
router.use("/warehouse", warehouse);
router.use("/notification", notification);

module.exports = router;
