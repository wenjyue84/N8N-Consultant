# N8N Consultant Project

> AI-powered consultant for creating n8n workflows with guidance, templates, and automation utilities.

## Quick Context
- **Purpose**: Help users design, build, and manage n8n automation workflows
- **Tech Stack**: n8n (2.3.5+), Node.js, PowerShell (Windows)
- **Instance**: Local (`http://localhost:5678`)
- **Current Phase**: Development/Personal Use

---

## 📁 Project Structure

```
/
├── claude.md                    # You are here - main entry point
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
├── utilities/                   # JS scripts for n8n API
│   ├── n8n-api-client.js        # Full API client
│   ├── workflow-builder.js      # Workflow JSON builder
│   └── api-client-example.js    # Usage examples
└── workflow-templates/          # Reusable workflow JSON
    ├── scheduled-api-sync.json
    └── webhook-to-email.json
```

---

## 🔑 Key Information Sources

| When you need...          | Look here                          |
|---------------------------|-------------------------------------|
| System architecture       | `.agent/context/architecture.md`    |
| Coding conventions        | `.agent/context/conventions.md`     |
| n8n/API dependencies      | `.agent/context/dependencies.md`    |
| Start/stop n8n            | `.agent/workflows/start-n8n.md`     |
| Create workflows          | `.agent/workflows/create-workflow.md` |
| Fix common issues         | `.agent/workflows/troubleshoot.md`  |
| API key                   | `credentials/n8n-api-key.txt`       |

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
- **Next Steps**: 
  - Set up MCP server for n8n integration
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
