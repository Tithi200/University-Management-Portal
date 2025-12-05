const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const Student = require('../models/Student');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const validMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/excel',
      'application/x-excel',
      'application/x-msexcel'
    ];
    
    // Check by MIME type or file extension
    const fileName = file.originalname.toLowerCase();
    const isValidMimeType = validMimeTypes.includes(file.mimetype);
    const isValidExtension = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    
    if (isValidMimeType || isValidExtension) {
      cb(null, true);
    } else {
      cb(new Error(`Only Excel files (.xlsx, .xls) are allowed. Received: ${file.mimetype}`));
    }
  }
});

// Upload Excel file and process student data
router.post('/excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please select an Excel file.' });
    }

    console.log('File received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Log available columns for debugging
    if (data.length > 0) {
      console.log('Available columns in Excel file:', Object.keys(data[0]));
    }

    const students = [];
    const errors = [];

    // Helper function to find value by multiple possible keys (case-insensitive, whitespace-tolerant)
    const findValue = (row, possibleKeys) => {
      // First try exact matches
      for (const key of possibleKeys) {
        if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
          return String(row[key]).trim();
        }
      }
      
      // Then try case-insensitive matches
      const rowKeys = Object.keys(row);
      for (const key of possibleKeys) {
        const lowerKey = key.toLowerCase().trim();
        for (const rowKey of rowKeys) {
          if (rowKey.toLowerCase().trim() === lowerKey) {
            const value = row[rowKey];
            if (value !== undefined && value !== null && value !== '') {
              return String(value).trim();
            }
          }
        }
      }
      
      // Try partial matches (contains)
      for (const key of possibleKeys) {
        const lowerKey = key.toLowerCase().trim();
        for (const rowKey of rowKeys) {
          if (rowKey.toLowerCase().trim().includes(lowerKey) || lowerKey.includes(rowKey.toLowerCase().trim())) {
            const value = row[rowKey];
            if (value !== undefined && value !== null && value !== '') {
              return String(value).trim();
            }
          }
        }
      }
      
      return '';
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Log first row for debugging
        if (i === 0) {
          console.log('First row data:', row);
        }

        // Find name using multiple possible column names (case-insensitive, handles whitespace)
        const name = findValue(row, [
          'Name', 'name', 'NAME', 'Student Name', 'StudentName', 
          'STUDENT NAME', 'Full Name', 'FullName', 'FULL NAME',
          'Student', 'STUDENT', 'student'
        ]);

        // Find other fields
        const course = findValue(row, [
          'Course', 'course', 'COURSE', 'Course Name', 'CourseName',
          'COURSE NAME', 'Program', 'program', 'PROGRAM'
        ]);

        const ageValue = findValue(row, [
          'Age', 'age', 'AGE', 'Age (Years)', 'Age(Years)'
        ]);
        const age = ageValue ? parseInt(ageValue) : null;

        const bloodGroup = findValue(row, [
          'BloodGroup', 'Blood Group', 'bloodGroup', 'blood group',
          'BLOODGROUP', 'BLOOD GROUP', 'Blood Type', 'BloodType',
          'blood type', 'BLOOD TYPE'
        ]);

        const parentName = findValue(row, [
          'ParentName', 'Parent Name', 'parentName', 'parent name',
          'PARENTNAME', 'PARENT NAME', 'Guardian Name', 'GuardianName',
          'guardian name', 'GUARDIAN NAME'
        ]);

        const parentPhone = findValue(row, [
          'ParentPhone', 'Parent Phone', 'parentPhone', 'parent phone',
          'PARENTPHONE', 'PARENT PHONE', 'Parent Contact', 'ParentContact',
          'parent contact', 'PARENT CONTACT', 'Phone', 'phone', 'PHONE'
        ]);

        const photo = findValue(row, [
          'Photo', 'photo', 'PHOTO', 'Photo URL', 'PhotoURL',
          'photo url', 'PHOTO URL', 'Image', 'image', 'IMAGE'
        ]);

        const studentData = {
          name: name,
          course: course || '',
          age: age,
          bloodGroup: bloodGroup || '',
          parentName: parentName || '',
          parentPhone: parentPhone || '',
          photo: photo || ''
        };

        // Only name is required - all other fields are optional
        if (!studentData.name || studentData.name.trim() === '') {
          errors.push(`Row ${i + 2}: Name is required. Available columns: ${Object.keys(row).join(', ')}`);
          continue;
        }

        const student = new Student(studentData);
        await student.save();
        students.push(student);
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    const response = {
      success: true,
      message: `Successfully imported ${students.length} students`,
      imported: students.length,
      errors: errors.length,
      errorDetails: errors
    };

    // Add column information for debugging
    if (data.length > 0) {
      response.availableColumns = Object.keys(data[0]);
    }

    res.json(response);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while processing the file',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;

