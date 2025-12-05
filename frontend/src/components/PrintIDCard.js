import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PrintIDCard.css';
import IDCardTemplate1 from './IDCardTemplates/Template1';
import IDCardTemplate2 from './IDCardTemplates/Template2';
import IDCardTemplate3 from './IDCardTemplates/Template3';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PrintIDCard = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

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

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const renderTemplate = () => {
    if (!selectedStudent) return null;

    const templateProps = {
      student: selectedStudent,
      onPrint: handlePrint
    };

    switch (selectedTemplate) {
      case 'template1':
        return <IDCardTemplate1 {...templateProps} />;
      case 'template2':
        return <IDCardTemplate2 {...templateProps} />;
      case 'template3':
        return <IDCardTemplate3 {...templateProps} />;
      default:
        return <IDCardTemplate1 {...templateProps} />;
    }
  };

  return (
    <div className="print-id-card">
      <div className="section-header">
        <h2>Print Student ID Card</h2>
        <p>Select a student and choose a template to print</p>
      </div>

      <div className="id-card-container">
        <div className="id-card-sidebar">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search by name, ID, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="template-selector">
            <h3>Select Template</h3>
            <div className="template-options">
              <button
                className={selectedTemplate === 'template1' ? 'active' : ''}
                onClick={() => setSelectedTemplate('template1')}
              >
                Template 1
              </button>
              <button
                className={selectedTemplate === 'template2' ? 'active' : ''}
                onClick={() => setSelectedTemplate('template2')}
              >
                Template 2
              </button>
              <button
                className={selectedTemplate === 'template3' ? 'active' : ''}
                onClick={() => setSelectedTemplate('template3')}
              >
                Template 3
              </button>
            </div>
          </div>

          <div className="student-list">
            <h3>Students ({filteredStudents.length})</h3>
            {loading ? (
              <div className="loading">Loading students...</div>
            ) : filteredStudents.length === 0 ? (
              <div className="no-students">No students found</div>
            ) : (
              <div className="student-items">
                {filteredStudents.map((student) => (
                  <div
                    key={student._id}
                    className={`student-item ${selectedStudent?._id === student._id ? 'active' : ''}`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="student-item-name">{student.name}</div>
                    <div className="student-item-id">{student.studentId}</div>
                    <div className="student-item-course">{student.course}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="id-card-preview">
          {selectedStudent ? (
            <div className="preview-content">
              {renderTemplate()}
              <div className="print-actions">
                <button onClick={handlePrint} className="print-button">
                  🖨️ Print ID Card
                </button>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">👤</div>
              <p>Select a student from the list to preview their ID card</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintIDCard;

