"use strict";

const { celebrate, Joi } = require("celebrate");

const validateLoginInput = celebrate({
  body: Joi.object().keys({
    password: Joi.string()
      .required()
      .min(8)
      .max(12)
      .error(new Error("Enter valid password")),
    email: Joi.string()
      .email()
      .required()
      .error(new Error("Email is required/wrong email"))
  })
});

module.exports = validateLoginInput;
