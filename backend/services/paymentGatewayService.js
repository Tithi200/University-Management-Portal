// Payment Gateway Service
// Supports Razorpay, Paytm, and other gateways

const Razorpay = require('razorpay');
const bankConfig = require('../config/bankConfig');

// Initialize Razorpay (if configured)
const getRazorpayInstance = () => {
  if (bankConfig.razorpayKeyId && bankConfig.razorpayKeySecret) {
    return new Razorpay({
      key_id: bankConfig.razorpayKeyId,
      key_secret: bankConfig.razorpayKeySecret
    });
  }
  return null;
};

// Create Razorpay order
const createRazorpayOrder = async (amount, currency = 'INR', receiptId) => {
  try {
    const razorpay = getRazorpayInstance();
    
    if (!razorpay) {
      console.log('Razorpay not configured. Using manual payment flow.');
      return null;
    }

    const options = {
      amount: amount * 100, // Amount in paise
      currency: currency,
      receipt: receiptId,
      payment_capture: 1 // Auto capture
    };

    const order = await razorpay.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: bankConfig.razorpayKeyId
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return null;
  }
};

// Verify Razorpay payment
const verifyRazorpayPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  try {
    const razorpay = getRazorpayInstance();
    
    if (!razorpay) {
      return false;
    }

    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', bankConfig.razorpayKeySecret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    return generatedSignature === razorpaySignature;
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return false;
  }
};

// Process payment based on method
const processPayment = async (paymentMethod, amount, receiptId, studentId) => {
  const onlineMethods = ['Razorpay', 'Paytm', 'Net Banking', 'Credit Card', 'Debit Card'];
  const upiMethods = ['UPI', 'BHIM UPI', 'Google Pay', 'PhonePe'];
  const manualMethods = ['Bank Transfer', 'Cash'];

  // Online payment gateway
  if (onlineMethods.includes(paymentMethod)) {
    if (paymentMethod === 'Razorpay') {
      const order = await createRazorpayOrder(amount, 'INR', receiptId);
      if (order) {
        return {
          type: 'gateway',
          gateway: 'razorpay',
          order: order,
          redirect: false
        };
      }
    }
    
    // For other online methods, return manual instructions
    return {
      type: 'manual',
      instructions: bankConfig.paymentInstructions.online,
      bankDetails: true
    };
  }

  // UPI payment
  if (upiMethods.includes(paymentMethod)) {
    return {
      type: 'upi',
      upiId: bankConfig.upiId,
      instructions: bankConfig.paymentInstructions.upi,
      bankDetails: true
    };
  }

  // Manual payment (Bank Transfer or Cash)
  if (manualMethods.includes(paymentMethod)) {
    return {
      type: 'manual',
      instructions: paymentMethod === 'Bank Transfer' 
        ? bankConfig.paymentInstructions.bankTransfer
        : bankConfig.paymentInstructions.cash,
      bankDetails: paymentMethod === 'Bank Transfer',
      requiresVerification: true
    };
  }

  // Default: manual payment
  return {
    type: 'manual',
    instructions: bankConfig.paymentInstructions.bankTransfer,
    bankDetails: true,
    requiresVerification: true
  };
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  processPayment,
  getRazorpayInstance
};

