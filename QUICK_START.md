# Quick Start Guide

## Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - Install locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

## Step-by-Step Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Backend Environment

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college_dashboard
NODE_ENV=development
```

**For MongoDB Atlas users:**
Replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college_dashboard
```

### 3. Start Backend Server

```bash
cd backend
npm start
```

You should see: `Server is running on port 5000` and `MongoDB Connected`

### 4. Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 5. Start Frontend Development Server

```bash
cd frontend
npm start
```

The browser should automatically open at `http://localhost:3000`

## Testing the Application

### 1. Upload Student Data

1. Navigate to **Student Data Upload** section
2. Create an Excel file with columns: Name, Course, Age, BloodGroup, ParentName, ParentPhone, Photo
3. Upload the file
4. You should see a success message with the number of students imported

### 2. Print ID Cards

1. Navigate to **Print ID Card** section
2. Select a student from the list
3. Choose a template (Template 1, 2, or 3)
4. Click **Print ID Card** to print

## Troubleshooting

### MongoDB Connection Issues

- **Local MongoDB**: Make sure MongoDB is running on your system
  - Windows: Check Services or run `mongod`
  - Mac/Linux: Run `sudo systemctl start mongod` or `brew services start mongodb-community`

- **MongoDB Atlas**: 
  - Ensure your IP address is whitelisted in Atlas
  - Check your connection string is correct
  - Verify your username and password

### Port Already in Use

If port 5000 is already in use:
1. Change `PORT` in `backend/.env` to another port (e.g., 5001)
2. Update `REACT_APP_API_URL` in `frontend/.env` to match

### CORS Errors

If you see CORS errors:
- Ensure backend server is running
- Check that `REACT_APP_API_URL` in frontend matches your backend URL
- Verify CORS is enabled in `backend/server.js`

## Next Steps

- Customize ID card templates in `frontend/src/components/IDCardTemplates/`
- Add more features to Employee Details section
- Customize the dashboard styling
- Add authentication if needed

## Need Help?

Check the main `README.md` for detailed documentation.

