import React from 'react';
import './IDCardTemplates.css';

const IDCardTemplate1 = ({ student }) => {
  return (
    <div className="id-card template1">
      <div className="id-card-header">
        <div className="college-logo">🎓</div>
        <div className="college-info">
          <h2>COLLEGE DASHBOARD</h2>
          <p>Official Student Identity Card</p>
        </div>
      </div>
      
      <div className="id-card-body">
        <div className="photo-section">
          <div className="photo-placeholder">
            {student.photo ? (
              <img src={student.photo} alt={student.name} className="student-photo" />
            ) : (
              <div className="photo-icon">👤</div>
            )}
          </div>
          <div className="student-id-badge">{student.studentId}</div>
        </div>
        
        <div className="details-section">
          <div className="detail-row">
            <span className="label">Name:</span>
            <span className="value">{student.name || 'N/A'}</span>
          </div>
          {student.course && (
            <div className="detail-row">
              <span className="label">Course:</span>
              <span className="value">{student.course}</span>
            </div>
          )}
          {student.age && (
            <div className="detail-row">
              <span className="label">Age:</span>
              <span className="value">{student.age} years</span>
            </div>
          )}
          {student.bloodGroup && (
            <div className="detail-row">
              <span className="label">Blood Group:</span>
              <span className="value">{student.bloodGroup}</span>
            </div>
          )}
          {student.parentName && (
            <div className="detail-row">
              <span className="label">Parent Name:</span>
              <span className="value">{student.parentName}</span>
            </div>
          )}
          {student.parentPhone && (
            <div className="detail-row">
              <span className="label">Parent Phone:</span>
              <span className="value">{student.parentPhone}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="id-card-footer">
        <div className="signature-section">
          <div className="signature-line"></div>
          <p>Authorized Signature</p>
        </div>
      </div>
    </div>
  );
};

export default IDCardTemplate1;

