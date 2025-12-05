import React from 'react';
import './Dashboard.css';

const Dashboard = ({ setActiveSection }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome to Brainware University Dashboard</h2>
        <p>Manage students, employees, payments, and ID cards from one place</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => setActiveSection('employee')}>
          <div className="card-icon">👥</div>
          <h3>Employee Details</h3>
          <p>View and manage employee information</p>
        </div>
        
        <div className="dashboard-card" onClick={() => setActiveSection('upload')}>
          <div className="card-icon">📤</div>
          <h3>Student Data Upload</h3>
          <p>Upload student data via Excel file</p>
        </div>
        
        <div className="dashboard-card" onClick={() => setActiveSection('print')}>
          <div className="card-icon">🖨️</div>
          <h3>Print ID Card</h3>
          <p>Generate and print student ID cards</p>
        </div>
        
        <div className="dashboard-card" onClick={() => setActiveSection('payment')}>
          <div className="card-icon">💳</div>
          <h3>Payment Management</h3>
          <p>Process student fees and generate receipts</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

