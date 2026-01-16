# Import Notion Inbox Reminder Workflow
# Tries API first, falls back to CLI

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Importing Notion Inbox Reminder Workflow" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$workflowFile = "workflow-templates/notion-inbox-reminder.json"

if (-not (Test-Path $workflowFile)) {
    Write-Host "❌ Error: Workflow file not found: $workflowFile" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "📄 Workflow file: $workflowFile" -ForegroundColor White
Write-Host ""

# Try Node.js script first (which handles API + CLI fallback)
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "🔄 Using Node.js import utility..." -ForegroundColor Cyan
    Write-Host ""
    
    try {
        node utilities/import-workflow.js $workflowFile
        Write-Host ""
        Write-Host "✅ Import complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Next steps:" -ForegroundColor Yellow
        Write-Host "   1. Open n8n at http://localhost:5678" -ForegroundColor White
        Write-Host "   2. Configure Notion and Telegram credentials" -ForegroundColor White
        Write-Host "   3. Update Chat ID in Telegram node" -ForegroundColor White
        Write-Host "   4. Test and activate the workflow" -ForegroundColor White
        Write-Host ""
        exit 0
    } catch {
        Write-Host "❌ Node.js import failed: $_" -ForegroundColor Red
        Write-Host ""
    }
} else {
    Write-Host "⚠️  Node.js not found, trying direct CLI import..." -ForegroundColor Yellow
    Write-Host ""
}

# Direct CLI fallback
Write-Host "🔄 Attempting direct CLI import..." -ForegroundColor Cyan
Write-Host ""

try {
    $fullPath = (Resolve-Path $workflowFile).Path
    $command = "npx n8n import:workflow --input=`"$fullPath`" --replaceExisting"
    
    Write-Host "   Running: $command" -ForegroundColor Gray
    Write-Host ""
    
    Invoke-Expression $command
    
    Write-Host ""
    Write-Host "✅ Successfully imported workflow via CLI!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Refresh n8n UI at http://localhost:5678" -ForegroundColor White
    Write-Host "   2. Configure Notion and Telegram credentials" -ForegroundColor White
    Write-Host "   3. Update Chat ID in Telegram node" -ForegroundColor White
    Write-Host "   4. Test and activate the workflow" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ CLI import failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Make sure n8n is installed: npm install -g n8n" -ForegroundColor White
    Write-Host "   2. Check that the workflow JSON is valid" -ForegroundColor White
    Write-Host "   3. Try importing manually via n8n UI:" -ForegroundColor White
    Write-Host "      - Open http://localhost:5678" -ForegroundColor Gray
    Write-Host "      - Click ... → Import from File" -ForegroundColor Gray
    Write-Host "      - Select $workflowFile" -ForegroundColor Gray
    Write-Host ""
    exit 1
}
