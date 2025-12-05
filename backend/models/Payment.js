const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true,
    default: () => `PAY${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    required: true
  },
  studentId: {
    type: String,
    required: true,
    ref: 'Student'
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  studentPhone: {
    type: String,
    default: ''
  },
  feeType: {
    type: String,
    required: true,
    enum: ['Registration Fee', 'Course Fee', 'Library Fee', 'Lab Fee', 'Examination Fee', 'Hostel Fee', 'Other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'Cash', 'Bank Transfer', 'Razorpay', 'Paytm', 'Google Pay', 'PhonePe', 'BHIM UPI']
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Refunded', 'Verification Pending'],
    default: 'Pending'
  },
  transactionId: {
    type: String,
    default: ''
  },
  receiptNumber: {
    type: String,
    unique: true,
    default: () => `RCP${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ''
  },
  receiptSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);

