# SMS Notification Setup Guide

## Overview

The payment system now sends SMS notifications to:
1. **Students** - Payment confirmation with receipt details
2. **Admin** - Notification when new payment is received

## SMS Service Configuration

### Option 1: Twilio (Recommended)

1. **Sign up for Twilio:**
   - Go to https://www.twilio.com
   - Create a free account (includes $15.50 free credit)
   - Verify your phone number

2. **Get your credentials:**
   - Account SID
   - Auth Token
   - Phone Number (Twilio number)

3. **Add to `backend/.env`:**
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```

4. **Update admin phone in `backend/config/bankConfig.js`:**
   ```javascript
   registeredPhone: '+91YOUR_PHONE_NUMBER'
   ```

### Option 2: AWS SNS (Alternative)

1. **Set up AWS SNS:**
   - Create AWS account
   - Set up SNS service
   - Get access keys

2. **Add to `backend/.env`:**
   ```env
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   ```

### Option 3: Custom SMS Gateway

Modify `backend/services/smsService.js` to integrate with your preferred SMS provider.

## Bank Account Configuration

Your bank details are configured in `backend/config/bankConfig.js`:

```javascript
accountNumber: '413410110002498',
ifscCode: 'BKID0004134',
bankName: 'Bank of India',
accountHolderName: 'Brainware University',
branch: 'Kolkata',
upiId: 'brainwareuniversity@paytm', // Update with your UPI ID
registeredPhone: '+91XXXXXXXXXX' // Update with your phone
```

## Payment Methods Available

The system now supports:
- ✅ UPI
- ✅ BHIM UPI
- ✅ Google Pay
- ✅ PhonePe
- ✅ Paytm
- ✅ Razorpay
- ✅ Net Banking
- ✅ Credit Card
- ✅ Debit Card
- ✅ Bank Transfer
- ✅ Cash

## SMS Message Format

### Student SMS:
```
Dear [Student Name],

Payment Received Successfully!

Receipt No: [Receipt Number]
Amount: ₹[Amount]
Fee Type: [Fee Type]
Payment Method: [Payment Method]
Date: [Date & Time]

Bank Details:
Account: 413410110002498
IFSC: BKID0004134
Bank: Bank of India

Thank you for your payment!
Brainware University
```

### Admin SMS:
```
New Payment Received!

Student: [Name] ([Student ID])
Amount: ₹[Amount]
Fee: [Fee Type]
Receipt: [Receipt Number]
Payment ID: [Payment ID]

Brainware University
```

## Security Features

1. **Transaction Validation:**
   - All payments are validated before processing
   - Unique payment IDs generated for each transaction
   - Receipt numbers are unique and trackable

2. **Safe Transactions:**
   - Payment data encrypted in database
   - SMS sent only after successful payment
   - Email receipts with PDF attachment
   - Bank details securely stored

3. **Error Handling:**
   - Payment continues even if SMS fails
   - Email and SMS failures don't block payment
   - All errors logged for debugging

## Testing SMS

1. **Without SMS Service:**
   - System will log SMS messages to console
   - Payments will still work
   - You can see what SMS would be sent

2. **With Twilio:**
   - Test with Twilio's test credentials first
   - Verify phone numbers are correct
   - Check Twilio dashboard for delivery status

## Troubleshooting

### SMS Not Sending

1. **Check Configuration:**
   - Verify `.env` file has correct credentials
   - Check phone number format (include country code)
   - Ensure Twilio account has credits

2. **Check Logs:**
   - Look for SMS errors in backend console
   - Check Twilio dashboard for delivery status
   - Verify phone numbers are valid

3. **Phone Number Format:**
   - Use international format: +91XXXXXXXXXX
   - Include country code
   - No spaces or special characters

### Payment Works But No SMS

- Check if SMS service is configured
- Verify phone number in payment form
- Check backend logs for SMS errors
- Payment will still succeed even if SMS fails

## Next Steps

1. **Install Twilio:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment:**
   - Add Twilio credentials to `.env`
   - Update admin phone in `bankConfig.js`

3. **Test Payment:**
   - Process a test payment
   - Verify SMS received
   - Check admin notification

4. **Update UPI ID:**
   - Update `upiId` in `bankConfig.js` with your actual UPI ID

## Notes

- SMS is optional - payments work without it
- Admin notifications help track all payments
- Bank details are shown in payment form and receipts
- All payment methods are supported
- Transactions are secure and validated

