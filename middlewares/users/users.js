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
    role: 0,
    username: email,
    isVerified: false
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
    // console.log(err, user, info);

    if (err) {
      res.json(500, {
        success: false,
        message: "Server Error"
      });
    } else {
      if (!user) {
        res.json(403, {
          success: false,
          message: "Email/Password is incorrect"
        });
      } else if (!user.isVerified) {
        res.json(401, {
          success: false,
          message: "Your account is still under review"
        });
      } else {
        req.login(user, err => {
          if (err) {
            res.json(500, {
              success: false,
              message: "Server Error"
            });
          } else {
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
                role: user.role,
                fullName: user.fullName
              },
              constants.JWT_SECRET,
              { expiresIn: "24h" }
            );
            res.json({
              success: true,
              message: "Authentication successfull",
              token: token,
              user: {
                fullName: user.fullName,
                email: user.username,
                phone: user.phone,
                role: user.role
              }
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
      res.status(200).json({ payload: user, message: "success" });
    } else {
      res.status(200).json({ err: "user not found" });
    }
  } else {
    res.status(403).json({ err: "Not Autherised" });
  }
};

const getUsers = async (req, res) => {
  // console.log(req);
  const users = await userModel.find();
  if (users.length > 0)
    res.status(200).json({ payload: users, message: "success" });
  else res.status(200).json({ message: "No Documents Found" });
};

module.exports = {
  loginUser,
  registerUser,
  removeUser,
  getUsers
};
