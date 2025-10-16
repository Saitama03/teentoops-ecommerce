@echo off
REM TeenTops E-commerce Quick Start Script for Windows
REM This script will set up and run both backend and frontend servers

echo 🚀 TeenTops E-commerce Quick Start
echo ==================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo ✅ Python and Node.js are installed

REM Install Python dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt

REM Run Django migrations
echo 🗄️ Setting up database...
python manage.py migrate

REM Create superuser if it doesn't exist
echo 👤 Setting up admin user...
echo from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@teentops.com', 'admin123') | python manage.py shell

REM Populate sample data
echo 📊 Adding sample data...
python manage.py populate_sample_data

REM Start Django server
echo 🔧 Starting Django backend server...
start "Django Server" cmd /k "python manage.py runserver 0.0.0.0:8000"

REM Wait a moment for Django to start
timeout /t 3 /nobreak >nul

REM Install Node.js dependencies and start frontend
echo ⚛️ Setting up React frontend...
cd teentops-frontend

if not exist "node_modules" (
    echo 📦 Installing Node.js dependencies...
    npm install
)

echo 🌐 Starting React frontend server...
start "React Server" cmd /k "npm run dev -- --host"

REM Wait for servers to start
timeout /t 5 /nobreak >nul

echo.
echo 🎉 TeenTops E-commerce is now running!
echo ==================================
echo 🌐 Website: http://localhost:5173
echo 🔧 Admin Panel: http://localhost:8000/admin/
echo 📡 API: http://localhost:8000/api/
echo.
echo 👤 Admin Login:
echo    Username: admin
echo    Password: admin123
echo.
echo Both servers are running in separate windows.
echo Close the server windows to stop the application.
echo.
pause
