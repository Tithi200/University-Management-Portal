# How to Start the Backend Server

## Quick Start

### Option 1: Using npm (Recommended)

1. **Open a terminal/command prompt**

2. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

3. **Install dependencies (first time only):**
   ```bash
   npm install
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **You should see:**
   ```
   Server is running on port 5000
   MongoDB Connected
   ```

### Option 2: Using the Batch File (Windows)

1. **Double-click** `backend/start-server.bat`

### Option 3: Using the Shell Script (Mac/Linux)

1. **Make it executable:**
   ```bash
   chmod +x backend/start-server.sh
   ```

2. **Run it:**
   ```bash
   ./backend/start-server.sh
   ```

## Prerequisites

### 1. Node.js Installed
- Check if Node.js is installed:
  ```bash
  node --version
  ```
- If not installed, download from: https://nodejs.org/

### 2. MongoDB Running

#### Option A: Local MongoDB

**Windows:**
- Check if MongoDB service is running in Services
- Or start manually:
  ```bash
  mongod
  ```

**Mac (using Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud - Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster (free tier)
4. Get your connection string
5. Create `backend/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   NODE_ENV=development
   ```

## Troubleshooting

### Port 5000 Already in Use

If you see "Port 5000 is already in use":

1. **Change the port** in `backend/.env`:
   ```env
   PORT=5001
   ```

2. **Update frontend** `frontend/.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   ```

### MongoDB Connection Error

**For Local MongoDB:**
- Make sure MongoDB is running
- Check if MongoDB is installed
- Try: `mongosh` to test connection

**For MongoDB Atlas:**
- Check your connection string
- Make sure your IP is whitelisted in Atlas
- Verify username and password

### Dependencies Not Installing

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

## Verify Server is Running

### Method 1: Check Console Output
You should see:
```
Server is running on port 5000
MongoDB Connected
```

### Method 2: Test in Browser
Open: http://localhost:5000/api/health

You should see:
```json
{"status":"Server is running"}
```

### Method 3: Test with curl
```bash
curl http://localhost:5000/api/health
```

## Keep Server Running

- **Keep the terminal window open** - closing it will stop the server
- For production, use PM2 or similar process manager
- For development, use `npm run dev` (if nodemon is installed)

## Next Steps

Once the backend is running:
1. Start the frontend in a **new terminal**:
   ```bash
   cd frontend
   npm install
   npm start
   ```
2. The frontend will automatically connect to the backend
3. You should see "✅ Backend server connected successfully" in the upload page

