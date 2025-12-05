import React from 'react';
import './IDCardTemplates.css';

const IDCardTemplate2 = ({ student }) => {
  return (
    <div className="id-card template2">
      <div className="template2-header">
        <div className="template2-logo-section">
          <div className="college-logo-large">🎓</div>
          <div className="college-name-large">
            <h1>COLLEGE</h1>
            <h1>DASHBOARD</h1>
          </div>
        </div>
        <div className="id-badge-template2">
          <span>ID: {student.studentId}</span>
        </div>
      </div>
      
      <div className="template2-body">
        <div className="template2-photo-container">
          {student.photo ? (
            <img src={student.photo} alt={student.name} className="student-photo-large" />
          ) : (
            <div className="photo-placeholder-large">
              <div className="photo-icon-large">👤</div>
            </div>
          )}
        </div>
        
        <div className="template2-info-grid">
          <div className="info-item">
            <div className="info-label">NAME</div>
            <div className="info-value">{student.name || 'N/A'}</div>
          </div>
          {student.course && (
            <div className="info-item">
              <div className="info-label">COURSE</div>
              <div className="info-value">{student.course}</div>
            </div>
          )}
          {student.age && (
            <div className="info-item">
              <div className="info-label">AGE</div>
              <div className="info-value">{student.age} Years</div>
            </div>
          )}
          {student.bloodGroup && (
            <div className="info-item">
              <div className="info-label">BLOOD GROUP</div>
              <div className="info-value">{student.bloodGroup}</div>
            </div>
          )}
          {student.parentName && (
            <div className="info-item full-width">
              <div className="info-label">PARENT NAME</div>
              <div className="info-value">{student.parentName}</div>
            </div>
          )}
          {student.parentPhone && (
            <div className="info-item full-width">
              <div className="info-label">PARENT PHONE</div>
              <div className="info-value">{student.parentPhone}</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="template2-footer">
        <p>This card is the property of College Dashboard</p>
      </div>
    </div>
  );
};

export default IDCardTemplate2;

