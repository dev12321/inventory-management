const express = require("express");
const passport = require("passport");
const router = express.Router();
require("./../config/passportjwt");
const users = require("../middlewares/users/users");
const validateRegisterInput = require("../middlewares/users/validation/register");
const validateLoginInput = require("../middlewares/users/validation/login");
// const { verifyToken } = require("../middlewares/serverauth");

router.post("/login", validateLoginInput, users.loginUser);
router.post("/register", validateRegisterInput, users.registerUser);
router.use(passport.authenticate("jwt", { session: false }));
router.delete("/delete", users.removeUser);
router.get("/", users.getUsers);

module.exports = router;
