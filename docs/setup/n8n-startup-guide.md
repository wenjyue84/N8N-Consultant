# N8N Startup Guide

## Starting N8N

n8n has been started in the background. Here's how to verify and manage it.

## Check if n8n is Running

### Method 1: Check Port
```powershell
Test-NetConnection -ComputerName localhost -Port 5678
```

If it says `TcpTestSucceeded : True`, n8n is running!

### Method 2: Check Browser
Visit: `http://localhost:5678`

You should see either:
- **Signup screen** (if no users exist) ✅
- **Sign-in screen** (if users exist)
- **Connection refused** (if n8n is not running) ❌

### Method 3: Check Processes
```powershell
Get-Process -Name "node" -ErrorAction SilentlyContinue
```

## Starting N8N Manually

If n8n is not running, start it:

### Option 1: Background (Recommended)
```powershell
n8n start
```
Then press `Ctrl+C` to detach (n8n keeps running)

### Option 2: Foreground
```powershell
n8n start
```
Keep the terminal open - n8n runs in this window

### Option 3: Different Port
If port 5678 is busy:
```powershell
n8n start --port 5679
```
Then access at: `http://localhost:5679`

## Stopping N8N

### Method 1: If Running in Foreground
Press `Ctrl+C` in the terminal where n8n is running

### Method 2: Kill Process
```powershell
Get-Process -Name "node" | Where-Object { $_.Path -like "*node*" } | Stop-Process -Force
```

### Method 3: Kill by Port
```powershell
$process = Get-NetTCPConnection -LocalPort 5678 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process) { Stop-Process -Id $process -Force }
```

## Troubleshooting

### "Port 5678 already in use"
Another process is using port 5678:
```powershell
# Find what's using the port
Get-NetTCPConnection -LocalPort 5678 | Select-Object OwningProcess, State

# Kill it (replace PID with actual process ID)
Stop-Process -Id <PID> -Force
```

### "Cannot find module 'n8n'"
n8n is not installed or not in PATH:
```powershell
# Install globally
npm install -g n8n

# Or use npx
npx n8n start
```

### "Connection Refused"
n8n is not running:
1. Check if n8n process exists: `Get-Process -Name "node"`
2. Check n8n logs for errors
3. Try starting n8n again: `n8n start`
4. Check firewall settings

### n8n Starts But Immediately Crashes
Check the error messages in the terminal. Common issues:
- Database corruption
- Port conflicts
- Missing dependencies
- Configuration errors

## Viewing N8N Logs

When n8n runs in foreground, you'll see logs in the terminal.

For background processes, logs are typically in:
- `%USERPROFILE%\.n8n\logs\` (if configured)
- Or check the terminal output

## Configuration

n8n configuration is in:
- `%USERPROFILE%\.n8n\.env` - Environment variables
- `%USERPROFILE%\.n8n\` - Data directory

## Quick Status Check

Run this to check everything:
```powershell
Write-Host "=== N8N Status Check ===" -ForegroundColor Cyan
Write-Host "Port 5678: " -NoNewline
if (Test-NetConnection -ComputerName localhost -Port 5678 -InformationLevel Quiet) {
    Write-Host "✅ OPEN" -ForegroundColor Green
} else {
    Write-Host "❌ CLOSED" -ForegroundColor Red
}
Write-Host "Node Processes: " -NoNewline
$processes = Get-Process -Name "node" -ErrorAction SilentlyContinue
Write-Host "$($processes.Count) running" -ForegroundColor $(if ($processes) { "Green" } else { "Red" })
```

## Next Steps After Starting

1. ✅ Verify n8n is running (check port 5678)
2. ✅ Open `http://localhost:5678` in browser
3. ✅ Create your owner account (if you see signup screen)
4. ✅ Start creating workflows!
