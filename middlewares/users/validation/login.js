"use strict";

const { celebrate, Joi } = require("celebrate");

const validateLoginInput = celebrate({
  body: Joi.object().keys({
    password: Joi.string()
      .required()
      .error(new Error("Password is required")),
    email: Joi.string()
      .email()
      .required()
      .error(new Error("Email is required/wrong email"))
  })
});

module.exports = validateLoginInput;
