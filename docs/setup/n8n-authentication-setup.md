# N8N Basic Authentication Setup

## Configuration Complete ✅

Basic authentication has been configured for your n8n instance.

## Credentials Set

- **Username**: `wenjyue@gmail.com`
- **Password**: `N8nc@wjlew1`
- **Authentication**: Active

## Configuration Location

The `.env` file is located at:
```
%USERPROFILE%\.n8n\.env
```

Or in PowerShell:
```
$env:USERPROFILE\.n8n\.env
```

## Starting n8n with Authentication

To start n8n with basic authentication enabled:

```powershell
n8n start
```

Or if n8n is already running, restart it:

```powershell
# Stop n8n (if running)
# Then start it again
n8n start
```

## Accessing n8n

After starting n8n with basic authentication:

1. Visit `http://localhost:5678`
2. You'll be prompted for credentials
3. Enter:
   - **Username**: `wenjyue@gmail.com`
   - **Password**: `N8nc@wjlew1`

## Important Notes

⚠️ **Security Considerations**:
- The `.env` file contains your password in plain text
- Keep this file secure and don't share it
- Consider adding `.env` to `.gitignore` if using version control

⚠️ **Basic Auth vs User Management**:
- Basic authentication is a simple username/password protection
- It protects the entire n8n instance
- This is different from n8n's built-in user management system
- With basic auth enabled, you'll need to authenticate before accessing n8n

## Disabling Basic Authentication

To disable basic authentication, edit the `.env` file:

```powershell
# Edit the file
notepad "$env:USERPROFILE\.n8n\.env"
```

Change:
```
N8N_BASIC_AUTH_ACTIVE=false
```

Or remove the basic auth lines entirely.

## Verifying Configuration

Check your configuration:

```powershell
Get-Content "$env:USERPROFILE\.n8n\.env"
```

You should see:
```
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=wenjyue@gmail.com
N8N_BASIC_AUTH_PASSWORD=N8nc@wjlew1
```

## Troubleshooting

### Authentication Not Working
- Make sure n8n is restarted after creating the `.env` file
- Check that the `.env` file is in the correct location
- Verify there are no extra spaces or characters in the file

### Can't Access n8n
- Check if n8n is running: `Test-NetConnection localhost -Port 5678`
- Check n8n logs for errors
- Verify the `.env` file syntax is correct

### Want to Change Password
Edit the `.env` file and change the `N8N_BASIC_AUTH_PASSWORD` value, then restart n8n.
