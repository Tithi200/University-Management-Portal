import React from 'react';
import './EmployeeDetails.css';

const EmployeeDetails = () => {
  return (
    <div className="employee-details">
      <div className="section-header">
        <h2>Employee Details</h2>
        <p>Manage employee information</p>
      </div>
      
      <div className="employee-content">
        <div className="info-card">
          <h3>Employee Management</h3>
          <p>This section is for managing employee details. You can add, edit, and view employee information here.</p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">➕</span>
              <span>Add new employees</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✏️</span>
              <span>Edit employee details</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👁️</span>
              <span>View employee list</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <span>Search employees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;

