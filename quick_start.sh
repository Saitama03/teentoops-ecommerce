#!/bin/bash

# TeenTops E-commerce Quick Start Script
# This script will set up and run both backend and frontend servers

echo "🚀 TeenTops E-commerce Quick Start"
echo "=================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Python and Node.js are installed"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

# Run Django migrations
echo "🗄️ Setting up database..."
python3 manage.py migrate

# Create superuser if it doesn't exist
echo "👤 Setting up admin user..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@teentops.com', 'admin123')" | python3 manage.py shell

# Populate sample data
echo "📊 Adding sample data..."
python3 manage.py populate_sample_data

# Start Django server in background
echo "🔧 Starting Django backend server..."
python3 manage.py runserver 0.0.0.0:8000 &
DJANGO_PID=$!

# Wait a moment for Django to start
sleep 3

# Install Node.js dependencies and start frontend
echo "⚛️ Setting up React frontend..."
cd teentops-frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

echo "🌐 Starting React frontend server..."
npm run dev -- --host &
REACT_PID=$!

# Wait for servers to start
sleep 5

echo ""
echo "🎉 TeenTops E-commerce is now running!"
echo "=================================="
echo "🌐 Website: http://localhost:5173"
echo "🔧 Admin Panel: http://localhost:8000/admin/"
echo "📡 API: http://localhost:8000/api/"
echo ""
echo "👤 Admin Login:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $DJANGO_PID 2>/dev/null
    kill $REACT_PID 2>/dev/null
    echo "✅ Servers stopped. Goodbye!"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
