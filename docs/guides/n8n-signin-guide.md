# N8N Sign-In Guide

## Understanding the Sign-In Page

When you visit `http://localhost:5678/signin?redirect=%252F`, you're seeing n8n's authentication page.

- **`/signin`** - The login page
- **`redirect=%252F`** - After login, redirects to `/` (the main dashboard)

## First-Time Setup

### If You See a **Signup Screen** (First Time)

If this is your first time accessing n8n, you should see a **signup screen** instead of a signin screen. This means:

1. No user account exists yet
2. You need to create the **owner account** (first admin user)
3. Fill in:
   - **Email**: Your email address
   - **Password**: Choose a strong password
   - **First Name** & **Last Name**: Your name

After creating the owner account, you'll be automatically logged in.

### If You See a **Sign-In Screen**

If you see a sign-in screen, it means:
- A user account already exists
- You need to use the **email and password** you created during signup

## Common Issues & Solutions

### ❌ "I Don't Remember My Password"

**Option 1: Use Forgot Password (if SMTP is configured)**
1. Click "Forgot Password" on the sign-in page
2. Enter your email
3. Check your email for reset instructions

**Option 2: Reset User Management (if no SMTP)**
If email/SMTP is not configured, reset user management:

```bash
n8n user-management:reset
```

⚠️ **Warning**: This will delete all user accounts but **keeps your workflows and data**.

After resetting:
1. Restart your n8n server
2. Visit `http://localhost:5678`
3. You'll see the signup screen again
4. Create a new owner account

### ❌ "I Never Created an Account"

If you're seeing a sign-in screen but never created an account:
- Someone else may have created it
- Or it was created during a previous installation

**Solution**: Reset user management (see above)

### ❌ "I See Signup But Want to Sign In"

If you see signup but already have an account:
- Your user data might have been cleared
- Or you're on a fresh installation

**Solution**: Create a new owner account, or check if you're connecting to the correct n8n instance.

## Checking Your n8n Status

### Is n8n Running?

Check if n8n is running on port 5678:

```powershell
Test-NetConnection -ComputerName localhost -Port 5678
```

### Start n8n (if not running)

```bash
n8n start
```

Or if using Docker:
```bash
docker start <container-name>
```

## Default Credentials

**n8n does NOT have default credentials**. You must create your own account during first-time setup.

## After Signing In

Once you're signed in as the owner, you can:
- ✅ Create and manage workflows
- ✅ Invite other users
- ✅ Configure settings
- ✅ Manage credentials
- ✅ Access the full n8n dashboard

## Quick Troubleshooting Checklist

- [ ] Is n8n server running? (Check port 5678)
- [ ] Are you visiting `http://localhost:5678`?
- [ ] Do you see signup or signin screen?
- [ ] Do you remember your email/password?
- [ ] Is SMTP configured? (affects password reset)

## Need Help?

If you're still stuck:
1. Check n8n server logs for errors
2. Try resetting user management: `n8n user-management:reset`
3. Restart n8n server
4. Clear browser cache/cookies
5. Try accessing in incognito/private mode
