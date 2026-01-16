# Conventions

## Code Style

### JavaScript (Utilities)
- ES6+ syntax (async/await, arrow functions)
- CommonJS modules (`require`/`module.exports`)
- Error handling: Always try/catch async operations
- Logging: Use console.log with prefixes like `[API]`, `[Error]`

### PowerShell Scripts
- Suffix: `.ps1`
- Error handling: Use `$ErrorActionPreference` and try/catch
- Output: Use `Write-Host` for user-facing, `Write-Output` for pipeline

### Markdown Documentation
- Use headers for organization
- Code blocks with language tags
- Tables for structured data
- Collapsible sections for long content

## Naming Conventions

### Files
| Type               | Pattern                    | Example                     |
|--------------------|----------------------------|-----------------------------|
| Workflow template  | `verb-noun.json`           | `scheduled-api-sync.json`   |
| Workflow docs      | `verb-noun.md`             | `scheduled-api-sync.md`     |
| Utility scripts    | `kebab-case.js`            | `workflow-builder.js`       |
| PowerShell         | `verb-noun.ps1`            | `get-ngrok-url.ps1`         |
| Claude workflows   | `verb-noun.md`             | `start-n8n.md`              |

### n8n Workflows (inside n8n)
- **Name**: Descriptive, title case: `Sync Contacts From API`
- **Tags**: Category-based: `integration`, `scheduled`, `webhook`, `utility`
- **Description**: Always include, explain purpose and triggers

### Variables
- JavaScript: camelCase (`apiKey`, `workflowId`)
- PowerShell: PascalCase (`$ApiKey`, `$WorkflowId`)
- Environment: SCREAMING_SNAKE_CASE (`N8N_API_KEY`)

## Git Workflow

### Branches
- `main` - Stable, working code
- `feature/xxx` - New features
- `fix/xxx` - Bug fixes
- `docs/xxx` - Documentation updates

### Commits
Use conventional commits:
```
feat: add new workflow template for Slack notifications
fix: correct API client timeout handling
docs: update troubleshooting guide
chore: reorganize project structure
```

### What to Commit
✅ Do commit:
- Workflow templates (JSON)
- Documentation (MD)
- Utility scripts (JS)
- PowerShell scripts
- Configuration examples

❌ Never commit:
- `credentials/n8n-api-key.txt` (actual content)
- `.env` files with real secrets
- `node_modules/`
- Personal data

## n8n Workflow Standards

### Every Workflow Must Have
1. **Description**: What it does, when it runs
2. **Error handling**: At least a catch node for critical paths
3. **Logging**: Important events logged for debugging
4. **Documentation**: Companion `.md` file in `workflow-templates/`

### Node Naming
- Use clear, action-based names: `Fetch Users`, `Send Email`, `Parse Response`
- Avoid defaults like `HTTP Request`, `Code`

### Credentials
- Never hardcode API keys in workflow JSON
- Use n8n's credential system
- Reference by credential name, not embedded secrets

## Documentation Standards

### Every Workflow Template Needs
```markdown
# Workflow Name

## Purpose
[What this workflow does]

## Trigger
[How it starts - schedule, webhook, manual]

## Requirements
- [Required credentials]
- [External services needed]

## Configuration
[Steps to customize for your use case]

## Nodes Overview
| Node | Purpose |
|------|---------|
| ... | ... |
```

### Every Utility Script Needs
- JSDoc comments on exported functions
- Usage example at top of file
- Error handling documentation
