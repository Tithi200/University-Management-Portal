import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentDataUpload.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StudentDataUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');

  // Check server connection on component mount
  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await axios.get(`${API_URL.replace('/api', '')}/api/health`, {
        timeout: 3000
      });
      if (response.data.status === 'Server is running') {
        setServerStatus('connected');
      }
    } catch (err) {
      setServerStatus('disconnected');
      console.error('Server connection check failed:', err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/excel',
        'application/x-excel',
        'application/x-msexcel'
      ];
      
      // Check by MIME type or file extension
      if (validTypes.includes(selectedFile.type) || 
          fileExtension === '.xlsx' || 
          fileExtension === '.xls') {
        setFile(selectedFile);
        setError('');
        setMessage('');
        console.log('File selected:', selectedFile.name);
      } else {
        setError(`Please upload an Excel file (.xlsx or .xls). File type: ${selectedFile.type || 'unknown'}`);
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading file:', file.name);
    console.log('API URL:', `${API_URL}/upload/excel`);

    try {
      const response = await axios.post(`${API_URL}/upload/excel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      console.log('Upload response:', response.data);
      setUploadResult(response.data);
      
      let messageText = `Successfully uploaded ${response.data.imported} students!`;
      if (response.data.availableColumns) {
        console.log('Available columns in Excel:', response.data.availableColumns);
      }
      if (response.data.errors > 0) {
        messageText += ` (${response.data.errors} rows had errors)`;
      }
      setMessage(messageText);
      
      setFile(null);
      const fileInput = document.getElementById('file-input');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          'Failed to upload file. Please check if the backend server is running.';
      setError(errorMessage);
      
      // Additional error details
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      } else if (err.request) {
        console.error('No response received. Is the backend server running?');
        setError('Cannot connect to server. Please make sure the backend is running on port 5000.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="student-upload">
      <div className="section-header">
        <h2>Student Data Upload</h2>
        <p>Upload student data via Excel file</p>
      </div>

      <div className="upload-container">
        <div className="upload-card">
          {/* Server Status Indicator */}
          {serverStatus === 'disconnected' && (
            <div className="server-status-error">
              <h3>⚠️ Backend Server Not Connected</h3>
              <p>The backend server is not running. Please follow these steps:</p>
              <ol>
                <li>Open a terminal/command prompt</li>
                <li>Navigate to the backend folder: <code>cd backend</code></li>
                <li>Install dependencies: <code>npm install</code></li>
                <li>Start the server: <code>npm start</code></li>
                <li>Wait for: "Server is running on port 5000"</li>
              </ol>
              <button onClick={checkServerConnection} className="retry-button">
                🔄 Retry Connection
              </button>
            </div>
          )}
          
          {serverStatus === 'connected' && (
            <div className="server-status-success">
              ✅ Backend server connected successfully
            </div>
          )}

          <div className="upload-instructions">
            <h3>Excel File Format</h3>
            <p>Your Excel file should contain the following columns:</p>
            <ul>
              <li><strong>Name</strong> - Student's full name <span style={{color: '#dc3545'}}>(Required)</span></li>
              <li><strong>Course</strong> - Course name (Optional)</li>
              <li><strong>Age</strong> - Student's age (Optional)</li>
              <li><strong>BloodGroup</strong> - Blood group e.g., A+, B+, O+ (Optional)</li>
              <li><strong>ParentName</strong> - Parent's full name (Optional)</li>
              <li><strong>ParentPhone</strong> - Parent's phone number (Optional)</li>
              <li><strong>Photo</strong> - Photo URL (Optional)</li>
            </ul>
            <p style={{marginTop: '1rem', padding: '0.75rem', background: '#e7f3ff', borderRadius: '6px', color: '#004085'}}>
              <strong>Note:</strong> Only the <strong>Name</strong> field is required. All other fields are optional and will be left blank if not provided. Each student will automatically receive a unique Student ID.
            </p>
          </div>

          <div className="upload-section">
            <div className="file-input-wrapper">
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="file-input" className="file-label">
                <span className="file-label-icon">📁</span>
                <span className="file-label-text">
                  {file ? (
                    <>
                      <strong>{file.name}</strong>
                      <small> ({(file.size / 1024).toFixed(2)} KB)</small>
                    </>
                  ) : (
                    'Click to choose Excel file or drag and drop'
                  )}
                </span>
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="upload-button"
            >
              {uploading ? (
                <>
                  <span className="upload-spinner">⏳</span> Uploading...
                </>
              ) : (
                <>
                  <span>📤</span> Upload File
                </>
              )}
            </button>
          </div>

          {message && (
            <div className="success-message">
              ✅ {message}
              {uploadResult && uploadResult.availableColumns && (
                <div style={{marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.8}}>
                  <strong>Detected columns:</strong> {uploadResult.availableColumns.join(', ')}
                </div>
              )}
              {uploadResult && uploadResult.errors > 0 && (
                <div className="error-details">
                  <p>⚠️ {uploadResult.errors} rows had errors:</p>
                  <ul>
                    {uploadResult.errorDetails?.slice(0, 10).map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                    {uploadResult.errorDetails?.length > 10 && (
                      <li>... and {uploadResult.errorDetails.length - 10} more errors</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDataUpload;

