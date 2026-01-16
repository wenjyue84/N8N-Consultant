# Dependencies & External Services

## Core Dependencies

### n8n
- **Version**: 2.3.5+
- **Install**: `npm install -g n8n`
- **Docs**: https://docs.n8n.io/
- **Local URL**: http://localhost:5678

### Node.js
- **Version**: 18+ recommended
- **Used for**: Running utilities, n8n itself

### ngrok (Optional)
- **Purpose**: Expose local n8n to internet
- **Install**: Download from https://ngrok.com/
- **Config**: Requires auth token in `~/.ngrok2/ngrok.yml`

## n8n Configuration

### Environment Variables
Location: `$env:USERPROFILE\.n8n\.env`

```env
# Core settings
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_HOST=localhost

# Security (choose one approach)
# Option 1: User management (recommended)
# Just create account via UI

# Option 2: Basic auth (deprecated)
# N8N_BASIC_AUTH_ACTIVE=true
# N8N_BASIC_AUTH_USER=your-email
# N8N_BASIC_AUTH_PASSWORD=your-password

# Database (default: SQLite)
# DB_TYPE=sqlite

# For production, consider:
# DB_TYPE=postgresdb
# DB_POSTGRESDB_HOST=localhost
# DB_POSTGRESDB_PORT=5432
# DB_POSTGRESDB_DATABASE=n8n
# DB_POSTGRESDB_USER=n8n
# DB_POSTGRESDB_PASSWORD=secret
```

## API Access

### n8n REST API
- **Base URL**: `http://localhost:5678/api/v1`
- **Auth**: API key in header `X-N8N-API-KEY`
- **Key Location**: `credentials/n8n-api-key.txt`

### Key Endpoints
| Endpoint              | Method | Purpose                    |
|-----------------------|--------|----------------------------|
| `/workflows`          | GET    | List all workflows         |
| `/workflows`          | POST   | Create workflow            |
| `/workflows/{id}`     | GET    | Get specific workflow      |
| `/workflows/{id}`     | PUT    | Update workflow            |
| `/workflows/{id}`     | DELETE | Delete workflow            |
| `/executions`         | GET    | List executions            |
| `/credentials`        | GET    | List credentials           |

### Rate Limits
- Local: No limits
- With ngrok: Be mindful of tunnel bandwidth

## MCP Server Integration

### n8n-mcp Server (Installed)

The `n8n-mcp` server provides AI assistants with deep knowledge of n8n nodes and workflow management capabilities.

**Package**: [czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp)

### Configuration by IDE

#### Claude Desktop / Claude Code
Location: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "http://localhost:5678",
        "N8N_API_KEY": "<see credentials/n8n-api-key.txt>"
      }
    }
  }
}
```

#### Cursor IDE
Location: `.cursor/mcp.json` in project root or `~/.cursor/mcp.json` globally

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "http://localhost:5678",
        "N8N_API_KEY": "<see credentials/n8n-api-key.txt>"
      }
    }
  }
}
```

#### Windsurf / Other IDEs
Check IDE documentation for MCP configuration location. Use same config structure as above.

### Available MCP Tools

| Tool | Purpose |
|------|---------|
| `search_nodes` | Search n8n nodes by name/function |
| `get_node_details` | Get node properties, operations, parameters |
| `list_workflows` | List all workflows in n8n instance |
| `get_workflow` | Get specific workflow details |
| `create_workflow` | Create new workflow via API |
| `update_workflow` | Update existing workflow |
| `list_executions` | List workflow execution history |
| `get_credentials` | List available credentials |

### When to Use MCP vs Local Scripts

| Task | Use MCP | Use Local Scripts |
|------|---------|-------------------|
| Query node documentation | ✅ | |
| Search for nodes | ✅ | |
| List/view workflows | ✅ | ✅ |
| Create simple workflows | ✅ | |
| Complex workflow operations | | ✅ `utilities/` |
| Batch operations | | ✅ `utilities/` |
| Custom API calls | | ✅ `n8n-api-client.js` |

### Verify MCP is Working

In Claude Desktop/Cursor, ask:
```
What parameters does the HTTP Request node have?
```

If MCP is working, you'll get detailed node documentation.

### Troubleshooting MCP

**"MCP server not responding"**
- Ensure Node.js is installed
- Run `npx n8n-mcp` manually to check for errors
- Restart your IDE

**"Cannot connect to n8n instance"**
- Verify n8n is running: `n8n start`
- Check API key is valid
- Ensure `N8N_API_URL` is correct

## External Services (Common Integrations)

These are services you might connect n8n to:

### APIs
- **Slack**: Webhook URL needed
- **Google Sheets**: OAuth credentials
- **GitHub**: Personal access token
- **OpenAI**: API key

### Databases
- **PostgreSQL**: Connection string
- **MySQL**: Connection string
- **MongoDB**: Connection URI

### Storage
- **AWS S3**: Access key + secret
- **Google Drive**: OAuth
- **Dropbox**: OAuth

## Setting Up New Credentials in n8n

1. Open n8n UI
2. Go to **Settings** → **Credentials**
3. Click **Add Credential**
4. Choose the service type
5. Follow the prompts (OAuth flow or enter API key)
6. Name it descriptively (e.g., `My Slack Webhook`)
7. Reference in workflows by this name

## Troubleshooting

### "API key invalid"
- Check `credentials/n8n-api-key.txt` has correct key
- Verify key exists in n8n: Settings → API → API Keys

### "Cannot connect to n8n"
- Ensure n8n is running: `n8n start`
- Check port 5678 is not blocked

### "ngrok tunnel not working"
- Verify ngrok is authenticated
- Check `start-ngrok.ps1` is pointing to correct port
