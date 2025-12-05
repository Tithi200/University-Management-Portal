const PDFDocument = require('pdfkit');
const bankConfig = require('../config/bankConfig');

// Generate PDF receipt
const generateReceiptPDF = async (payment) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24)
         .fillColor('#667eea')
         .text('🎓 COLLEGE DASHBOARD', { align: 'center' });
      
      doc.moveDown(0.5);
      doc.fontSize(14)
         .fillColor('#666')
         .text('Official Payment Receipt', { align: 'center' });

      // Line separator
      doc.moveDown(1);
      doc.strokeColor('#667eea')
         .lineWidth(3)
         .moveTo(50, doc.y)
         .lineTo(550, doc.y)
         .stroke();

      doc.moveDown(2);

      // Receipt Title
      doc.fontSize(20)
         .fillColor('#333')
         .text('PAYMENT RECEIPT', { align: 'center', underline: true });

      doc.moveDown(2);

      // Receipt Details
      const details = [
        { label: 'Receipt Number:', value: payment.receiptNumber },
        { label: 'Payment ID:', value: payment.paymentId },
        { label: 'Date:', value: new Date(payment.paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
        { label: 'Time:', value: new Date(payment.paymentDate).toLocaleTimeString('en-US') },
        { label: 'Student ID:', value: payment.studentId },
        { label: 'Student Name:', value: payment.studentName },
        { label: 'Fee Type:', value: payment.feeType },
        { label: 'Payment Method:', value: payment.paymentMethod },
      ];

      if (payment.transactionId) {
        details.push({ label: 'Transaction ID:', value: payment.transactionId });
      }

      if (payment.description) {
        details.push({ label: 'Description:', value: payment.description });
      }

      details.push({ label: 'Payment Status:', value: payment.paymentStatus });

      // Draw details table
      let yPos = doc.y;
      details.forEach((detail, index) => {
        doc.fontSize(11)
           .fillColor('#555')
           .text(detail.label, 50, yPos, { width: 200 });
        
        doc.fillColor('#333')
           .text(detail.value, 250, yPos, { width: 300 });
        
        yPos += 25;
      });

      doc.moveDown(2);

      // Amount section
      doc.rect(50, doc.y, 500, 80)
         .fillColor('#f8f9fa')
         .fill()
         .stroke();

      doc.fontSize(18)
         .fillColor('#333')
         .text('Total Amount Paid:', 70, doc.y + 20, { width: 300 });
      
      doc.fontSize(24)
         .fillColor('#667eea')
         .font('Helvetica-Bold')
         .text(`₹${payment.amount.toFixed(2)}`, 350, doc.y - 4, { width: 200, align: 'right' });

      doc.moveDown(3);

      // Footer
      doc.fontSize(10)
         .fillColor('#666')
         .text('This is a computer-generated receipt and does not require a signature.', { align: 'center' });
      
      doc.moveDown(0.5);
      doc.text('Thank you for your payment!', { align: 'center' });
      
      doc.moveDown(2);
      
      // Bank Details Section
      doc.fontSize(10)
         .fillColor('#333')
         .text('Bank Account Details:', { align: 'center', underline: true });
      
      doc.moveDown(0.5);
      doc.fontSize(9)
         .fillColor('#555')
         .text(`Account Number: ${bankConfig.accountNumber}`, { align: 'center' });
      doc.text(`IFSC Code: ${bankConfig.ifscCode}`, { align: 'center' });
      doc.text(`Bank: ${bankConfig.bankName}`, { align: 'center' });
      doc.text(`Branch: ${bankConfig.branch}`, { align: 'center' });
      
      doc.moveDown(1);
      doc.fontSize(9)
         .fillColor('#999')
         .text('College Dashboard Payment System', { align: 'center' });
      doc.text('For queries, contact: payments@collegedashboard.edu', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateReceiptPDF
};

