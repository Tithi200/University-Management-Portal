import React from 'react';
import './IDCardTemplates.css';

const IDCardTemplate3 = ({ student }) => {
  return (
    <div className="id-card template3">
      <div className="template3-top-bar"></div>
      
      <div className="template3-content">
        <div className="template3-left">
          <div className="template3-logo-area">
            <div className="college-logo-circle">🎓</div>
            <h2>COLLEGE DASHBOARD</h2>
            <p className="subtitle">Student Identity Card</p>
          </div>
          
          <div className="template3-details-compact">
            <div className="compact-row">
              <span className="compact-label">Name:</span>
              <span className="compact-value">{student.name || 'N/A'}</span>
            </div>
            {student.course && (
              <div className="compact-row">
                <span className="compact-label">Course:</span>
                <span className="compact-value">{student.course}</span>
              </div>
            )}
            {student.age && (
              <div className="compact-row">
                <span className="compact-label">Age:</span>
                <span className="compact-value">{student.age} yrs</span>
              </div>
            )}
            {student.bloodGroup && (
              <div className="compact-row">
                <span className="compact-label">Blood:</span>
                <span className="compact-value">{student.bloodGroup}</span>
              </div>
            )}
          </div>
          
          {(student.parentName || student.parentPhone) && (
            <div className="template3-parent-info">
              {student.parentName && (
                <div className="parent-row">
                  <strong>Parent:</strong> {student.parentName}
                </div>
              )}
              {student.parentPhone && (
                <div className="parent-row">
                  <strong>Phone:</strong> {student.parentPhone}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="template3-right">
          <div className="template3-photo-wrapper">
            {student.photo ? (
              <img src={student.photo} alt={student.name} className="student-photo-template3" />
            ) : (
              <div className="photo-placeholder-template3">
                <div className="photo-icon-template3">👤</div>
              </div>
            )}
          </div>
          <div className="template3-student-id">
            <div className="id-label">STUDENT ID</div>
            <div className="id-number">{student.studentId}</div>
          </div>
        </div>
      </div>
      
      <div className="template3-bottom-bar">
        <div className="barcode-placeholder">▮▮▮▮▮▮▮▮▮▮▮▮</div>
        <div className="validity-text">Valid until graduation</div>
      </div>
    </div>
  );
};

export default IDCardTemplate3;

