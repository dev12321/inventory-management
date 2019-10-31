const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const passportLocalMongoose = require("passport-local-mongoose");
// const uidGenerator = require("../utils/uniqueIDGenerator");

// plugin for passport-local-mongoose

// export userschema
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: mongoose.SchemaTypes.String,
      required: [true, "Name is Required"]
    },
    username: {
      type: mongoose.SchemaTypes.String,
      lowercase: true,
      unique: true,
      required: [true, "Email can't be blank"],
      match: [/\S+@\S+\.\S+/, "Email is invalid"]
    },
    phone: mongoose.SchemaTypes.Number,
    role: mongoose.SchemaTypes.Number
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });
UserSchema.plugin(passportLocalMongoose);

mongoose.model("User", UserSchema);
