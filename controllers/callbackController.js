const { Callback } = require('ecommpay');
const secret_salt = process.env.secret_salt;

const handleCallback = (req, res) => {
    try {
        const callback = new Callback(secret_salt, req.body);

        if (!callback.isSignatureValid()) {
            return res.status(400).send('Bad Request: Invalid signature');
        }

        const paymentId = callback.getPaymentId();
        const paymentData = callback.payment();

        if (callback.isPaymentSuccess()) {
            console.log('Payment Success:', paymentId, paymentData.status);
            // TODO: mark order as paid, send email, etc.
        } else if (paymentData.status === "decline" || paymentData.status === "fail") {
            console.warn("Payment failed:", paymentId, paymentData.status);
        } else {
            console.log("Informational callback received:", paymentData.status);
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error("Server error processing callback:", error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = { handleCallback };
