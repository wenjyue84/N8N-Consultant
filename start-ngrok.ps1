# Start ngrok and display the public URL
Write-Host "Starting ngrok tunnel..." -ForegroundColor Cyan
Write-Host ""

# Start ngrok in background
$job = Start-Job -ScriptBlock {
    & ngrok http 5678 2>&1
}

# Wait for ngrok to initialize
Start-Sleep -Seconds 5

# Try to get the URL from ngrok API
$maxRetries = 10
$retry = 0
$urlFound = $false

while ($retry -lt $maxRetries -and -not $urlFound) {
    try {
        $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 2 -ErrorAction Stop
        if ($response.tunnels -and $response.tunnels.Count -gt 0) {
            $publicUrl = $response.tunnels[0].public_url
            Write-Host ""
            Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
            Write-Host "  ✅ NGROK TUNNEL IS ACTIVE!" -ForegroundColor Green
            Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
            Write-Host ""
            Write-Host "🌐 PUBLIC URL (Share this with your friend):" -ForegroundColor Cyan
            Write-Host "   $publicUrl" -ForegroundColor Yellow -BackgroundColor DarkBlue
            Write-Host ""
            Write-Host "🔐 BASIC AUTH CREDENTIALS:" -ForegroundColor Cyan
            Write-Host "   Username: wenjyue@gmail.com" -ForegroundColor White
            Write-Host "   Password: N8nc@wjlew1" -ForegroundColor White
            Write-Host ""
            Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
            Write-Host "   1. Share the URL and credentials above with your friend" -ForegroundColor White
            Write-Host "   2. Sign in to n8n using the ngrok URL" -ForegroundColor White
            Write-Host "   3. Go to Settings → Users → Click 'Invite' button" -ForegroundColor White
            Write-Host "   4. Enter your friend's email and send invitation" -ForegroundColor White
            Write-Host ""
            Write-Host "💡 TIP: View ngrok dashboard at http://127.0.0.1:4040" -ForegroundColor Gray
            Write-Host "⚠️  Keep this window open - closing it will stop ngrok" -ForegroundColor Yellow
            Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
            $urlFound = $true
        }
    } catch {
        $retry++
        if ($retry -lt $maxRetries) {
            Start-Sleep -Seconds 2
        }
    }
}

if (-not $urlFound) {
    Write-Host ""
    Write-Host "⚠️  Could not automatically retrieve ngrok URL." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please do one of the following:" -ForegroundColor Cyan
    Write-Host "1. Open http://127.0.0.1:4040 in your browser" -ForegroundColor White
    Write-Host "2. Look for the 'Forwarding' URL in the ngrok dashboard" -ForegroundColor White
    Write-Host "3. The URL format will be: https://xxxx-xxxx.ngrok.io" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Ngrok is running in the background. To stop it, run:" -ForegroundColor Yellow
    Write-Host "   Stop-Job -Id $($job.Id); Remove-Job -Id $($job.Id)" -ForegroundColor Gray
}

# Keep script running
Write-Host ""
Write-Host "Press Ctrl+C to stop ngrok..." -ForegroundColor Yellow
try {
    while ($true) {
        Start-Sleep -Seconds 10
        # Check if ngrok is still running
        $process = Get-Process -Name "ngrok" -ErrorAction SilentlyContinue
        if (-not $process) {
            Write-Host "Ngrok process stopped." -ForegroundColor Red
            break
        }
    }
} catch {
    Write-Host "Stopping ngrok..." -ForegroundColor Yellow
    Stop-Job -Id $job.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $job.Id -ErrorAction SilentlyContinue
}
