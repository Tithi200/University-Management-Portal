const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
// For Gmail, you'll need to use an App Password
// For other services, adjust the configuration accordingly
const createTransporter = () => {
  // Use environment variables for email configuration
  const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || ''
    }
  };

  // If no email credentials are provided, return null (email sending will be skipped)
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    console.warn('Email credentials not configured. Email sending will be skipped.');
    return null;
  }

  return nodemailer.createTransport(emailConfig);
};

// Send payment receipt email
const sendPaymentReceiptEmail = async (studentEmail, studentName, payment, receiptBuffer) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email service not configured. Skipping email send.');
    return;
  }

  const mailOptions = {
    from: `"College Dashboard" <${process.env.EMAIL_USER || 'noreply@collegedashboard.edu'}>`,
    to: studentEmail,
    subject: `Payment Receipt - ${payment.receiptNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #f9f9f9;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .receipt-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .info-label {
            font-weight: 600;
            color: #555;
          }
          .amount {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
            font-size: 12px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 College Dashboard</h1>
            <p>Payment Receipt Confirmation</p>
          </div>
          <div class="content">
            <p>Dear ${studentName},</p>
            <p>Thank you for your payment! Your payment has been successfully processed.</p>
            
            <div class="receipt-info">
              <div class="info-row">
                <span class="info-label">Receipt Number:</span>
                <span>${payment.receiptNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment ID:</span>
                <span>${payment.paymentId}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Student ID:</span>
                <span>${payment.studentId}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Fee Type:</span>
                <span>${payment.feeType}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment Method:</span>
                <span>${payment.paymentMethod}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment Date:</span>
                <span>${new Date(payment.paymentDate).toLocaleString('en-US')}</span>
              </div>
            </div>
            
            <div class="amount">
              Amount Paid: ₹${payment.amount.toFixed(2)}
            </div>
            
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/receipt/${payment.paymentId}" class="button">
                View Receipt
              </a>
            </p>
            
            <p>Please keep this receipt for your records. A copy of the receipt is attached to this email.</p>
            
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>College Dashboard Payment System</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: `receipt-${payment.receiptNumber}.pdf`,
        content: receiptBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendPaymentReceiptEmail
};

