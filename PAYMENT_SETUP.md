# Payment Management Setup Guide

## Overview

The Payment Management system allows you to:
- Process student fee payments (Registration, Course, Library, Lab, Examination, Hostel fees)
- Generate virtual receipts (PDF and HTML)
- Send receipt emails to students automatically
- Track payment history for each student

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `nodemailer` - For sending emails
- `pdfkit` - For generating PDF receipts

### 2. Configure Email (Optional but Recommended)

To send receipt emails, configure email settings in `backend/.env`:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

#### For Gmail Users:

1. Enable 2-Factor Authentication on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Use this App Password (not your regular password) in `EMAIL_PASSWORD`

#### For Other Email Providers:

- **Outlook/Hotmail**: `smtp-mail.outlook.com`, port 587
- **Yahoo**: `smtp.mail.yahoo.com`, port 587
- **Custom SMTP**: Use your provider's SMTP settings

**Note:** If email is not configured, payments will still work but receipts won't be emailed. Students can still download receipts from the system.

### 3. Start Backend Server

```bash
npm start
```

## Frontend Setup

No additional setup needed! The Payment Management component is already integrated.

## How to Use

### Processing a Payment

1. Navigate to **Payment Management** from the dashboard
2. Select a student from the list
3. Fill in the payment form:
   - **Fee Type**: Select the type of fee
   - **Amount**: Enter the payment amount
   - **Payment Method**: Select how payment was made
   - **Student Email**: Enter student's email (required for email receipt)
   - **Description**: Optional notes
4. Click **Process Payment**
5. Receipt will be generated and emailed automatically

### Viewing Receipts

- **View Receipt**: Opens receipt in browser (HTML format)
- **Download PDF**: Downloads PDF receipt file

### Payment History

All payments for a student are displayed in the Payment History section, showing:
- Receipt number
- Fee type
- Amount
- Payment method
- Date and time
- Payment status

## Fee Types Available

- **Registration Fee**: Initial registration fee
- **Course Fee**: Course tuition fee
- **Library Fee**: Library access fee
- **Lab Fee**: Laboratory fee
- **Examination Fee**: Exam fee
- **Hostel Fee**: Hostel accommodation fee
- **Other**: Any other fee type

## Payment Methods

- Credit Card
- Debit Card
- Net Banking
- UPI
- Cash
- Bank Transfer

## Receipt Features

Each receipt includes:
- Unique Receipt Number
- Payment ID
- Student ID and Name
- Fee Type
- Amount Paid
- Payment Method
- Payment Date and Time
- Transaction ID (if provided)
- Payment Status

## Email Receipt

When a payment is processed:
1. Receipt PDF is generated
2. Email is sent to student's email address
3. Email contains:
   - Payment confirmation
   - Receipt details
   - Link to view receipt online
   - PDF attachment

## API Endpoints

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/student/:studentId` - Get payments for a student
- `GET /api/payments/:paymentId` - Get payment by ID
- `POST /api/payments` - Create new payment
- `GET /api/payments/:paymentId/receipt` - Download PDF receipt
- `GET /api/payments/:paymentId/receipt/html` - View HTML receipt

## Database Schema

### Payment Model
```javascript
{
  paymentId: String (unique, auto-generated),
  studentId: String (required),
  studentName: String (required),
  studentEmail: String (required),
  feeType: String (required),
  amount: Number (required),
  paymentMethod: String (required),
  paymentStatus: String (default: 'Completed'),
  receiptNumber: String (unique, auto-generated),
  paymentDate: Date (default: now),
  receiptSent: Boolean (default: false)
}
```

## Troubleshooting

### Email Not Sending

1. **Check Email Configuration**: Verify `.env` file has correct email settings
2. **Check App Password**: For Gmail, make sure you're using App Password, not regular password
3. **Check Backend Logs**: Look for email errors in console
4. **Test Email Service**: Payments will still work without email

### Receipt Not Generating

1. **Check Backend Logs**: Look for PDF generation errors
2. **Verify Dependencies**: Make sure `pdfkit` is installed
3. **Check File Permissions**: Ensure backend can write files

### Payment Not Saving

1. **Check MongoDB Connection**: Verify database is connected
2. **Check Student Exists**: Student must exist in database first
3. **Check Required Fields**: All required fields must be filled

## Security Notes

- Payment processing is simulated (no actual payment gateway integration)
- For production, integrate with payment gateways like:
  - Razorpay
  - Stripe
  - PayPal
  - PayU
- Always use HTTPS in production
- Store sensitive data securely
- Implement proper authentication

## Future Enhancements

- Payment gateway integration
- Recurring payment support
- Payment reminders
- Fee structure management
- Payment analytics dashboard
- Bulk payment processing
- Payment refunds

