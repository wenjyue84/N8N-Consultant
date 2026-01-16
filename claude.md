# N8N Consultant Project

> AI-powered consultant for creating n8n workflows with guidance, templates, and automation utilities.

## Quick Context
- **Purpose**: Help users design, build, and manage n8n automation workflows
- **Tech Stack**: n8n (2.3.5+), Node.js, PowerShell (Windows)
- **Instance**: Local (`http://localhost:5678`)
- **Current Phase**: Development/Personal Use
- **Repository**: [github.com/wenjyue84/N8N-Consultant](https://github.com/wenjyue84/N8N-Consultant)

---

## 🤖 MCP Server - USE THIS FOR N8N TASKS

**IMPORTANT**: An n8n MCP (Model Context Protocol) server is installed and configured.

### When to Use the n8n-mcp Server

Use the MCP server tools when the user asks about:
- **Node configuration**: "How do I configure the HTTP Request node?"
- **Node documentation**: "What parameters does the Gmail node have?"
- **Workflow building**: "Help me create a workflow that..."
- **Workflow management**: "List my workflows", "Show recent executions"
- **n8n operations**: Any question about n8n node properties, operations, or settings

### MCP Server Details

| Setting | Value |
|---------|-------|
| Server Name | `n8n-mcp` |
| Package | `npx n8n-mcp` |
| n8n Instance | `http://localhost:5678` |
| GitHub | [czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp) |

### Available MCP Tools

The n8n-mcp server provides these tools:
- `search_nodes` - Search for n8n nodes by name or function
- `get_node_details` - Get detailed info about a specific node
- `list_workflows` - List all workflows in the n8n instance
- `get_workflow` - Get details of a specific workflow
- `create_workflow` - Create a new workflow
- `list_executions` - List workflow executions
- `get_credentials` - List available credentials

### Configuration Location

- **Claude Desktop/Code**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Cursor**: `.cursor/mcp.json` or project `.cursorrules`
- **Windsurf/Other IDEs**: Check IDE-specific MCP configuration

---

## 🎓 Claude Skills - USE THESE FOR N8N TASKS

**IMPORTANT**: 8 specialized Claude skills are available for n8n development.

### Quick Skill Reference

| When you need to...           | Use this skill                  |
|-------------------------------|---------------------------------|
| Create complete workflows     | `n8n-workflow-builder` ⭐ NEW    |
| Write JavaScript in Code nodes | `n8n-code-javascript`           |
| Write Python in Code nodes    | `n8n-code-python`               |
| Fix expression syntax         | `n8n-expression-syntax`         |
| Configure nodes               | `n8n-node-configuration`        |
| Fix validation errors         | `n8n-validation-expert`         |
| Find node documentation       | `n8n-mcp-tools-expert`          |
| Learn workflow patterns       | `n8n-workflow-patterns`         |

### How to Use Skills

**Natural Language** (Recommended):
```
"Create a workflow that sends daily Notion summaries to Gmail"
"Help me write JavaScript to filter high-priority items"
"Show me patterns for webhook processing"
```

Claude will automatically select the appropriate skill.

**Direct Invocation**:
```
/n8n-workflow-builder
```

**Full Documentation**: `.claudesdk/skills/README.md`

---

## 📁 Project Structure

```
/
├── claude.md                    # You are here - main entry point
├── .claudesdk/
│   └── skills/                  # 8 n8n Claude skills ⭐ NEW
│       ├── n8n-workflow-builder/   # Create workflows
│       ├── n8n-code-javascript/    # JS in Code nodes
│       ├── n8n-code-python/        # Python in Code nodes
│       ├── n8n-expression-syntax/  # Expression syntax
│       ├── n8n-node-configuration/ # Node config
│       ├── n8n-validation-expert/  # Fix errors
│       ├── n8n-mcp-tools-expert/   # MCP tools
│       ├── n8n-workflow-patterns/  # Proven patterns
│       └── README.md               # Skills overview
├── .agent/
│   ├── context/
│   │   ├── architecture.md      # System design, n8n integration
│   │   ├── conventions.md       # Coding standards, workflow patterns
│   │   └── dependencies.md      # External services, API setup
│   └── workflows/               # Claude automation workflows
│       ├── start-n8n.md         # How to start n8n
│       ├── create-workflow.md   # How to create workflows
│       └── troubleshoot.md      # Common fixes
├── credentials/                 # API keys (NEVER commit actual keys)
│   ├── n8n-api-key.txt          # n8n API key storage
│   └── README.md
├── docs/
│   ├── setup/                   # One-time setup guides
│   └── guides/                  # How-to guides
│       └── using-workflow-builder-skill.md  # Workflow builder guide ⭐
├── utilities/                   # JS scripts for n8n API
│   ├── n8n-api-client.js        # Full API client
│   ├── workflow-builder.js      # Workflow JSON builder ⭐ NEW
│   ├── workflow-builder-example.js  # Usage examples ⭐ NEW
│   └── api-client-example.js    # Usage examples
└── workflow-templates/          # Reusable workflow JSON
    ├── test-workflows/          # Reference test workflows
    ├── scheduled-api-sync.json
    └── webhook-to-email.json
```

---

## 🔑 Key Information Sources

| When you need...          | Look here                          |
|---------------------------|-------------------------------------|
| **Claude skills overview** | **`.claudesdk/skills/README.md`** ⭐ |
| **Create workflows**      | **Use `n8n-workflow-builder` skill** ⭐ |
| System architecture       | `.agent/context/architecture.md`    |
| Coding conventions        | `.agent/context/conventions.md`     |
| n8n/API dependencies      | `.agent/context/dependencies.md`    |
| Start/stop n8n            | `.agent/workflows/start-n8n.md`     |
| Create workflows (manual) | `.agent/workflows/create-workflow.md` |
| Fix common issues         | `.agent/workflows/troubleshoot.md`  |
| API key                   | `credentials/n8n-api-key.txt`       |
| Workflow builder guide    | `docs/guides/using-workflow-builder-skill.md` ⭐ |

---

## ⚡ Critical Rules

1. **Check `.agent/workflows/` first** before implementing common operations
2. **Never expose credentials** - API keys stay in `credentials/`, gitignored
3. **n8n instance**: Always at `http://localhost:5678` unless ngrok is active
4. **Workflow exports**: Store as JSON in `workflow-templates/`
5. **PowerShell for Windows** - all scripts use `.ps1` extension

---

## 🚀 Quick Commands

```powershell
# Start n8n
n8n start

# Start with ngrok (public access)
.\start-ngrok.ps1

# Get current ngrok URL
.\get-ngrok-url.ps1

# Reset user management (login issues)
n8n user-management:reset
```

---

## 📋 Active Context

- **Current Focus**: Project organization and Claude integration
- **Blockers**: None
- **MCP Server**: ✅ Installed and configured (n8n-mcp)
- **Next Steps**:
  - Create more workflow templates
  - Document common automation patterns

---

## 🔗 Related Files (Legacy - Being Reorganized)

These files contain useful info but are being consolidated:
- `QUICK_START.md` → Moving to `.agent/workflows/start-n8n.md`
- `fix.md` → Moving to `.agent/workflows/troubleshoot.md`
- `consultant-guide.md` → Moving to `.agent/context/architecture.md`
- `n8n-*.md` guides → Moving to `docs/guides/`

---

**Last Updated**: 2026-01-16
