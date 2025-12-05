import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentManagement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PaymentManagement = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    studentId: '',
    feeType: 'Registration Fee',
    amount: '',
    paymentMethod: 'UPI',
    description: '',
    studentEmail: '',
    studentPhone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [paymentFlow, setPaymentFlow] = useState(null);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [transactionId, setTransactionId] = useState('');

  const feeTypes = [
    'Registration Fee',
    'Course Fee',
    'Library Fee',
    'Lab Fee',
    'Examination Fee',
    'Hostel Fee',
    'Other'
  ];

  const paymentMethods = [
    { value: 'UPI', label: 'UPI', icon: '📱' },
    { value: 'BHIM UPI', label: 'BHIM UPI', icon: '💳' },
    { value: 'Google Pay', label: 'Google Pay', icon: '💚' },
    { value: 'PhonePe', label: 'PhonePe', icon: '📞' },
    { value: 'Paytm', label: 'Paytm', icon: '💙' },
    { value: 'Razorpay', label: 'Razorpay', icon: '💳' },
    { value: 'Net Banking', label: 'Net Banking', icon: '🏦' },
    { value: 'Credit Card', label: 'Credit Card', icon: '💳' },
    { value: 'Debit Card', label: 'Debit Card', icon: '💳' },
    { value: 'Bank Transfer', label: 'Bank Transfer', icon: '🏦' },
    { value: 'Cash', label: 'Cash', icon: '💵' }
  ];

  useEffect(() => {
    fetchStudents();
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/payments/bank-details`);
      setBankDetails(response.data);
    } catch (error) {
      console.error('Error fetching bank details:', error);
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      fetchPayments(selectedStudent.studentId);
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const fetchPayments = async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/payments/student/${studentId}`);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setPaymentData({
      ...paymentData,
      studentId: student.studentId,
      studentEmail: '',
      studentPhone: student.parentPhone || ''
    });
    setShowPaymentForm(true);
    setReceipt(null);
    setMessage('');
    setError('');
  };

  const handleInputChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/payments`, paymentData);
      
      const payment = response.data.payment;
      const flow = response.data.paymentFlow;
      
      setCurrentPayment(payment);
      setPaymentFlow(flow);
      
      // If gateway payment, handle Razorpay
      if (flow && flow.type === 'gateway' && flow.gateway === 'razorpay') {
        handleRazorpayPayment(flow.order, payment);
      } else {
        // Show payment instructions for manual/UPI payments
        setShowPaymentInstructions(true);
        setMessage(response.data.message || 'Payment initiated. Follow the instructions below.');
      }
      
      // Refresh payments list
      if (selectedStudent) {
        fetchPayments(selectedStudent.studentId);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRazorpayPayment = (order, payment) => {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Brainware University',
        description: `${payment.feeType} Payment`,
        order_id: order.orderId,
        handler: async function (response) {
          // Verify payment
          try {
            const verifyResponse = await axios.post(`${API_URL}/payments/verify`, {
              paymentId: payment.paymentId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            
            setReceipt(verifyResponse.data.payment);
            setMessage('Payment completed successfully! Receipt sent to your email.');
            setShowPaymentInstructions(false);
            setShowPaymentForm(false);
            
            if (selectedStudent) {
              fetchPayments(selectedStudent.studentId);
            }
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: selectedStudent?.name || '',
          email: paymentData.studentEmail || '',
          contact: paymentData.studentPhone || ''
        },
        theme: {
          color: '#667eea'
        },
        modal: {
          ondismiss: function() {
            setError('Payment cancelled');
          }
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    };
    document.body.appendChild(script);
  };

  const handleManualPaymentComplete = async () => {
    if (!transactionId.trim()) {
      setError('Please enter transaction ID');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/payments/${currentPayment.paymentId}/complete`, {
        transactionId: transactionId
      });
      
      setReceipt(response.data.payment);
      setMessage('Payment marked as completed! Receipt sent to your email.');
      setShowPaymentInstructions(false);
      setShowPaymentForm(false);
      setTransactionId('');
      
      if (selectedStudent) {
        fetchPayments(selectedStudent.studentId);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete payment. Please try again.');
    }
  };

  const viewReceipt = (paymentId) => {
    window.open(`${API_URL}/payments/${paymentId}/receipt/html`, '_blank');
  };

  const downloadReceipt = (paymentId) => {
    window.open(`${API_URL}/payments/${paymentId}/receipt`, '_blank');
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="payment-management">
      <div className="section-header">
        <h2>Payment Management</h2>
        <p>Process student fees and generate receipts</p>
      </div>

      <div className="payment-container">
        <div className="payment-sidebar">
          <div className="student-search-section">
            <h3>Select Student</h3>
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="search-input"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                // Filter students based on search
              }}
            />
          </div>

          <div className="student-list-section">
            {loading ? (
              <div className="loading">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="no-students">No students found</div>
            ) : (
              <div className="student-items">
                {students.map((student) => (
                  <div
                    key={student._id}
                    className={`student-item ${selectedStudent?._id === student._id ? 'active' : ''}`}
                    onClick={() => handleStudentSelect(student)}
                  >
                    <div className="student-item-name">{student.name}</div>
                    <div className="student-item-id">{student.studentId}</div>
                    <div className="student-item-course">{student.course || 'No course'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="payment-main">
          {selectedStudent ? (
            <>
              {showPaymentForm ? (
                <div className="payment-form-container">
                  <h3>Process Payment for {selectedStudent.name}</h3>
                  <form onSubmit={handleSubmit} className="payment-form">
                    <div className="form-group">
                      <label>Student ID</label>
                      <input
                        type="text"
                        value={paymentData.studentId}
                        disabled
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Student Name</label>
                      <input
                        type="text"
                        value={selectedStudent.name}
                        disabled
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Fee Type <span className="required">*</span></label>
                      <select
                        name="feeType"
                        value={paymentData.feeType}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      >
                        {feeTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Amount (₹) <span className="required">*</span></label>
                      <input
                        type="number"
                        name="amount"
                        value={paymentData.amount}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter amount"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Payment Method <span className="required">*</span></label>
                      <select
                        name="paymentMethod"
                        value={paymentData.paymentMethod}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      >
                        {paymentMethods.map((method) => (
                          <option key={method.value} value={method.value}>
                            {method.icon} {method.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Bank Details Section */}
                    {bankDetails && (
                      <div className="bank-details-section">
                        <div className="bank-details-header">
                          <h4>💰 Bank Account Details</h4>
                          <button
                            type="button"
                            onClick={() => setShowBankDetails(!showBankDetails)}
                            className="toggle-bank-details"
                          >
                            {showBankDetails ? 'Hide' : 'Show'} Details
                          </button>
                        </div>
                        {showBankDetails && (
                          <div className="bank-details-card">
                            <div className="bank-detail-row">
                              <span className="bank-label">Account Number:</span>
                              <span className="bank-value">{bankDetails.accountNumber}</span>
                              <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(bankDetails.accountNumber)}
                                className="copy-btn"
                                title="Copy"
                              >
                                📋
                              </button>
                            </div>
                            <div className="bank-detail-row">
                              <span className="bank-label">IFSC Code:</span>
                              <span className="bank-value">{bankDetails.ifscCode}</span>
                              <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(bankDetails.ifscCode)}
                                className="copy-btn"
                                title="Copy"
                              >
                                📋
                              </button>
                            </div>
                            <div className="bank-detail-row">
                              <span className="bank-label">Bank Name:</span>
                              <span className="bank-value">{bankDetails.bankName}</span>
                            </div>
                            <div className="bank-detail-row">
                              <span className="bank-label">Account Holder:</span>
                              <span className="bank-value">{bankDetails.accountHolderName}</span>
                            </div>
                            <div className="bank-detail-row">
                              <span className="bank-label">Branch:</span>
                              <span className="bank-value">{bankDetails.branch}</span>
                            </div>
                            {bankDetails.upiId && (
                              <div className="bank-detail-row">
                                <span className="bank-label">UPI ID:</span>
                                <span className="bank-value">{bankDetails.upiId}</span>
                                <button
                                  type="button"
                                  onClick={() => navigator.clipboard.writeText(bankDetails.upiId)}
                                  className="copy-btn"
                                  title="Copy"
                                >
                                  📋
                                </button>
                              </div>
                            )}
                            <div className="bank-note">
                              <strong>Note:</strong> Use these details for Bank Transfer or UPI payments. SMS confirmation will be sent to your registered phone number.
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="form-group">
                      <label>Student Phone Number <span className="required">*</span></label>
                      <input
                        type="tel"
                        name="studentPhone"
                        value={paymentData.studentPhone}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="+91XXXXXXXXXX"
                        required
                      />
                      <small>SMS confirmation will be sent to this number</small>
                    </div>

                    <div className="form-group">
                      <label>Student Email <span className="required">*</span></label>
                      <input
                        type="email"
                        name="studentEmail"
                        value={paymentData.studentEmail}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="student@example.com"
                        required
                      />
                      <small>Receipt will be sent to this email</small>
                    </div>

                    <div className="form-group">
                      <label>Description (Optional)</label>
                      <textarea
                        name="description"
                        value={paymentData.description}
                        onChange={handleInputChange}
                        className="form-input"
                        rows="3"
                        placeholder="Additional notes..."
                      />
                    </div>

                    {error && (
                      <div className="error-message">
                        ❌ {error}
                      </div>
                    )}

                    {message && (
                      <div className="success-message">
                        ✅ {message}
                      </div>
                    )}

                    {/* Payment Instructions */}
                    {showPaymentInstructions && paymentFlow && (
                      <div className="payment-instructions">
                        <h4>📋 Payment Instructions</h4>
                        
                        {paymentFlow.type === 'upi' && (
                          <div className="instruction-card upi-instruction">
                            <h5>💳 UPI Payment</h5>
                            <div className="upi-details">
                              <div className="upi-id-display">
                                <strong>UPI ID:</strong>
                                <span className="upi-value">{paymentFlow.upiId}</span>
                                <button
                                  type="button"
                                  onClick={() => navigator.clipboard.writeText(paymentFlow.upiId)}
                                  className="copy-btn-small"
                                  title="Copy UPI ID"
                                >
                                  📋
                                </button>
                              </div>
                              <p className="instruction-text">{paymentFlow.instructions}</p>
                              <div className="amount-display">
                                <strong>Amount to Pay:</strong> ₹{paymentData.amount}
                              </div>
                              <div className="note-box">
                                <strong>Important:</strong> Include your Student ID ({paymentData.studentId}) in the payment note/remarks.
                              </div>
                            </div>
                            
                            {paymentFlow.bankDetails && bankDetails && (
                              <div className="bank-info-inline">
                                <p><strong>Bank:</strong> {bankDetails.bankName}</p>
                                <p><strong>Account:</strong> {bankDetails.accountNumber} | <strong>IFSC:</strong> {bankDetails.ifscCode}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {paymentFlow.type === 'manual' && (
                          <div className="instruction-card manual-instruction">
                            <h5>🏦 {paymentData.paymentMethod} Payment</h5>
                            <p className="instruction-text">{paymentFlow.instructions}</p>
                            
                            {paymentFlow.bankDetails && bankDetails && (
                              <div className="bank-details-display">
                                <div className="bank-detail-item">
                                  <strong>Account Number:</strong> 
                                  <span>{bankDetails.accountNumber}</span>
                                  <button
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(bankDetails.accountNumber)}
                                    className="copy-btn-small"
                                  >
                                    📋
                                  </button>
                                </div>
                                <div className="bank-detail-item">
                                  <strong>IFSC Code:</strong> 
                                  <span>{bankDetails.ifscCode}</span>
                                  <button
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(bankDetails.ifscCode)}
                                    className="copy-btn-small"
                                  >
                                    📋
                                  </button>
                                </div>
                                <div className="bank-detail-item">
                                  <strong>Bank Name:</strong> <span>{bankDetails.bankName}</span>
                                </div>
                                <div className="bank-detail-item">
                                  <strong>Account Holder:</strong> <span>{bankDetails.accountHolderName}</span>
                                </div>
                                <div className="bank-detail-item">
                                  <strong>Branch:</strong> <span>{bankDetails.branch}</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="amount-display">
                              <strong>Amount to Pay:</strong> ₹{paymentData.amount}
                            </div>
                            
                            {paymentFlow.requiresVerification && (
                              <div className="verification-section">
                                <h6>After making payment:</h6>
                                <div className="form-group">
                                  <label>Transaction ID / Reference Number <span className="required">*</span></label>
                                  <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter transaction ID from bank/UPI"
                                  />
                                  <small>Enter the transaction ID or reference number from your payment confirmation</small>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleManualPaymentComplete}
                                  className="btn-primary"
                                  disabled={!transactionId.trim()}
                                >
                                  ✅ Complete Payment
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="form-actions">
                      {!showPaymentInstructions ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setShowPaymentForm(false);
                              setReceipt(null);
                              setError('');
                              setMessage('');
                              setPaymentFlow(null);
                              setShowPaymentInstructions(false);
                            }}
                            className="btn-secondary"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary"
                          >
                            {submitting ? 'Processing...' : 'Initiate Payment'}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setShowPaymentInstructions(false);
                            setPaymentFlow(null);
                            setCurrentPayment(null);
                            setTransactionId('');
                            setShowPaymentForm(false);
                          }}
                          className="btn-secondary"
                        >
                          Close Instructions
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              ) : (
                <div className="payment-history-container">
                  <div className="student-info-header">
                    <h3>{selectedStudent.name}</h3>
                    <p>Student ID: {selectedStudent.studentId}</p>
                    <button
                      onClick={() => setShowPaymentForm(true)}
                      className="btn-primary"
                    >
                      + New Payment
                    </button>
                  </div>

                  {receipt && (
                    <div className="receipt-preview">
                      <h4>Latest Receipt</h4>
                      <div className="receipt-card">
                        <div className="receipt-header">
                          <span className="receipt-number">{receipt.receiptNumber}</span>
                          <span className="receipt-status">{receipt.paymentStatus}</span>
                        </div>
                        <div className="receipt-body">
                          <p><strong>Fee Type:</strong> {receipt.feeType}</p>
                          <p><strong>Amount:</strong> {formatCurrency(receipt.amount)}</p>
                          <p><strong>Payment Method:</strong> {receipt.paymentMethod}</p>
                          <p><strong>Date:</strong> {new Date(receipt.paymentDate).toLocaleString()}</p>
                        </div>
                        <div className="receipt-actions">
                          <button
                            onClick={() => viewReceipt(receipt.paymentId)}
                            className="btn-secondary"
                          >
                            View Receipt
                          </button>
                          <button
                            onClick={() => downloadReceipt(receipt.paymentId)}
                            className="btn-primary"
                          >
                            Download PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="payment-history">
                    <h4>Payment History</h4>
                    {payments.length === 0 ? (
                      <div className="no-payments">No payments found</div>
                    ) : (
                      <div className="payments-list">
                        {payments.map((payment) => (
                          <div key={payment._id} className="payment-item">
                            <div className="payment-item-header">
                              <span className="payment-id">{payment.receiptNumber}</span>
                              <span className={`payment-status ${payment.paymentStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                                {payment.paymentStatus}
                              </span>
                            </div>
                            <div className="payment-item-body">
                              <div className="payment-detail">
                                <span className="detail-label">Fee Type:</span>
                                <span className="detail-value">{payment.feeType}</span>
                              </div>
                              <div className="payment-detail">
                                <span className="detail-label">Amount:</span>
                                <span className="detail-value amount">{formatCurrency(payment.amount)}</span>
                              </div>
                              <div className="payment-detail">
                                <span className="detail-label">Method:</span>
                                <span className="detail-value">{payment.paymentMethod}</span>
                              </div>
                              <div className="payment-detail">
                                <span className="detail-label">Date:</span>
                                <span className="detail-value">{new Date(payment.paymentDate).toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="payment-item-actions">
                              <button
                                onClick={() => viewReceipt(payment.paymentId)}
                                className="btn-link"
                              >
                                View
                              </button>
                              <button
                                onClick={() => downloadReceipt(payment.paymentId)}
                                className="btn-link"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">👤</div>
              <p>Select a student from the list to process payment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;

