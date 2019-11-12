const express = require("express");
const passport = require("passport");
require("./../config/passportjwt");
const router = express.Router();

const notification = require("../middlewares/notification/notification");

// const validateRegisterInput = require("../middlewares/users/validation/register");
// const validateLoginInput = require("../middlewares/users/validation/login");

router.use(passport.authenticate("jwt", { session: false }));
router.get("/", notification.getTopNotifications);
router.put("/", notification.readNotification);
router.delete("/", notification.deleteNotification);

module.exports = router;
