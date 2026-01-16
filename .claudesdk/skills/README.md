# Claude Skills for N8N Consultant

This directory contains all Claude skills for working with n8n workflows. These skills were moved from the global Claude skills directory to be project-specific.

## Available Skills

### 1. n8n-workflow-builder ⭐ NEW

**Description**: Create and manage n8n automation workflows using natural language.

**Location**: `.claudesdk/skills/` (files: `n8n-workflow-builder.md`, `n8n-workflow-builder.json`)

**Usage**: Natural language or `/n8n-workflow-builder`

**Triggers**:
- "create an n8n workflow"
- "build a workflow"
- "make an automation"
- "automate with n8n"

**Capabilities**:
- Interactive workflow design with Q&A
- Complete JSON workflow generation
- Node configuration (HTTP, Code, Gmail, Notion, Telegram, etc.)
- Credential setup guidance
- Deployment to local n8n instance
- Auto-documentation generation

**Example Requests**:
```
"Create a workflow that fetches weather data and sends it to Telegram"
"Build a daily automation that reads Notion tasks and emails a summary"
"Make a webhook that logs to Google Sheets"
```

---

### 2. n8n-code-javascript

**Description**: Write JavaScript code in n8n Code nodes.

**Location**: `.claudesdk/skills/n8n-code-javascript/`

**When to use**:
- Writing JavaScript in n8n Code nodes
- Using `$input`, `$json`, `$node` syntax
- Making HTTP requests with `$helpers`
- Working with dates using DateTime
- Troubleshooting Code node errors
- Choosing between Code node modes

**Key Features**:
- Built-in functions reference
- Common patterns library
- Data access patterns
- Error handling examples

---

### 3. n8n-code-python

**Description**: Write Python code in n8n Code nodes.

**Location**: `.claudesdk/skills/n8n-code-python/`

**When to use**:
- Writing Python in n8n Code nodes
- Using `_input`, `_json`, `_node` syntax
- Working with Python standard library
- Understanding Python limitations in n8n

**Key Features**:
- Common patterns
- Data access methods
- Error patterns
- Python-specific limitations

---

### 4. n8n-expression-syntax

**Description**: Validate n8n expression syntax and fix common errors.

**Location**: `.claudesdk/skills/n8n-expression-syntax/`

**When to use**:
- Writing n8n expressions with `{{ }}` syntax
- Accessing `$json`, `$node` variables
- Troubleshooting expression errors
- Working with webhook data in workflows

**Key Features**:
- Common mistakes catalog
- Expression examples
- Syntax validation
- Error fixing patterns

---

### 5. n8n-mcp-tools-expert

**Description**: Expert guide for using n8n-mcp MCP tools effectively.

**Location**: `.claudesdk/skills/n8n-mcp-tools-expert/`

**When to use**:
- Searching for nodes
- Validating configurations
- Accessing templates
- Managing workflows via MCP
- Using any n8n-mcp tool

**Key Features**:
- Tool selection guidance
- Parameter formats
- Common patterns
- Search optimization
- Workflow management

---

### 6. n8n-node-configuration

**Description**: Operation-aware node configuration guidance.

**Location**: `.claudesdk/skills/n8n-node-configuration/`

**When to use**:
- Configuring nodes
- Understanding property dependencies
- Determining required fields
- Choosing between `get_node` detail levels
- Learning common configuration patterns by node type

**Key Features**:
- Operation patterns
- Node dependencies
- Configuration examples
- Best practices

---

### 7. n8n-validation-expert

**Description**: Interpret validation errors and guide fixing them.

**Location**: `.claudesdk/skills/n8n-validation-expert/`

**When to use**:
- Encountering validation errors
- Understanding validation warnings
- Handling false positives
- Fixing operator structure issues
- Understanding validation results

**Key Features**:
- Error catalog
- False positive identification
- Validation profiles
- Error type explanations
- Validation loop process

---

### 8. n8n-workflow-patterns

**Description**: Proven workflow architectural patterns from real n8n workflows.

**Location**: `.claudesdk/skills/n8n-workflow-patterns/`

**When to use**:
- Building new workflows
- Designing workflow structure
- Choosing workflow patterns
- Planning workflow architecture
- Implementing webhook processing, HTTP API integration, database operations, AI agent workflows, or scheduled tasks

**Key Features**:
- AI agent workflow patterns
- Database operation patterns
- HTTP API integration patterns
- Scheduled task patterns
- Webhook processing patterns

## How to Use Skills

### From Claude Desktop/CLI

Simply mention what you want to do naturally:
```
Hey Claude, I want to create an n8n workflow that...
```

Or invoke the skill directly:
```
/n8n-workflow-builder
```

### Skill Structure

Each skill consists of:
- `[skill-name].md` - Instructions and documentation
- `[skill-name].json` - Skill configuration and metadata

## Adding New Skills

To add a new skill:

1. Create `[skill-name].md` with instructions
2. Create `[skill-name].json` with configuration
3. Add any supporting utilities to `/utilities`
4. Update this README

## Skill Configuration

Skills are configured in `.claude.json` at the project root. The skill directory is automatically scanned for available skills.

## Dependencies

Skills may depend on:
- **Credentials**: Stored in `/credentials` (gitignored)
- **API Clients**: Located in `/utilities`
- **Templates**: Reference workflows in `/workflow-templates`
- **MCP Tools**: n8n-mcp server for node documentation

## Troubleshooting

### Skill not loading
- Check skill files are in `.claudesdk/skills/`
- Verify JSON configuration is valid
- Ensure `.claude.json` references skills directory

### Workflow creation fails
- Verify n8n is running: `http://localhost:5678`
- Check API key in `credentials/n8n-api-key.txt`
- Ensure credentials exist in n8n

### Node configuration errors
- Reference test workflows in `workflow-templates/test-workflows/`
- Check n8n version compatibility
- Verify credential IDs match your n8n instance

## Support

For issues or feature requests:
- Check workflow templates: `/workflow-templates`
- Review n8n documentation: https://docs.n8n.io
- See project README: `/README.md`
