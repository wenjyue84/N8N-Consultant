# N8N Troubleshooting Script
# Quick diagnostics for n8n instance

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  N8N Quick Troubleshooting" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is available
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "🔄 Running comprehensive diagnostics..." -ForegroundColor Yellow
    Write-Host ""
    node utilities/troubleshoot-n8n.js
} else {
    Write-Host "⚠️  Node.js not found. Running basic checks..." -ForegroundColor Yellow
    Write-Host ""
    
    # Basic port check
    Write-Host "1️⃣  Checking Port 5678..." -ForegroundColor Cyan
    $portTest = Test-NetConnection -ComputerName localhost -Port 5678 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($portTest) {
        Write-Host "   ✅ Port 5678 is open" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Port 5678 is closed - n8n may not be running" -ForegroundColor Red
        Write-Host "   💡 Solution: Run 'n8n start'" -ForegroundColor Yellow
    }
    Write-Host ""
    
    # Check for node processes
    Write-Host "2️⃣  Checking Node Processes..." -ForegroundColor Cyan
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        Write-Host "   ✅ Found $($nodeProcesses.Count) Node.js process(es)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  No Node.js processes found" -ForegroundColor Yellow
    }
    Write-Host ""
    
    # Check credentials
    Write-Host "3️⃣  Checking Credentials..." -ForegroundColor Cyan
    $credPath = "credentials\n8n-api-key.txt"
    if (Test-Path $credPath) {
        Write-Host "   ✅ Credentials file exists" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Credentials file not found" -ForegroundColor Yellow
    }
    Write-Host ""
    
    Write-Host "💡 For detailed diagnostics, install Node.js and run:" -ForegroundColor Yellow
    Write-Host "   node utilities/troubleshoot-n8n.js" -ForegroundColor White
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
