# Troubleshooting Guide - File Upload Issues

## Common Issues and Solutions

### 1. Upload Button Not Working

**Symptoms:**
- Button doesn't respond when clicked
- No error messages appear
- File selection works but upload doesn't start

**Solutions:**

#### Check Backend Server
1. Make sure the backend server is running:
   ```bash
   cd backend
   npm start
   ```
2. You should see: `Server is running on port 5000` and `MongoDB Connected`

#### Check Browser Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for any error messages
4. Try uploading again and check for:
   - Network errors
   - CORS errors
   - API connection errors

#### Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try uploading a file
4. Look for the request to `/api/upload/excel`
5. Check the status code:
   - **200**: Success
   - **400**: Bad request (check file format)
   - **500**: Server error (check backend logs)
   - **Failed/CORS**: Backend not running or CORS issue

### 2. File Selection Not Working

**Symptoms:**
- Clicking the file input area doesn't open file dialog
- No file appears to be selected

**Solutions:**

1. **Check File Input**: Make sure you're clicking on the dashed border area
2. **Try Different Browser**: Some browsers handle file inputs differently
3. **Check File Format**: Only `.xlsx` and `.xls` files are accepted
4. **Browser Console**: Check for JavaScript errors

### 3. "Cannot Connect to Server" Error

**Symptoms:**
- Error message: "Cannot connect to server"
- Network request fails

**Solutions:**

1. **Verify Backend is Running**:
   ```bash
   # In backend directory
   npm start
   ```

2. **Check Port Configuration**:
   - Backend should run on port 5000 (default)
   - Check `backend/.env` file for PORT setting
   - Make sure no other application is using port 5000

3. **Check API URL**:
   - Frontend uses: `http://localhost:5000/api`
   - If backend runs on different port, update `frontend/.env`:
     ```env
     REACT_APP_API_URL=http://localhost:YOUR_PORT/api
     ```

4. **Test Backend Health**:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"Server is running"}`

### 4. "Only Excel Files Allowed" Error

**Symptoms:**
- File upload rejected even with Excel file

**Solutions:**

1. **Check File Extension**: File must end with `.xlsx` or `.xls`
2. **Check File Type**: Some Excel files might have different MIME types
3. **Try Re-saving**: Open the Excel file and save it again as `.xlsx`

### 5. MongoDB Connection Issues

**Symptoms:**
- Backend shows: "MongoDB connection error"
- Students not saving to database

**Solutions:**

1. **Local MongoDB**:
   ```bash
   # Windows
   # Check Services for MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```

2. **MongoDB Atlas**:
   - Check connection string in `backend/.env`
   - Verify IP address is whitelisted
   - Check username and password

3. **Test Connection**:
   ```bash
   mongosh mongodb://localhost:27017/college_dashboard
   ```

### 6. File Uploads But No Students Created

**Symptoms:**
- Upload succeeds but no students appear in database

**Solutions:**

1. **Check Excel Format**:
   - Ensure columns are: Name, Course, Age, BloodGroup, ParentName, ParentPhone
   - Column names are case-insensitive
   - All required fields must have values

2. **Check Backend Logs**:
   - Look for error messages in backend console
   - Check for validation errors

3. **Check Response**:
   - Look at browser Network tab
   - Check response for error details
   - Response shows number of imported students and errors

### 7. CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- Request blocked by browser

**Solutions:**

1. **Verify CORS is Enabled**: Check `backend/server.js` has:
   ```javascript
   app.use(cors());
   ```

2. **Check Backend is Running**: CORS errors often mean backend isn't running

3. **Check Ports**: Frontend (3000) and Backend (5000) should be different

## Debugging Steps

### Step 1: Verify Backend
```bash
cd backend
npm start
# Should see: "Server is running on port 5000"
# Should see: "MongoDB Connected"
```

### Step 2: Verify Frontend
```bash
cd frontend
npm start
# Should open browser at http://localhost:3000
```

### Step 3: Test API Directly
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Should return: {"status":"Server is running"}
```

### Step 4: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for errors when clicking upload button
4. Check Network tab for failed requests

### Step 5: Check File Format
Create a test Excel file with these columns:
- Name
- Course
- Age
- BloodGroup
- ParentName
- ParentPhone

## Still Having Issues?

1. **Check All Logs**:
   - Backend console output
   - Browser console (F12)
   - Network tab in browser

2. **Verify Dependencies**:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Restart Everything**:
   - Stop both servers (Ctrl+C)
   - Restart backend
   - Restart frontend
   - Clear browser cache (Ctrl+Shift+Delete)

4. **Check File Permissions**: Make sure you have read access to the Excel file

