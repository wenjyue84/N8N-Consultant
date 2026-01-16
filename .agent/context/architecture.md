# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        N8N Consultant                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│   │   Claude AI   │────▶│  Utilities   │────▶│   n8n API    │   │
│   │  (Guidance)   │     │  (JS Client) │     │ (localhost)  │   │
│   └──────────────┘     └──────────────┘     └──────────────┘   │
│          │                                          │           │
│          ▼                                          ▼           │
│   ┌──────────────┐                          ┌──────────────┐   │
│   │  Templates   │                          │   Workflows  │   │
│   │   (JSON)     │◀─────────────────────────│  (Runtime)   │   │
│   └──────────────┘                          └──────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Claude AI Layer
- **Purpose**: Provides guidance, answers questions, generates workflow configurations
- **Integration**: Via MCP server (see `mcp-setup-guide.md`)
- **Context**: Reads `claude.md` and `.agent/` files for project knowledge

### 2. n8n Instance
- **Location**: `http://localhost:5678`
- **Version**: 2.3.5+
- **Database**: SQLite (default) at `$env:USERPROFILE\.n8n\database.sqlite`
- **Config**: `$env:USERPROFILE\.n8n\.env`

### 3. API Client Layer
- **Files**: `utilities/n8n-api-client.js`
- **Auth**: API key from `credentials/n8n-api-key.txt`
- **Capabilities**:
  - List/create/update/delete workflows
  - Execute workflows
  - Manage credentials
  - Monitor executions

### 4. Workflow Templates
- **Location**: `workflow-templates/`
- **Format**: n8n-compatible JSON
- **Each template has**:
  - `.json` - The importable workflow
  - `.md` - Documentation explaining usage

## Data Flow

### Creating a Workflow
```
1. User describes automation need
2. Claude suggests workflow structure
3. Claude generates workflow JSON (or helps configure via UI)
4. User imports into n8n
5. User tests and activates
```

### Programmatic Workflow Creation
```
1. Use `utilities/workflow-builder.js` to construct JSON
2. Use `utilities/n8n-api-client.js` to POST to n8n
3. Workflow appears in n8n dashboard
```

## External Access (Optional)

### ngrok Tunnel
- **Script**: `start-ngrok.ps1`
- **Purpose**: Expose local n8n to internet (for webhooks, demos)
- **Get URL**: `get-ngrok-url.ps1`

## Security Considerations

1. **API Keys**: Never commit to git, stored in `credentials/`
2. **Basic Auth**: Deprecated, use n8n's built-in user management
3. **Production**: Use HTTPS, proper auth, and production database
4. **Secrets in Workflows**: Use n8n credentials, not hardcoded values

## File Locations

| What                  | Where                              |
|-----------------------|-------------------------------------|
| n8n config            | `$env:USERPROFILE\.n8n\.env`       |
| n8n database          | `$env:USERPROFILE\.n8n\database.sqlite` |
| API key               | `credentials/n8n-api-key.txt`      |
| Workflow templates    | `workflow-templates/`              |
| Utility scripts       | `utilities/`                       |
