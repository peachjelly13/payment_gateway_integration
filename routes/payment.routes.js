const express = require('express');
const rateLimit = require('express-rate-limit');
const { initiatePayment } = require('../controllers/paymentController');
const { handleCallback } = require('../controllers/callbackController');

const router = express.Router();

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10
});

router.post('/pay', limiter, initiatePayment);
router.post('/payment/callback', handleCallback);

module.exports = router;
