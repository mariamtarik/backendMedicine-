const Joi = require("joi");

const medicineValidator = Joi.object({
    user: Joi.string().required(),
    MedicineName: Joi.string().required(),
    Dosage: Joi.number().required(),
    Frequency: Joi.number().required(),
  });

   module.exports = medicineValidator;

