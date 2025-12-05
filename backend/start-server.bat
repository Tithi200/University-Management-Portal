@echo off
echo Starting College Dashboard Backend Server...
echo.
echo Make sure MongoDB is running before starting the server!
echo.
echo Installing dependencies if needed...
call npm install
echo.
echo Starting server...
node server.js
pause

