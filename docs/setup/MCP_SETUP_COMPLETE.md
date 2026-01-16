# ✅ N8N MCP Server Setup - Status

## What I Found

1. **MCP Config Location**: `%USERPROFILE%\.cursor\mcp.json`
2. **Current Status**: MCP endpoint returned 404 (not enabled yet)
3. **Action Taken**: Added MCP feature flag to enable it

## What I've Done

### ✅ Step 1: Enabled MCP Feature Flag
Added to `%USERPROFILE%\.n8n\.env`:
```
N8N_FEATURE_FLAG_MCP=true
```

### ✅ Step 2: Updated MCP Client Configuration
Updated `%USERPROFILE%\.cursor\mcp.json` to include n8n MCP server:
```json
{
  "mcpServers": {
    "Notion": {
      "url": "https://mcp.notion.com/mcp"
    },
    "n8n": {
      "url": "http://localhost:5678/mcp-server/http",
      "headers": {
        "X-N8N-API-KEY": "your-api-key-here"
      }
    }
  }
}
```

## Next Steps Required

### 1. Restart n8n
The MCP feature flag requires a restart to take effect:

```powershell
# Stop n8n (if running)
Get-Process -Name "node" | Stop-Process -Force

# Start n8n
n8n start
```

### 2. Enable MCP in n8n UI
After restarting n8n:

1. Open `http://localhost:5678` in your browser
2. Go to **Settings → Instance-level MCP**
3. Toggle **"Enable MCP access"** to ON
4. Select which workflows to expose (only published workflows with supported triggers)
5. Save settings

### 3. Restart Cursor/IDE
After updating the MCP config, restart Cursor to load the new configuration:
- Close Cursor completely
- Reopen Cursor
- The n8n MCP server should now be available

### 4. Verify MCP Server is Working

Test the endpoint:
```powershell
$headers = @{
    "X-N8N-API-KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOGE2NjM4NC01YTc4LTRiY2YtYTFkOS05NzRmMDU5YjdhYWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY4NTI3OTA4fQ.ZfDHvAG6hcjZqDxr4yXCIqZRGDinpnUowSkf32N6KZc"
}
Invoke-RestMethod -Uri "http://localhost:5678/mcp-server/http" -Headers $headers
```

If it returns MCP specification JSON, it's working! ✅

## Current Configuration

- **n8n Instance**: `http://localhost:5678`
- **API Key**: Stored in `credentials/n8n-api-key.txt`
- **MCP Feature Flag**: Enabled in `.env`
- **MCP Client Config**: Updated in `.cursor/mcp.json`

## Troubleshooting

If MCP still doesn't work after restart:

1. **Check n8n version**: `n8n --version` (should be 2.3.5+)
2. **Verify feature flag**: Check `.env` file has `N8N_FEATURE_FLAG_MCP=true`
3. **Check n8n logs**: Look for MCP-related errors
4. **Verify endpoint**: Test `http://localhost:5678/mcp-server/http` with API key
5. **Check workflows**: Only published workflows with supported triggers are exposed

## Resources

- Setup guide: `mcp-setup-guide.md`
- API key: `credentials/n8n-api-key.txt`
- n8n docs: https://docs.n8n.io/advanced-ai/accessing-n8n-mcp-server/

---

**Status**: Configuration updated, but n8n needs to be restarted and MCP enabled in UI for full functionality.
