# Script to get ngrok URL
Write-Host "Checking for ngrok tunnel..." -ForegroundColor Cyan
Write-Host ""

$maxAttempts = 10
$attempt = 0
$urlFound = $false

while ($attempt -lt $maxAttempts -and -not $urlFound) {
    try {
        $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 2 -ErrorAction Stop
        
        if ($response.tunnels -and $response.tunnels.Count -gt 0) {
            $tunnel = $response.tunnels[0]
            $publicUrl = $tunnel.public_url
            
            Write-Host ""
            Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
            Write-Host "  ✅ FOUND YOUR NGROK URL!" -ForegroundColor Green
            Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
            Write-Host ""
            Write-Host "🌐 YOUR PUBLIC URL:" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "   $publicUrl" -ForegroundColor Yellow -BackgroundColor DarkBlue
            Write-Host ""
            Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
            Write-Host ""
            Write-Host "🔐 BASIC AUTH CREDENTIALS:" -ForegroundColor Cyan
            Write-Host "   Username: wenjyue@gmail.com" -ForegroundColor White
            Write-Host "   Password: N8nc@wjlew1" -ForegroundColor White
            Write-Host ""
            Write-Host "📋 Share both the URL and credentials with your friend!" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "💡 View full dashboard: http://127.0.0.1:4040" -ForegroundColor Gray
            Write-Host ""
            
            # Copy to clipboard if possible
            try {
                Set-Clipboard -Value $publicUrl
                Write-Host "✅ URL copied to clipboard!" -ForegroundColor Green
            } catch {
                Write-Host "💡 Tip: You can copy the URL above" -ForegroundColor Gray
            }
            
            $urlFound = $true
            break
        }
    } catch {
        $attempt++
        if ($attempt -lt $maxAttempts) {
            Write-Host "." -NoNewline -ForegroundColor Gray
            Start-Sleep -Seconds 1
        }
    }
}

if (-not $urlFound) {
    Write-Host ""
    Write-Host "⚠️  Cannot find ngrok tunnel." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Make sure ngrok is running:" -ForegroundColor Cyan
    Write-Host "1. Open a PowerShell terminal" -ForegroundColor White
    Write-Host "2. Run: ngrok http 5678" -ForegroundColor Green
    Write-Host "3. Wait a few seconds, then run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "Or open http://127.0.0.1:4040 in your browser" -ForegroundColor Cyan
}
