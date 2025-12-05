# 🚀 How to Start the Application

## Step-by-Step Instructions

### Step 1: Start the Backend Server

**Open a NEW terminal/command prompt window:**

1. **Navigate to backend folder:**
   ```
   cd "C:\Users\TITHI\Downloads\Payroll Managemt\backend"
   ```

2. **Install dependencies (first time only):**
   ```
   npm install
   ```
   Wait for installation to complete (may take 1-2 minutes)

3. **Start the backend server:**
   ```
   npm start
   ```

4. **You MUST see these messages:**
   ```
   Server is running on port 5000
   MongoDB Connected
   ```
   
   ⚠️ **IMPORTANT:** Keep this terminal window OPEN! Closing it will stop the server.

### Step 2: Start the Frontend (In a NEW Terminal)

**Open ANOTHER terminal/command prompt window:**

1. **Navigate to frontend folder:**
   ```
   cd "C:\Users\TITHI\Downloads\Payroll Managemt\frontend"
   ```

2. **Install dependencies (first time only):**
   ```
   npm install
   ```
   Wait for installation to complete (may take 2-3 minutes)

3. **Start the frontend:**
   ```
   npm start
   ```

4. **Browser should automatically open** at `http://localhost:3000`

### Step 3: Verify Everything Works

1. **Check Backend:** Open browser and go to:
   ```
   http://localhost:5000/api/health
   ```
   Should show: `{"status":"Server is running"}`

2. **Check Frontend:** Should be running at `http://localhost:3000`

3. **In the Upload Page:** You should see:
   - ✅ "Backend server connected successfully" (green message)

## ⚠️ Common Issues

### Issue: "Cannot connect to server"

**Solution:**
1. Make sure backend is running (Step 1)
2. Check backend terminal shows: "Server is running on port 5000"
3. If not, restart backend:
   - Press `Ctrl+C` in backend terminal to stop
   - Run `npm start` again

### Issue: "MongoDB connection error"

**Solution:**

**Option A: Use MongoDB Atlas (Cloud - Recommended for beginners)**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Create file: `backend/.env` with:
   ```
   PORT=5000
   MONGODB_URI=paste_your_connection_string_here
   NODE_ENV=development
   ```
7. Replace `<password>` in connection string with your MongoDB password
8. Restart backend server

**Option B: Install Local MongoDB**

1. Download MongoDB: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service
4. Backend will connect automatically

### Issue: Port 5000 already in use

**Solution:**
1. Find what's using port 5000:
   ```
   netstat -ano | findstr :5000
   ```
2. Or change port in `backend/.env`:
   ```
   PORT=5001
   ```
3. Update `frontend/.env`:
   ```
   REACT_APP_API_URL=http://localhost:5001/api
   ```

## 📋 Quick Checklist

- [ ] Backend terminal shows "Server is running on port 5000"
- [ ] Backend terminal shows "MongoDB Connected"
- [ ] Frontend is running at http://localhost:3000
- [ ] Upload page shows "✅ Backend server connected successfully"
- [ ] Can select Excel file
- [ ] Upload button works

## 🎯 What You Should See

### Backend Terminal:
```
> college-dashboard-backend@1.0.0 start
> node server.js

Server is running on port 5000
MongoDB Connected
```

### Frontend Browser:
- Dashboard loads successfully
- Navigation menu works
- Upload page shows green "connected" message

## 💡 Tips

1. **Always start backend FIRST**, then frontend
2. **Keep both terminals open** while using the app
3. **Check terminal for errors** if something doesn't work
4. **Use MongoDB Atlas** if you don't want to install MongoDB locally

## 🆘 Still Having Issues?

1. Check both terminals for error messages
2. Make sure Node.js is installed: `node --version`
3. Make sure npm is installed: `npm --version`
4. Try restarting both servers
5. Check browser console (F12) for errors

