const { Payment } = require('ecommpay');
const Joi = require('joi');
const paymentSchema = require('../validators/validators.payment.js');

const projectId = process.env.project_id;
const secret_salt = process.env.secret_salt;

if (!projectId || !secret_salt) {
    console.error("Missing projectId or secret_salt in environment variables");
    process.exit(1);
}

const initiatePayment = (req, res) => {
    const { error } = paymentSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    const {
        phone,
        email,
        postal,
        country,
        city,
        address,
        amount,
        currency,
        customerId,
        paymentId
    } = req.body;

    const payment = new Payment(projectId, secret_salt);
    payment.paymentId = paymentId;
    payment.paymentAmount = amount;
    payment.paymentCurrency = currency;
    payment.customerId = customerId;

    // 3D Secure and Billing Info
    payment.paymentCustomerPhone = phone;
    payment.paymentCustomerEmail = email;
    payment.paymentBillingPostal = postal;
    payment.paymentBillingCountry = country;
    payment.paymentBillingCity = city;
    payment.paymentBillingAddress = address;

    const url = payment.getUrl();
    res.send({ paymentUrl: url });
};

module.exports = { initiatePayment };
