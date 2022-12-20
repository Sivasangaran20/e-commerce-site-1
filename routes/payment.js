const express = require('express');
const router = express.Router();

const { accessLevelVerifier } = require('../middlewares/verifyToken');
const { PaymentController } = require('../controllers');

router.post('/create-checkout-session', accessLevelVerifier, PaymentController.create_payment);

module.exports = router;