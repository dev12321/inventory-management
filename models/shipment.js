const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const constants = require("../utils/constants");
// const uidGenerator = require("../utils/uniqueIDGenerator");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Name is Required"]
    },
    email: {
      type: mongoose.SchemaTypes.String,
      lowercase: true,
      unique: true,
      required: [true, "Email can't be blank"],
      match: [/\S+@\S+\.\S+/, "Email is invalid"]
    },
    passwordHash: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Password can't be blank"]
    },
    phone: mongoose.SchemaTypes.Number,
    role: mongoose.SchemaTypes.String
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      exp: parseInt(exp.getTime() / 1000)
    },
    constants.JWT_SECRET
  );
};

UserSchema.methods.toAuthJSON = function() {
  return {
    fullName: this.fullName,
    email: this.email,
    token: this.generateJWT()
  };
};

mongoose.model("User", UserSchema);

module.exports = UserSchema;
