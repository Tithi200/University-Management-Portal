const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const { sendPaymentReceiptEmail } = require('../services/emailService');
const { generateReceiptPDF } = require('../services/receiptService');
const { sendPaymentSMS, sendAdminNotification } = require('../services/smsService');
const { processPayment, verifyRazorpayPayment } = require('../services/paymentGatewayService');
const bankConfig = require('../config/bankConfig');

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payments by student ID
router.get('/student/:studentId', async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment by payment ID
router.get('/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bank account details
router.get('/bank-details', (req, res) => {
  res.json({
    accountNumber: bankConfig.accountNumber,
    ifscCode: bankConfig.ifscCode,
    bankName: bankConfig.bankName,
    accountHolderName: bankConfig.accountHolderName,
    branch: bankConfig.branch,
    upiId: bankConfig.upiId
  });
});

// Create a new payment (Initiate payment)
router.post('/', async (req, res) => {
  try {
    const { studentId, feeType, amount, paymentMethod, description, studentEmail, studentPhone } = req.body;

    // Validate required fields
    if (!studentId || !feeType || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find student
    const student = await Student.findOne({ studentId: studentId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Use provided phone or student's parent phone
    const phoneNumber = studentPhone || student.parentPhone || '';

    // Determine initial payment status based on method
    const manualMethods = ['Bank Transfer', 'Cash'];
    const initialStatus = manualMethods.includes(paymentMethod) ? 'Verification Pending' : 'Pending';

    // Create payment record
    const paymentData = {
      studentId: studentId,
      studentName: student.name,
      studentEmail: studentEmail || '',
      studentPhone: phoneNumber,
      feeType: feeType,
      amount: parseFloat(amount),
      paymentMethod: paymentMethod,
      description: description || '',
      paymentStatus: initialStatus
    };

    const payment = new Payment(paymentData);
    await payment.save();

    // Process payment based on method
    const paymentResult = await processPayment(
      paymentMethod,
      payment.amount,
      payment.receiptNumber,
      studentId
    );

    res.status(201).json({
      success: true,
      payment: payment,
      paymentFlow: paymentResult,
      message: paymentResult.type === 'gateway' 
        ? 'Redirecting to payment gateway...' 
        : 'Follow the payment instructions below.'
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify and complete payment (for gateway payments)
router.post('/verify', async (req, res) => {
  try {
    const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature, transactionId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    const payment = await Payment.findOne({ paymentId: paymentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Verify payment if Razorpay
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const isValid = await verifyRazorpayPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
      
      if (!isValid) {
        payment.paymentStatus = 'Failed';
        await payment.save();
        return res.status(400).json({ error: 'Payment verification failed' });
      }

      payment.transactionId = razorpayPaymentId;
      payment.paymentStatus = 'Completed';
    } else if (transactionId) {
      // Manual verification with transaction ID
      payment.transactionId = transactionId;
      payment.paymentStatus = 'Completed';
    } else {
      return res.status(400).json({ error: 'Payment verification data missing' });
    }

    await payment.save();

    // Generate receipt PDF
    const receiptBuffer = await generateReceiptPDF(payment);

    // Send email with receipt
    if (payment.studentEmail) {
      try {
        await sendPaymentReceiptEmail(payment.studentEmail, payment.studentName, payment, receiptBuffer);
        payment.receiptSent = true;
        await payment.save();
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    // Send SMS notifications
    if (payment.studentPhone) {
      try {
        await sendPaymentSMS(payment.studentPhone, payment);
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
      }
    }

    // Send admin notification
    try {
      await sendAdminNotification(payment);
    } catch (adminSmsError) {
      console.error('Admin SMS notification failed:', adminSmsError);
    }

    res.json({
      success: true,
      payment: payment,
      receiptUrl: `/api/payments/${payment.paymentId}/receipt`,
      message: 'Payment verified and completed successfully!'
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark payment as completed (for manual verification by admin)
router.post('/:paymentId/complete', async (req, res) => {
  try {
    const { transactionId } = req.body;
    const payment = await Payment.findOne({ paymentId: req.params.paymentId });
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    payment.paymentStatus = 'Completed';
    if (transactionId) {
      payment.transactionId = transactionId;
    }
    await payment.save();

    // Generate receipt and send notifications
    const receiptBuffer = await generateReceiptPDF(payment);
    
    if (payment.studentEmail) {
      try {
        await sendPaymentReceiptEmail(payment.studentEmail, payment.studentName, payment, receiptBuffer);
        payment.receiptSent = true;
        await payment.save();
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    if (payment.studentPhone) {
      try {
        await sendPaymentSMS(payment.studentPhone, payment);
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
      }
    }

    try {
      await sendAdminNotification(payment);
    } catch (adminSmsError) {
      console.error('Admin SMS notification failed:', adminSmsError);
    }

    res.json({
      success: true,
      payment: payment,
      message: 'Payment marked as completed successfully!'
    });
  } catch (error) {
    console.error('Payment completion error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get receipt PDF
router.get('/:paymentId/receipt', async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const receiptBuffer = await generateReceiptPDF(payment);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=receipt-${payment.receiptNumber}.pdf`);
    res.send(receiptBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get receipt HTML (for display)
router.get('/:paymentId/receipt/html', async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const receiptHTML = generateReceiptHTML(payment);
    res.send(receiptHTML);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate receipt HTML
function generateReceiptHTML(payment) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Payment Receipt - ${payment.receiptNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .receipt-container {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #667eea;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #667eea;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #666;
          margin: 5px 0;
        }
        .receipt-title {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 30px;
        }
        .receipt-details {
          margin-bottom: 30px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }
        .detail-label {
          font-weight: 600;
          color: #555;
        }
        .detail-value {
          color: #333;
        }
        .amount-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 30px 0;
        }
        .amount-row {
          display: flex;
          justify-content: space-between;
          font-size: 20px;
          font-weight: bold;
          color: #667eea;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #eee;
          color: #666;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: 600;
          background: #d4edda;
          color: #155724;
        }
        .bank-details-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 30px 0;
        }
        .bank-details-section h3 {
          text-align: center;
          color: #667eea;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .bank-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .bank-detail-item {
          padding: 10px;
          background: white;
          border-radius: 6px;
          font-size: 13px;
        }
        .bank-detail-item strong {
          color: #667eea;
          display: block;
          margin-bottom: 5px;
        }
        @media print {
          body { background: white; }
          .receipt-container { box-shadow: none; }
        }
        @media (max-width: 600px) {
          .bank-details-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="header">
          <h1>🎓 COLLEGE DASHBOARD</h1>
          <p>Official Payment Receipt</p>
        </div>
        
        <div class="receipt-title">PAYMENT RECEIPT</div>
        
        <div class="receipt-details">
          <div class="detail-row">
            <span class="detail-label">Receipt Number:</span>
            <span class="detail-value">${payment.receiptNumber}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment ID:</span>
            <span class="detail-value">${payment.paymentId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">${new Date(payment.paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Time:</span>
            <span class="detail-value">${new Date(payment.paymentDate).toLocaleTimeString('en-US')}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Student ID:</span>
            <span class="detail-value">${payment.studentId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Student Name:</span>
            <span class="detail-value">${payment.studentName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Fee Type:</span>
            <span class="detail-value">${payment.feeType}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Method:</span>
            <span class="detail-value">${payment.paymentMethod}</span>
          </div>
          ${payment.transactionId ? `
          <div class="detail-row">
            <span class="detail-label">Transaction ID:</span>
            <span class="detail-value">${payment.transactionId}</span>
          </div>
          ` : ''}
          ${payment.description ? `
          <div class="detail-row">
            <span class="detail-label">Description:</span>
            <span class="detail-value">${payment.description}</span>
          </div>
          ` : ''}
          <div class="detail-row">
            <span class="detail-label">Payment Status:</span>
            <span class="detail-value"><span class="status-badge">${payment.paymentStatus}</span></span>
          </div>
        </div>
        
        <div class="amount-section">
          <div class="amount-row">
            <span>Total Amount Paid:</span>
            <span>₹${payment.amount.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="bank-details-section">
          <h3>Bank Account Details</h3>
          <div class="bank-details-grid">
            <div class="bank-detail-item">
              <strong>Account Number:</strong> ${bankConfig.accountNumber}
            </div>
            <div class="bank-detail-item">
              <strong>IFSC Code:</strong> ${bankConfig.ifscCode}
            </div>
            <div class="bank-detail-item">
              <strong>Bank Name:</strong> ${bankConfig.bankName}
            </div>
            <div class="bank-detail-item">
              <strong>Branch:</strong> ${bankConfig.branch}
            </div>
            ${bankConfig.upiId ? `
            <div class="bank-detail-item">
              <strong>UPI ID:</strong> ${bankConfig.upiId}
            </div>
            ` : ''}
          </div>
        </div>
        
        <div class="footer">
          <p>This is a computer-generated receipt and does not require a signature.</p>
          <p>Thank you for your payment!</p>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            College Dashboard Payment System<br>
            For queries, contact: payments@collegedashboard.edu
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;

