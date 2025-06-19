require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Payment, Callback } = require('ecommpay');



const app = express();
app.use(bodyParser.json());

const projectId = process.env.project_id;
const secret_salt = process.env.secret_salt;
console.log(projectId + ' ' + secret_salt)

app.get('/pay', (req, res) => {
    const payment = new Payment(projectId, secret_salt);
    payment.paymentId = 'payment_443';
    payment.paymentAmount = 1815;
    payment.paymentCurrency = 'EUR';
    payment.customerId = 'customer_112';

    const url = payment.getUrl();
    res.redirect(url);
});

app.post('/payment/callback', (req, res) => {
    const callback = new Callback(secret_salt, req.body);

    if (!callback.isSignatureValid()) {
        return res.status(400).send('Bad Request');
    }

    if (callback.isPaymentSuccess()) {
        const paymentId = callback.getPaymentId();
        const paymentData = callback.payment();

        // Add your DB update or order confirmation logic here
        console.log('Payment Success:', paymentId, paymentData);
    }

    res.status(200).send('OK');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
