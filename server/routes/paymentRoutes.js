const express = require('express');
const router = express.Router();
const { checkout,paymentVerification } = require('../controllers/paymentController');

// Define the route for checkout
router.post('/checkout', checkout); // POST request for checkout
router.route("/paymentverification").post(paymentVerification)

module.exports = router;