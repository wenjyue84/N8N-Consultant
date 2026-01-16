---
description: Start, stop, and manage n8n server
---

# Start n8n

## Prerequisites
- n8n installed globally: `npm install -g n8n`
- Node.js 18+

## Start n8n Server

// turbo
```powershell
n8n start
```

Wait for: `Editor is now accessible via: http://localhost:5678`

## Start with Tunnel (ngrok)

```powershell
.\start-ngrok.ps1
```

This starts both n8n AND ngrok tunnel for public access.

## Get ngrok Public URL

```powershell
.\get-ngrok-url.ps1
```

## Stop n8n

```powershell
# Find and stop node processes
Get-Process -Name "node" | Stop-Process -Force
```

Or just `Ctrl+C` in the terminal running n8n.

## Verify n8n is Running

// turbo
```powershell
Test-NetConnection -ComputerName localhost -Port 5678
```

Expected: `TcpTestSucceeded : True`

## Start with Different Port

```powershell
n8n start --port 5679
```

## Common Issues

### Port 5678 already in use
```powershell
# Check what's using the port
Get-NetTCPConnection -LocalPort 5678 | Select-Object OwningProcess, State

# Kill it or use different port
n8n start --port 5679
```

### n8n not found
```powershell
# Install globally
npm install -g n8n

# Verify
n8n --version
```
