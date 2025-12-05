// SMS Service for payment notifications
// Supports Twilio, AWS SNS, or custom SMS gateway

const twilio = require('twilio');

// Initialize Twilio client (if credentials are provided)
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (accountSid && authToken && phoneNumber) {
    return twilio(accountSid, authToken);
  }
  return null;
};

// Send SMS notification for payment
const sendPaymentSMS = async (phoneNumber, paymentDetails) => {
  try {
    const client = getTwilioClient();
    
    if (!client) {
      console.log('SMS service not configured. SMS sending skipped.');
      console.log('SMS would be sent to:', phoneNumber);
      console.log('Message:', generatePaymentMessage(paymentDetails));
      return null;
    }

    const message = generatePaymentMessage(paymentDetails);
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: phoneNumber
    });

    console.log('SMS sent successfully:', result.sid);
    return result;
  } catch (error) {
    console.error('Error sending SMS:', error);
    // Don't fail payment if SMS fails
    return null;
  }
};

// Generate payment SMS message
const generatePaymentMessage = (payment) => {
  const bankConfig = require('../config/bankConfig');
  
  return `Dear ${payment.studentName},

Payment Received Successfully!

Receipt No: ${payment.receiptNumber}
Amount: ₹${payment.amount.toFixed(2)}
Fee Type: ${payment.feeType}
Payment Method: ${payment.paymentMethod}
Date: ${new Date(payment.paymentDate).toLocaleString('en-IN')}

Bank Details:
Account: ${bankConfig.accountNumber}
IFSC: ${bankConfig.ifscCode}
Bank: ${bankConfig.bankName}

Thank you for your payment!
Brainware University`;
};

// Send payment confirmation to admin
const sendAdminNotification = async (paymentDetails) => {
  try {
    const bankConfig = require('../config/bankConfig');
    const adminPhone = bankConfig.registeredPhone;

    if (!adminPhone || adminPhone === '+91XXXXXXXXXX') {
      console.log('Admin phone number not configured');
      return null;
    }

    const message = `New Payment Received!

Student: ${paymentDetails.studentName} (${paymentDetails.studentId})
Amount: ₹${paymentDetails.amount.toFixed(2)}
Fee: ${paymentDetails.feeType}
Receipt: ${paymentDetails.receiptNumber}
Payment ID: ${paymentDetails.paymentId}

Brainware University`;

    return await sendPaymentSMS(adminPhone, { ...paymentDetails, isAdmin: true });
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return null;
  }
};

module.exports = {
  sendPaymentSMS,
  sendAdminNotification,
  generatePaymentMessage
};

