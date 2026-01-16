# N8N MCP Server Setup Guide

## What is N8N MCP Server?

MCP (Model Context Protocol) is a built-in feature in n8n that allows AI agents (like Claude Desktop, Cursor, etc.) to connect to your n8n instance and:
- List workflows
- Trigger workflows
- Retrieve workflow metadata
- Execute workflow actions

## Current Status

I found your MCP configuration file at:
- `%USERPROFILE%\.cursor\mcp.json`

Currently configured:
- ✅ Notion MCP server

**N8N MCP server is NOT yet configured in your MCP client.**

## Setting Up N8N MCP Server

### Step 1: Enable MCP in n8n

1. **Open n8n UI**: `http://localhost:5678`
2. **Go to Settings → Instance-level MCP**
3. **Toggle "Enable MCP access"** to ON
4. **Select workflows** you want to expose (only published workflows with supported triggers)
5. **Generate Access Token**:
   - Go to the "Access Token" tab
   - Click "Generate Token"
   - Copy the token (you'll need this for MCP client config)

### Step 2: Configure MCP Client

Add n8n to your MCP configuration file. The configuration depends on the MCP transport type:

#### Option A: HTTP Transport (Recommended for local)

Edit `%USERPROFILE%\.cursor\mcp.json`:

```json
{
  "mcpServers": {
    "Notion": {
      "url": "https://mcp.notion.com/mcp"
    },
    "n8n": {
      "url": "http://localhost:5678/mcp-server/http",
      "headers": {
        "Authorization": "Bearer YOUR_ACCESS_TOKEN_HERE"
      }
    }
  }
}
```

#### Option B: SSE Transport

```json
{
  "mcpServers": {
    "Notion": {
      "url": "https://mcp.notion.com/mcp"
    },
    "n8n": {
      "url": "http://localhost:5678/mcp-server/sse",
      "headers": {
        "Authorization": "Bearer YOUR_ACCESS_TOKEN_HERE"
      }
    }
  }
}
```

#### Option C: Using API Key (Alternative)

If you prefer using your existing API key:

```json
{
  "mcpServers": {
    "Notion": {
      "url": "https://mcp.notion.com/mcp"
    },
    "n8n": {
      "url": "http://localhost:5678/mcp-server/http",
      "headers": {
        "X-N8N-API-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOGE2NjM4NC01YTc4LTRiY2YtYTFkOS05NzRmMDU5YjdhYWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY4NTI3OTA4fQ.ZfDHvAG6hcjZqDxr4yXCIqZRGDinpnUowSkf32N6KZc"
      }
    }
  }
}
```

### Step 3: Verify MCP Server is Running

Test if the MCP endpoint is accessible:

```powershell
# Using your API key
$headers = @{
    "X-N8N-API-KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOGE2NjM4NC01YTc4LTRiY2YtYTFkOS05NzRmMDU5YjdhYWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY4NTI3OTA4fQ.ZfDHvAG6hcjZqDxr4yXCIqZRGDinpnUowSkf32N6KZc"
}
Invoke-RestMethod -Uri "http://localhost:5678/mcp-server/http" -Headers $headers
```

If it returns MCP specification, it's working!

## Requirements

### n8n Version
- Requires n8n version with MCP support (recent versions)
- Your version: 2.3.5 ✅ (should support MCP)

### Feature Flag
If MCP doesn't appear in settings, enable it via environment variable:

Add to `%USERPROFILE%\.n8n\.env`:
```
N8N_FEATURE_FLAG_MCP=true
```

Then restart n8n.

### Workflow Requirements
For workflows to be exposed via MCP:
- ✅ Must be **published** (not draft)
- ✅ Must have a supported trigger:
  - Webhook
  - Schedule
  - Chat
  - Form

## Troubleshooting

### "MCP Server not found"
1. Check if MCP is enabled in n8n Settings
2. Verify the endpoint URL is correct
3. Check if n8n is running: `Test-NetConnection localhost -Port 5678`
4. Ensure feature flag is set: `N8N_FEATURE_FLAG_MCP=true`

### "Connection refused"
- Make sure n8n is running
- Check firewall settings
- Try `127.0.0.1` instead of `localhost`

### "401 Unauthorized"
- Verify your API key or access token is correct
- Check token hasn't expired
- Ensure token has proper permissions

### MCP endpoint returns 404
- MCP might not be enabled
- Check feature flag: `N8N_FEATURE_FLAG_MCP=true`
- Restart n8n after enabling

## Next Steps

1. **Enable MCP in n8n UI** (Settings → Instance-level MCP)
2. **Generate Access Token** or use existing API key
3. **Update MCP config file** with n8n server details
4. **Restart Cursor/IDE** to load new MCP configuration
5. **Test connection** using the verification commands

## Resources

- [n8n MCP Documentation](https://docs.n8n.io/advanced-ai/accessing-n8n-mcp-server/)
- Your API Key: Stored in `credentials/n8n-api-key.txt`
- Your n8n Instance: `http://localhost:5678`
