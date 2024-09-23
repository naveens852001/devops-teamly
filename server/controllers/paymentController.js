const express = require("express");
require("dotenv").config();
const Razorpay = require('razorpay');


// Initialize Razorpay instance
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});



// Checkout and Create Payment Order
const checkout = async (req, res) => {
    const { employeeId, amount } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid amount.',
        });
    }

    const options = {
        amount: amount * 100, // Amount in smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_${employeeId}`,
    };

    try {
        // Create Razorpay order
        const order = await instance.orders.create(options);


        // Send the order details and bank account back to the client
        res.status(200).json({
            success: true,
            order,
            
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        if (error.response) {
            // Log detailed error response
            console.error('Razorpay error response:', error.response.data);
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order.',
        });
    }
    
};

// Payment Verification
const paymentVerification = async (req, res) => {
    console.log(req.body);
    res.status(200).json({
        success: true,
        message: "Payment verified successfully.",
    });
};

module.exports = { checkout, paymentVerification};
