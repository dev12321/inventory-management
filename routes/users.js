const express = require("express");
const router = express.Router();

const users = require("../middlewares/users/users");
// const validateRegisterInput = require("../middlewares/users/validation/register");
// const validateLoginInput = require("../middlewares/users/validation/login");
// const { verifyToken } = require("../middlewares/serverauth");

router.post("/login", users.loginUser);
router.post("/register", users.registerUser);
// router.post("/users/login", validateLoginInput, users.loginUser);
// router.post("/users", validateRegisterInput, users.addUser);
// router.use(verifyToken);
// router.get("/users", users.getUsers);
// router.get("/users/:userId", users.getSingleUser);
// router.put("/users/:userId", users.updateUser);

module.exports = router;
