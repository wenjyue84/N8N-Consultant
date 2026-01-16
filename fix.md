# N8N Fixes and Troubleshooting Guide

This document contains fixes and solutions for common n8n issues encountered during setup and usage.

---

## Issue: Cannot Login - "Wrong username or password"

### Problem
You're seeing "Wrong username or password" error when trying to log in to n8n at `http://localhost:5678/signin`.

### Root Cause
- Basic authentication may be interfering with n8n's built-in user management
- An existing user account exists but you don't know the password
- Basic auth is deprecated/not fully supported in newer n8n versions

### Solution: Reset User Management

This will clear all user accounts and let you create a fresh owner account. **Your workflows and data will be preserved.**

#### Step-by-Step Instructions

**Step 1: Stop n8n (if running)**
```powershell
# Find and stop n8n processes
Get-Process -Name "node" | Where-Object { $_.Path -like "*node*" } | Stop-Process -Force
```

**Step 2: Disable Basic Authentication (Temporarily)**
```powershell
# Edit the .env file
notepad "$env:USERPROFILE\.n8n\.env"
```

Change this line:
```
N8N_BASIC_AUTH_ACTIVE=false
```

Or comment it out:
```
# N8N_BASIC_AUTH_ACTIVE=false
```

Save and close the file.

**Step 3: Reset User Management**
```powershell
n8n user-management:reset
```

This command will:
- ✅ Delete all user accounts
- ✅ Keep all your workflows
- ✅ Keep all your data
- ✅ Allow you to create a new owner account

**Step 4: Start n8n**
```powershell
n8n start
```

**Step 5: Create New Owner Account**
1. Open your browser
2. Go to `http://localhost:5678`
3. You should now see a **SIGNUP** screen (not signin)
4. Fill in:
   - **Email**: `wenjyue@gmail.com` (or any email you want)
   - **Password**: Choose a strong password (remember this one!)
   - **First Name**: Your first name
   - **Last Name**: Your last name
5. Click "Sign up"
6. You'll be automatically logged in

### Quick Command Summary

```powershell
# 1. Stop n8n
Get-Process -Name "node" | Stop-Process -Force

# 2. Disable basic auth
(Get-Content "$env:USERPROFILE\.n8n\.env") -replace 'N8N_BASIC_AUTH_ACTIVE=true', 'N8N_BASIC_AUTH_ACTIVE=false' | Set-Content "$env:USERPROFILE\.n8n\.env"

# 3. Reset users
n8n user-management:reset

# 4. Start n8n
n8n start

# 5. Visit http://localhost:5678 and create new account
```

### Alternative Solutions

#### Option A: Delete SQLite Database (if using SQLite)
If `n8n user-management:reset` doesn't work, you can manually delete the database:

```powershell
# Find and delete the database file
Remove-Item "$env:USERPROFILE\.n8n\database.sqlite" -ErrorAction SilentlyContinue
Remove-Item "$env:USERPROFILE\.n8n\database.sqlite-shm" -ErrorAction SilentlyContinue
Remove-Item "$env:USERPROFILE\.n8n\database.sqlite-wal" -ErrorAction SilentlyContinue
```

#### Option B: Delete Entire .n8n Directory (Nuclear Option)
⚠️ **WARNING**: This will delete ALL workflows and data!

```powershell
# Backup first (optional)
Copy-Item -Path "$env:USERPROFILE\.n8n" -Destination "$env:USERPROFILE\.n8n.backup" -Recurse

# Delete
Remove-Item "$env:USERPROFILE\.n8n" -Recurse -Force

# Recreate directory
New-Item -ItemType Directory -Path "$env:USERPROFILE\.n8n" -Force
```

### After Successful Login

Once you're logged in, you can:

- ✅ Access all your existing workflows
- ✅ Create new workflows
- ✅ Configure credentials
- ✅ Invite other users (if needed)

**Re-enable Basic Auth (Optional):**
If you want to add an extra layer of protection later:
1. Edit `$env:USERPROFILE\.n8n\.env`
2. Change `N8N_BASIC_AUTH_ACTIVE=false` to `N8N_BASIC_AUTH_ACTIVE=true`
3. Restart n8n

**Note**: Basic auth and user management work differently:
- **Basic Auth**: Protects the entire n8n instance (HTTP-level)
- **User Management**: Individual user accounts within n8n

### Troubleshooting

#### "Command not found: n8n user-management:reset"
- Make sure n8n is installed globally: `npm list -g n8n`
- Try: `npx n8n user-management:reset`

#### Still seeing sign-in screen after reset
- Make sure n8n was restarted
- Clear browser cache/cookies
- Try incognito/private mode
- Check that database files were deleted
- Check the URL - make sure it's `http://localhost:5678` (not `/signin`)

#### "Port 5678 already in use"
- Stop all n8n processes first
- Or change the port: `n8n start --port 5679`

#### Important Notes
- **Remember your password!** Write it down somewhere safe
- Your workflows and data are still there - nothing was deleted
- You're creating a fresh owner account with full admin access

---

## Issue: Connection Refused - "This site can't be reached"

### Problem
Getting `ERR_CONNECTION_REFUSED` when trying to access `http://localhost:5678`.

### Solution

n8n is not running. Start it:

```powershell
n8n start
```

### Verify n8n is Running

```powershell
# Check if port 5678 is open
Test-NetConnection -ComputerName localhost -Port 5678

# Check for node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue
```

### If n8n Won't Start

1. Check for port conflicts:
```powershell
Get-NetTCPConnection -LocalPort 5678 | Select-Object OwningProcess, State
```

2. Try a different port:
```powershell
n8n start --port 5679
```

3. Check n8n logs for errors

---

## Issue: Basic Authentication Setup

### Problem
Want to set up basic authentication for n8n instance.

### Solution

Create `.env` file with basic auth credentials:

```powershell
# Create .n8n directory if it doesn't exist
if (-not (Test-Path "$env:USERPROFILE\.n8n")) {
    New-Item -ItemType Directory -Path "$env:USERPROFILE\.n8n" -Force
}

# Create .env file with credentials
@"
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=wenjyue@gmail.com
N8N_BASIC_AUTH_PASSWORD=YourPasswordHere
"@ | Out-File -FilePath "$env:USERPROFILE\.n8n\.env" -Encoding utf8 -NoNewline
```

**Note**: Basic authentication is deprecated in newer n8n versions and may interfere with user management. Consider using n8n's built-in user management instead.

---

## General Troubleshooting Tips

1. **Check n8n Status**
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 5678
   ```

2. **View Running Processes**
   ```powershell
   Get-Process -Name "node" -ErrorAction SilentlyContinue
   ```

3. **Stop n8n**
   ```powershell
   Get-Process -Name "node" | Stop-Process -Force
   ```

4. **Clear Browser Cache**
   - Clear cookies for localhost:5678
   - Try incognito/private mode

5. **Check Configuration**
   ```powershell
   Get-Content "$env:USERPROFILE\.n8n\.env"
   ```

---

## Summary of Fixes Applied

### Login Issues - RESOLVED ✅
- Disabled basic authentication that was interfering
- Reset user management to clear user accounts
- Created new owner account successfully
- All workflows and data preserved

### Connection Issues - RESOLVED ✅
- Started n8n server successfully
- Verified port 5678 is accessible
- Confirmed n8n is running properly

### API Key Setup - COMPLETED ✅
- API key created and stored securely
- API client utilities created
- Documentation provided

---

**Last Updated**: Based on fixes applied during initial n8n setup
