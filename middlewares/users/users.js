const uidGenerator = require("../../utils/uniqueIDGenerator");
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const constants = require("../../utils/constants");
const jwt = require("jsonwebtoken");

require("../../models/user");
const userModel = mongoose.model("User");

const registerUser = async ({ body }, res) => {
  const { fullName, email, password, phone } = body;

  const Users = new userModel({
    fullName,
    phone,
    role: 2,
    username: email
  });

  userModel.register(Users, password, (err, user) => {
    if (err) {
      res.json({
        success: false,
        message: "Your account could not be saved. Error: ",
        err
      });
    } else {
      res.json({ success: true, message: "Your account has been saved" });
    }
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  req.body.username = email;
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res.json({ success: false, message: err });
    } else {
      if (!user) {
        res.json({
          success: false,
          message: "username or password incorrect"
        });
      } else {
        req.login(user, err => {
          if (err) {
            res.json({ success: false, message: err });
          } else {
            const token = jwt.sign(
              { userId: user._id, username: user.username },
              constants.JWT_SECRET,
              { expiresIn: "24h" }
            );
            res.json({
              success: true,
              message: "Authentication successfull",
              token: token
            });
          }
        });
      }
    }
  })(req, res);
};

const removeUser = ({ body }, res) => {
  const { id, user } = body;
  if (user.role < 1) {
    const user = userModel.findByIdAndDelete(id);
    if (user) {
      res.status(200).json({ payload: user, msg: "success" });
    } else {
      res.status(200).json({ err: "user not found" });
    }
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

module.exports = {
  loginUser,
  registerUser,
  removeUser
};
