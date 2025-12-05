const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true,
    default: () => `STD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  course: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: null
  },
  bloodGroup: {
    type: String,
    default: ''
  },
  parentName: {
    type: String,
    default: ''
  },
  parentPhone: {
    type: String,
    default: ''
  },
  photo: {
    type: String, // URL or base64 string
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);

