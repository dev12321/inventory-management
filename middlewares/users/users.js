const uidGenerator = require("../../utils/uniqueIDGenerator");
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const constants = require("../../utils/constants");
const jwt = require("jsonwebtoken");

require("../../models/user");
const userModel = mongoose.model("User");

// const registerUser = async ({ body }, res, next) => {
//   const { fullName, email, password, phone } = body;
//   // console.log(fullName, email, password, role, userID);
//   const userData = await userModel.findOne({ email });
//   if (userData) {
//     return res.status(400).json({ err: "Email already exists" });
//   }

//   try {
//     const user = new userModel();

//     user.fullName = fullName;
//     user.email = email;
//     user.phone = phone;
//     user.role = "user";
//     const hashPassword = await bcrypt.hash(password, constants.SALT_ROUNDS);
//     user.passwordHash = hashPassword;
//     await user.save();
//     return res.json({ msg: "user created successfully" });
//     // console.log(newUser);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ err: "Error adding a new user" });
//   }
// };

const registerUser = async ({ body }, res) => {
  const { fullName, email, password, phone } = body;

  Users = new userModel({
    fullName,
    phone,
    role: "user",
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

// const loginUser = async ({ body }, res) => {
//   try {
//     const { email, password } = body;
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ err: true, message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.passwordHash);
//     if (!isMatch) {
//       return res.status(400).json({ err: true, message: "Incorrect Password" });
//     } else {
//       const userToken = await user.toAuthJSON();
//       return res.status(200).json(userToken);
//     }
//   } catch (err) {
//     console.log(err);

//     return res.status(500).json({
//       err: true,
//       message: "Unable to login"
//     });
//   }
// };

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

module.exports = {
  loginUser,
  registerUser
};
