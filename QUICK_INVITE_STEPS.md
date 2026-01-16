# Quick Steps to Invite Your Friend

## ✅ What's Already Done
- ✅ ngrok is installed
- ✅ n8n is running on port 5678
- ✅ Basic authentication is configured

## 🚀 Next Steps (Do These Now)

### Step 1: Start Ngrok

Open a **new PowerShell terminal** and run:

```powershell
ngrok http 5678
```

**If ngrok asks for authentication:**
1. Visit: https://dashboard.ngrok.com/signup (free account)
2. Sign up and get your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken
3. Run: `ngrok config add-authtoken YOUR_TOKEN_HERE`
4. Then run `ngrok http 5678` again

### Step 2: Get Your Public URL

After starting ngrok, you'll see output like:

```
Forwarding    https://ab12cd34.ngrok.io -> http://localhost:5678
```

**Copy that URL** (the `https://xxxx.ngrok.io` part) - this is what you'll share!

**Alternative:** Open http://127.0.0.1:4040 in your browser to see the ngrok dashboard with your URL.

### Step 3: Share with Your Friend

Send your friend:
- **The ngrok URL**: `https://xxxx.ngrok.io` (your actual URL)
- **Basic Auth Username**: `wenjyue@gmail.com`
- **Basic Auth Password**: `N8nc@wjlew1`

### Step 4: Invite Your Friend in n8n

1. **You sign in** to n8n using the ngrok URL
2. Go to **Settings** → **Users**
3. Click the red **"Invite"** button
4. Enter your friend's email address
5. Select their role (Member or Admin)
6. Click **"Send Invitation"**

### Step 5: Your Friend Accepts

Your friend should:
1. Open the ngrok URL you shared
2. Enter the basic auth credentials
3. Use the invitation link (from email or you can share it)
4. Set their password
5. They're in! 🎉

## ⚠️ Important Notes

- **Keep ngrok running** - Don't close the terminal window where ngrok is running
- **URL changes** - Free ngrok URLs change each time you restart (unless you have a paid plan)
- **Security** - Only share the URL with trusted friends
- **Stop when done** - Press `Ctrl+C` in the ngrok window when you're done collaborating

## 🆘 Troubleshooting

**"ngrok: command not found"**
- Make sure ngrok is installed: `npm install -g ngrok`
- Restart PowerShell after installation

**"Tunnel not found"**
- Make sure n8n is running: `Test-NetConnection localhost -Port 5678`
- Make sure ngrok is pointing to port 5678

**Friend can't access**
- Verify ngrok is still running
- Check if the URL has changed
- Verify basic auth credentials are correct

---

**That's it!** Once ngrok is running and you have the URL, you're ready to invite your friend! 🚀
