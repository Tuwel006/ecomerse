@echo off
echo Starting E-commerce Platform...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd Backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd ecommerce-frontend && npm start"

echo.
echo ✅ Both servers are starting...
echo 🔗 Backend: http://localhost:8000
echo 🔗 Frontend: http://localhost:3000
echo 🔗 MongoDB: mongodb://localhost:27017/ecommerce-platform
echo.
echo Login Credentials:
echo Admin: admin@ecommerce.com / password123
echo Manager: manager@ecommerce.com / password123
echo Customer: customer@example.com / password123
echo.
pause