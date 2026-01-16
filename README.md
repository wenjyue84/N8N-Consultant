# N8N Consultant

> AI-powered consultant for creating n8n workflows with guidance, templates, and utilities.

**📖 For Claude/AI context, start with [`claude.md`](claude.md)**

## Project Structure

```
N8N Consultant/
├── claude.md                    # 🤖 AI entry point - read this first
├── .agent/
│   ├── context/                 # Deep knowledge
│   │   ├── architecture.md      # System design
│   │   ├── conventions.md       # Coding standards
│   │   └── dependencies.md      # External services
│   └── workflows/               # Automation scripts
│       ├── start-n8n.md         # /start-n8n
│       ├── create-workflow.md   # /create-workflow
│       └── troubleshoot.md      # /troubleshoot
├── credentials/                 # API keys (gitignored)
├── docs/
│   ├── setup/                   # First-time setup
│   └── guides/                  # How-to guides
├── utilities/                   # JS API client scripts
└── workflow-templates/          # Reusable workflow JSON
    ├── test-workflows/          # 🧪 Node test workflows (start here!)
    └── ...                      # Production workflow templates
```

## Quick Start

```powershell
# Start n8n
n8n start

# Open in browser
# http://localhost:5678
```

## Features

- **Node Testing**: Test workflows for major nodes (Google Calendar, Notion, Telegram, etc.)
- **Workflow Guidance**: Design and build automation workflows
- **Templates**: Pre-built workflows for common use cases
- **API Client**: Programmatic n8n control via `utilities/`
- **Best Practices**: Patterns and conventions

## 🧪 Testing Node Integrations

Before building complex workflows, test your node integrations:

```powershell
# Import all test workflows at once
node utilities/test-all-nodes.js

# Or import individually
node utilities/import-workflow.js workflow-templates/test-workflows/test-telegram.json
```

See [`workflow-templates/test-workflows/README.md`](workflow-templates/test-workflows/README.md) for detailed setup instructions.

## Prerequisites

- n8n installed (`npm install -g n8n`)
- Node.js 18+
- API key configured (see `credentials/`)

## For AI Assistants

Start with `claude.md` - it contains:
- Project overview and structure
- Links to context files
- Critical rules and conventions
- Active project status