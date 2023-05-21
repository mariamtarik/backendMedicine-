const joi = require("joi");

const signupValidator = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi
        .string()
        .required()
        .pattern(new RegExp(/^[A-Z][a-z]{3,8}$/))
     ,
      email: joi.string().email().required(),
      password: joi
        .string()
        .required()
        .pattern(
          new RegExp(/^[A-Z][a-z0-9]{3,8}$/)
        ),
        role: joi.string()
    }),
};
const signinValidator = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required(),
      password: joi
        .string()
        .required()
        .pattern(
          new RegExp(/^[A-Z][a-z0-9]{3,8}$/)
        ),
    }),
};
module.exports = { signupValidator, signinValidator };
