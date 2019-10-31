"use strict";

const { Joi, celebrate } = require("celebrate");

const validateRegisterInput = celebrate({
  body: Joi.object().keys({
    password: Joi.string()
      .required()
      .error(new Error("Password is required")),
    email: Joi.string()
      .email()
      .required()
      .error(new Error("Email is required/wrong email")),
    fullName: Joi.string()
      .required()
      .error(new Error("Full Name is Required")),
    phone: Joi.number()
      .required()
      .error(new Error("Contact number is Required"))
  })
});

module.exports = validateRegisterInput;
