// Bank Account Configuration - University Account
module.exports = {
  accountNumber: '413410110002498',
  ifscCode: 'BKID0004134',
  bankName: 'Bank of India',
  accountHolderName: 'Brainware University',
  branch: 'Kolkata',
  upiId: 'brainwareuniversity@paytm', // Update with your actual UPI ID
  registeredPhone: '+91XXXXXXXXXX', // Update with your registered phone number
  // Payment Gateway Configuration
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  // Payment Instructions
  paymentInstructions: {
    bankTransfer: 'Transfer the amount to the university account details shown above. Include your Student ID in the transaction remarks.',
    upi: 'Use the UPI ID shown above or scan the QR code. Include your Student ID in the payment note.',
    cash: 'Pay at the university office during working hours. Bring your Student ID card.',
    online: 'Complete payment through the selected payment gateway. You will be redirected to secure payment page.'
  }
};

