require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Payment, Callback } = require('ecommpay');



const app = express();
app.use(bodyParser.json());

const projectId = process.env.project_id;
const secret_salt = process.env.secret_salt;


app.post('/pay', (req, res) => {
    // generate a unique paymentId expected 
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
    if (!phone || !paymentId) {
        return res.status(400).send("Missing required fields");
    }

    const payment = new Payment(projectId, secret_salt);
    payment.paymentId = paymentId;
    payment.paymentAmount = amount;
    payment.paymentCurrency = currency;
    payment.customerId = customerId;

    // 3D Secure & billing info
    payment.paymentCustomerPhone = phone;
    payment.paymentCustomerEmail = email;
    payment.paymentBillingPostal = postal;
    payment.paymentBillingCountry = country;
    payment.paymentBillingCity = city;
    payment.paymentBillingAddress = address;

    const url = payment.getUrl();
    res.send({ paymentUrl: url });
});


app.post('/payment/callback', (req, res) => {
    try {
        const callback = new Callback(secret_salt, req.body);

        if (!callback.isSignatureValid()) {
            return res.status(400).send('Bad Request: Invalid signature');
        }
        const paymentId = callback.getPaymentId();
        const paymentData = callback.payment();

        if (callback.isPaymentSuccess()) {

            // if we want to do any database operations we can add them here 
            // mark order as paid, send email etc.
            console.log('Payment Success:', paymentId, paymentData);
        }
        else if (paymentData.status === "decline" || paymentData.status === "fail") {
            // here we would want them to retry the payment 
            // show that there was an issue with the payment, further we will retry - take them back to the main payment page

            console.warn("Payment failed:", paymentId, paymentData.status);
        }
        else {
            console.log("Informational callback received:", paymentData.status);

        }
        res.status(200).send('OK');
    } catch (error) {
        console.error("Server error processing callback:", err);
        return res.status(500).send("Internal Server Error");

    }
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
