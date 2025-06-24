const Joi = require('joi');

const paymentSchema = Joi.object({
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    postal: Joi.string().required(),
    country: Joi.string().length(2).required(),
    city: Joi.string().required(),
    address: Joi.string().required(),
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).required(),
    customerId: Joi.string().required(),
    paymentId: Joi.string().required()
});

module.exports = paymentSchema;
