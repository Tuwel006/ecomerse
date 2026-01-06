@echo off
echo Starting DSM Kart Platform...
echo.

echo Starting Backend Server...
start "DSM Kart Backend" cmd /k "cd Backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "DSM Kart Frontend" cmd /k "cd ecommerce-frontend && npm start"

echo.
echo ✅ DSM Kart servers are starting...
echo 🔗 Backend: http://localhost:8001
echo 🔗 Frontend: http://localhost:5001
echo 🔗 MongoDB: mongodb://localhost:27017/ecommerce-platform
echo.
echo Login Credentials:
echo Admin: admin@ecommerce.com / password123
echo Manager: manager@ecommerce.com / password123
echo Customer: customer@example.com / password123
echo.
pause