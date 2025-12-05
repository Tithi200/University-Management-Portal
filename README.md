# College Dashboard - Student Management System

A comprehensive web application for managing student data and generating ID cards with multiple template options.

## Features

- **Dynamic Dashboard**: Interactive frontend with dropdown navigation
- **Student Data Upload**: Upload student data via Excel files
- **Multiple ID Card Templates**: Three professional ID card templates to choose from
- **Print Functionality**: Print ID cards directly from the browser
- **Student Management**: View, search, and manage student records
- **MongoDB Integration**: Secure database storage with unique student IDs

## Tech Stack

### Frontend
- React 18.2.0
- React Router DOM
- Axios for API calls
- CSS3 with modern styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer for file uploads
- XLSX for Excel file processing

## Project Structure

```
college-dashboard/
├── backend/
│   ├── models/
│   │   └── Student.js
│   ├── routes/
│   │   ├── studentRoutes.js
│   │   └── uploadRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── EmployeeDetails.js
│   │   │   ├── StudentDataUpload.js
│   │   │   ├── PrintIDCard.js
│   │   │   └── IDCardTemplates/
│   │   │       ├── Template1.js
│   │   │       ├── Template2.js
│   │   │       ├── Template3.js
│   │   │       └── IDCardTemplates.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college_dashboard
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Uploading Student Data

1. Navigate to "Student Data Upload" section
2. Prepare an Excel file with the following columns:
   - **Name**: Student's full name
   - **Course**: Course name
   - **Age**: Student's age (number)
   - **BloodGroup**: Blood group (e.g., A+, B+, O+)
   - **ParentName**: Parent's full name
   - **ParentPhone**: Parent's phone number
   - **Photo**: Photo URL (optional)

3. Click "Choose Excel File" and select your file
4. Click "Upload File" to import student data

### Printing ID Cards

1. Navigate to "Print ID Card" section
2. Search or select a student from the list
3. Choose a template (Template 1, 2, or 3)
4. Preview the ID card
5. Click "Print ID Card" to print

## ID Card Templates

### Template 1 - Classic Style
- Traditional layout with photo on the left
- Clean, professional design
- Suitable for formal institutions

### Template 2 - Modern Card Style
- Gradient background
- Modern, vibrant design
- Compact information layout

### Template 3 - Compact Professional
- Minimalist design
- Maximum information density
- Professional appearance

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `GET /api/students/studentId/:studentId` - Get student by student ID
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Upload
- `POST /api/upload/excel` - Upload Excel file with student data

## Database Schema

### Student Model
```javascript
{
  studentId: String (unique, auto-generated),
  name: String,
  course: String,
  age: Number,
  bloodGroup: String,
  parentName: String,
  parentPhone: String,
  photo: String (URL or base64),
  createdAt: Date
}
```

## Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please create an issue in the repository.

