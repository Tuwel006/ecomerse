Write-Host "Starting E-commerce Platform..." -ForegroundColor Green

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; npm run dev"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ecommerce-frontend; npm start"

Write-Host ""
Write-Host "✅ Both servers are starting..." -ForegroundColor Green
Write-Host "🔗 Backend: http://localhost:8001" -ForegroundColor Cyan
Write-Host "🔗 Frontend: http://localhost:5001" -ForegroundColor Cyan