---
description: Common n8n issues and fixes
---

# Troubleshoot n8n

## Login Issues

### "Wrong username or password"

**Quick Fix:**
```powershell
# Stop n8n
Get-Process -Name "node" | Stop-Process -Force

# Reset user management (keeps workflows!)
n8n user-management:reset

# Restart
n8n start
```

Then visit http://localhost:5678 - you'll see signup screen.

### Stuck on signin page
- Clear browser cache/cookies for localhost:5678
- Try incognito mode
- Check URL is `http://localhost:5678` not `http://localhost:5678/signin`

---

## Connection Issues

### "This site can't be reached" / Connection refused

n8n is not running:
```powershell
n8n start
```

### "Port 5678 already in use"

```powershell
# Check what's using port
Get-NetTCPConnection -LocalPort 5678 | Select-Object OwningProcess

# Kill it
Get-Process -Id <PROCESS_ID> | Stop-Process -Force

# Or use different port
n8n start --port 5679
```

---

## API Issues

### "Invalid API key"

1. Verify key exists:
   - n8n UI → Settings → API → API Keys
   
2. Regenerate if needed:
   - Delete old key
   - Create new key
   - Update `credentials/n8n-api-key.txt`

3. Check header format:
   ```powershell
   $headers = @{ "X-N8N-API-KEY" = "your-actual-key" }
   ```

---

## Database Issues

### Reset everything (NUCLEAR - loses data!)

```powershell
# Backup first!
Copy-Item -Path "$env:USERPROFILE\.n8n" -Destination "$env:USERPROFILE\.n8n.backup" -Recurse

# Delete SQLite database
Remove-Item "$env:USERPROFILE\.n8n\database.sqlite*" -Force

# Restart n8n
n8n start
```

---

## Workflow Issues

### Workflow not triggering

1. **Check activation** - Workflow must be active (toggle ON)
2. **Check trigger** - Correct schedule/webhook configured?
3. **Check logs** - n8n UI → Executions → look for errors

### Webhook not receiving data

1. **ngrok running?** - Check `.\get-ngrok-url.ps1`
2. **Correct URL?** - Use Test URL for testing, Production URL when active
3. **Firewall?** - Check Windows Firewall isn't blocking

---

## Config Issues

### View current config

```powershell
Get-Content "$env:USERPROFILE\.n8n\.env"
```

### Edit config

```powershell
notepad "$env:USERPROFILE\.n8n\.env"
```

After editing, restart n8n.

---

## Quick Diagnostic Commands

```powershell
# Is n8n installed?
n8n --version

# Is n8n running?
Test-NetConnection -ComputerName localhost -Port 5678

# What's using port 5678?
Get-NetTCPConnection -LocalPort 5678 -ErrorAction SilentlyContinue

# View n8n processes
Get-Process -Name "node" -ErrorAction SilentlyContinue

# Check API key file
Get-Content "credentials\n8n-api-key.txt"
```

---

## Still Stuck?

1. Check `fix.md` in project root for detailed fixes
2. Check n8n docs: https://docs.n8n.io/
3. Check n8n community: https://community.n8n.io/
