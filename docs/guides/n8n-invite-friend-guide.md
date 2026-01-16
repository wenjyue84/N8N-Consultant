# N8N Invite Friend Guide - Using Ngrok

This guide will help you temporarily expose your local n8n instance so your friend can join and collaborate with you.

## Prerequisites

✅ **n8n is running** on `localhost:5678`  
✅ **Basic authentication is enabled** (for security)  
✅ **You have an owner account** in n8n  

## Step 1: Install Ngrok

### Option A: Using npm (Recommended)
```powershell
npm install -g ngrok
```

### Option B: Download Binary
1. Visit: https://ngrok.com/download
2. Download the Windows version
3. Extract and add to PATH, or use from the extracted folder

### Option C: Using Chocolatey (if installed)
```powershell
choco install ngrok
```

## Step 2: Verify n8n is Running

Before starting ngrok, make sure n8n is running:

```powershell
Test-NetConnection -ComputerName localhost -Port 5678
```

If it says `TcpTestSucceeded : True`, you're good to go!

If not, start n8n:
```powershell
n8n start
```

## Step 3: Start Ngrok Tunnel

Open a **new PowerShell window** (keep n8n running in the original window) and run:

```powershell
ngrok http 5678
```

You'll see output like:
```
Session Status                online
Account                       Your Account (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://ab12cd34.ngrok.io -> http://localhost:5678
```

**Important**: Copy the `Forwarding` URL (e.g., `https://ab12cd34.ngrok.io`) - this is what you'll share with your friend!

## Step 4: Share Access with Your Friend

### What to Share

1. **The ngrok URL**: `https://ab12cd34.ngrok.io` (your actual URL will be different)
2. **Basic Auth Credentials** (if basic auth is enabled):
   - Username: `wenjyue@gmail.com`
   - Password: `N8nc@wjlew1`

⚠️ **Security Note**: The ngrok URL changes each time you restart ngrok (unless you have a paid plan with a static domain). Share the new URL if you restart ngrok.

### How Your Friend Should Access

1. Open the ngrok URL in their browser: `https://ab12cd34.ngrok.io`
2. If basic auth is enabled, they'll be prompted for:
   - Username: `wenjyue@gmail.com`
   - Password: `N8nc@wjlew1`
3. After basic auth, they'll see the n8n sign-in page
4. They should **NOT** create a new account - wait for you to invite them!

## Step 5: Invite Your Friend in n8n

Once your friend can access the n8n interface (even if they can't sign in yet), you need to invite them:

### Method 1: Using n8n User Management UI

1. **Sign in** to your n8n instance (using the ngrok URL)
2. Go to **Settings** → **Users** (or click your profile → Users)
3. Click the **"Invite"** button (red button in the top right)
4. Enter your friend's **email address**
5. Select their **Account Type**:
   - **Member**: Can create and edit workflows, but limited admin access
   - **Admin**: Full access (if you have a paid plan)
6. Click **"Send Invitation"**

Your friend will receive an invitation email (if SMTP is configured) or you can share the invitation link manually.

### Method 2: Using n8n CLI (Alternative)

If the UI method doesn't work, you can invite via command line:

```powershell
n8n user-management:invite --email="friend@example.com" --role="member"
```

Replace `friend@example.com` with your friend's actual email.

## Step 6: Your Friend Accepts the Invitation

Your friend should:

1. Check their email for the invitation link (if SMTP is configured)
2. Or use the invitation link you share with them
3. Click the invitation link
4. Set their password
5. They'll be automatically signed in!

## Important Security Considerations

### ⚠️ Basic Authentication is Your First Layer

Since you have basic authentication enabled, anyone accessing the ngrok URL will need:
- The ngrok URL itself
- Your basic auth username and password

**Keep these credentials secure!**

### ⚠️ Ngrok Exposes Your n8n Publicly

- **Anyone with the ngrok URL** can attempt to access your n8n
- **Keep ngrok running only when needed** - stop it when done
- **Don't share the URL publicly** - only share with trusted friends
- **Monitor ngrok traffic** at `http://127.0.0.1:4040` (ngrok web interface)

### ⚠️ Free Ngrok Limitations

- **URL changes** every time you restart ngrok
- **Session timeout** after 2 hours of inactivity (free plan)
- **Limited bandwidth** on free plan
- **No custom domain** on free plan

### Best Practices

1. ✅ **Keep basic auth enabled** (you already have this)
2. ✅ **Only run ngrok when actively collaborating**
3. ✅ **Stop ngrok when done**: Press `Ctrl+C` in the ngrok window
4. ✅ **Use strong passwords** for n8n user accounts
5. ✅ **Monitor access** through n8n's user management
6. ✅ **Consider upgrading** to ngrok paid plan for static URLs (if needed long-term)

## Stopping Ngrok

When you're done sharing access:

1. Go to the PowerShell window where ngrok is running
2. Press `Ctrl+C`
3. The tunnel will close and the URL will no longer work

**Note**: Your n8n will continue running locally - only the public tunnel is closed.

## Troubleshooting

### "ngrok: command not found"
- Make sure ngrok is installed: `npm install -g ngrok`
- Or use the full path to ngrok executable
- Or restart PowerShell after installation

### "Tunnel not found" or "Connection refused"
- Make sure n8n is running: `Test-NetConnection localhost -Port 5678`
- Make sure ngrok is pointing to the correct port: `ngrok http 5678`
- Check if n8n is running on a different port

### Friend Can't Access the URL
- Verify ngrok is still running (check the ngrok window)
- Check if the URL has changed (free ngrok URLs change on restart)
- Verify basic auth credentials are correct
- Check firewall settings on your computer

### Friend Can Access but Can't Sign In
- Make sure you've sent them an invitation
- Check if they're using the invitation link
- Verify their email matches the invitation
- Check n8n logs for errors

### Ngrok Session Expired
Free ngrok sessions expire after 2 hours of inactivity. Simply restart ngrok:
```powershell
ngrok http 5678
```
Share the new URL with your friend.

## Alternative: Static Ngrok URL (Paid Plan)

If you need a permanent URL that doesn't change:

1. Sign up for ngrok paid plan
2. Configure a static domain in ngrok dashboard
3. Use: `ngrok http 5678 --domain=your-static-domain.ngrok.io`

This way, the URL stays the same even after restarting ngrok.

## Next Steps After Inviting

Once your friend is set up:

1. ✅ They can access n8n through the ngrok URL
2. ✅ They can create and edit workflows (based on their role)
3. ✅ You can collaborate on workflows together
4. ✅ Monitor their activity in Settings → Users

## Quick Reference

```powershell
# 1. Check n8n is running
Test-NetConnection localhost -Port 5678

# 2. Start ngrok (in new terminal)
ngrok http 5678

# 3. Share the Forwarding URL with friend
# Example: https://ab12cd34.ngrok.io

# 4. Invite friend in n8n UI: Settings → Users → Invite

# 5. Stop ngrok when done: Ctrl+C
```

---

**Remember**: Keep ngrok running only when actively collaborating, and always keep basic authentication enabled for security! 🔒
