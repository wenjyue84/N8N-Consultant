# N8N Workflow Builder Skill

Create and manage n8n workflows using natural language. This skill helps you design, build, and deploy n8n automation workflows with proper credential integration and best practices.

## MCP Server Integration

When available, use these MCP tools from the `n8n-mcp` server for enhanced workflow building:

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `search_nodes` | Search n8n nodes by name/function | Find the right node for a task |
| `get_node_details` | Get node properties, operations, parameters | Get exact field names and options |
| `list_workflows` | List all workflows in n8n instance | Check existing workflows before creating duplicates |
| `get_workflow` | Get specific workflow details | Reference existing patterns |
| `create_workflow` | Create new workflow via API | Deploy directly without manual import |
| `update_workflow` | Update existing workflow | Modify workflows programmatically |
| `list_executions` | List workflow execution history | Debug and monitor |
| `get_credentials` | List available credentials | Get credential IDs to embed in workflow JSON |

> **Note**: If MCP tools are not responding, fall back to local utilities in `utilities/` directory.

## Context References

Before building workflows, consult these project context files:

- **[architecture.md](file:///.agent/context/architecture.md)** - System overview, component diagram, data flow patterns
- **[conventions.md](file:///.agent/context/conventions.md)** - Naming standards, node naming, documentation requirements
- **[dependencies.md](file:///.agent/context/dependencies.md)** - Available credentials, API endpoints, MCP configuration
- **[jay-n8n-master-plan.md](file:///docs/plans/jay-n8n-master-plan.md)** - Implementation roadmap, GTD workflows, business automation priorities

## When to Use This Skill

Use this skill when the user wants to:
- Create a new n8n workflow from scratch
- Build workflows with specific triggers (webhook, schedule, manual, email, etc.)
- Connect multiple nodes together (HTTP requests, databases, APIs, notifications)
- Integrate services (Gmail, Notion, Telegram, Google Sheets, Calendar, WhatsApp, OpenAI, Anthropic)
- Deploy workflows to their local n8n instance
- Get examples of workflow patterns

## Skill Capabilities

### 1. Workflow Design
- Interactive workflow planning with user input
- Node selection and configuration guidance
- Credential setup instructions
- Data flow mapping

### 2. Node Configuration
- Proper parameter setup for all major nodes
- Credential references (using existing n8n credentials)
- Expression syntax for dynamic data
- Error handling and conditional logic

### 3. Workflow Generation
- JSON workflow generation
- Proper node positioning
- Connection mapping
- Settings configuration

### 4. Deployment
- Import workflows via n8n API
- Credential verification
- Activation and testing
- Webhook URL generation

## Available Node Types

### Triggers
- **Manual Trigger**: Execute on demand
- **Webhook**: HTTP endpoint triggers
- **Schedule**: Cron-based automation
- **Email Trigger**: Respond to emails

### Actions
- **HTTP Request**: Call external APIs (GET, POST, PUT, DELETE)
- **Code**: JavaScript/Python for custom logic
- **IF**: Conditional branching
- **Switch**: Multiple condition routing
- **Merge**: Combine data from multiple sources

### Integrations
- **Gmail**: Send/receive emails
- **Google Calendar**: Manage events
- **Google Sheets**: Read/write spreadsheet data
- **Notion**: Database operations
- **Telegram**: Send messages
- **WhatsApp**: Send template messages
- **OpenAI**: GPT models (GPT-4, GPT-4o)
- **Anthropic**: Claude models (Sonnet, Opus, Haiku)
- **Slack**: Messaging and notifications

## Credential Management

This skill uses existing n8n credentials. Available credential types:

```
- Gmail OAuth2
- Google Sheets OAuth2
- Google Calendar OAuth2
- Notion API
- Telegram Bot
- WhatsApp API (Meta Cloud API)
- OpenAI API
- Anthropic API
- HTTP Basic Auth
- HTTP Header Auth
- OAuth2 (Generic)
```

### Credential References in Workflows

Credentials are referenced by ID in the workflow JSON:

```json
{
  "credentials": {
    "notionApi": {
      "id": "YdwHAoBhEJv30Fft",
      "name": "Notion account"
    }
  }
}
```

**Important**: Always instruct users to update credential IDs or use credential names that match their n8n setup.

## Workflow Structure

All workflows follow this JSON structure:

```json
{
  "name": "Workflow Name",
  "description": "What this workflow does",
  "active": false,
  "nodes": [...],
  "connections": {...},
  "settings": {
    "executionOrder": "v1",
    "callerPolicy": "workflowsFromSameOwner"
  }
}
```

## Usage Examples

### Example 1: Simple HTTP to Telegram
```
User: "Create a workflow that fetches weather data from an API and sends it to Telegram"

Skill Actions:
1. Ask for API endpoint and Telegram chat ID
2. Create workflow with:
   - Manual Trigger node
   - HTTP Request node (weather API)
   - Code node (format message)
   - Telegram node (send message)
3. Generate JSON with proper connections
4. Provide deployment instructions
```

### Example 2: Scheduled Notion Sync
```
User: "Build a daily workflow that reads my Notion tasks and sends a summary to Gmail"

Skill Actions:
1. Ask for Notion database ID and email address
2. Create workflow with:
   - Schedule Trigger (daily at 8am)
   - Notion node (read database)
   - Code node (format summary)
   - Gmail node (send email)
3. Generate JSON with cron expression
4. Save to workflow-templates/
```

### Example 3: Webhook to Multi-Service
```
User: "Make a webhook that logs to Google Sheets and sends a Telegram notification"

Skill Actions:
1. Ask for sheet ID and chat ID
2. Create workflow with:
   - Webhook Trigger
   - Google Sheets node (append row)
   - Telegram node (send message)
3. Generate webhook URL format
4. Provide testing instructions
```

## Best Practices

### Node Positioning
- Start triggers at x=180, y=100 (manual) or y=300 (webhook)
- Space nodes horizontally by 220-260 pixels
- Align nodes at y=300 for main flow
- Offset branching paths by ±100-200 pixels vertically

### Naming Conventions
- Use descriptive node names: "Fetch Weather Data" not "HTTP Request"
- Prefix test workflows with "TEST: "
- Use clear workflow names: "Daily Notion Task Summary to Gmail"

### Connection Patterns
- Linear: A → B → C (simple processing)
- Branching: A → B → [C, D] (parallel actions)
- Conditional: A → IF → [success path, failure path]
- Merging: [A, B] → Merge → C

### Error Handling
- Always add error handling for API calls
- Use IF nodes to check for required data
- Provide fallback actions
- Log errors to monitoring services

## File Operations

### Save Workflow Template
Workflows are saved to:
```
workflow-templates/
├── [workflow-name].json        # Full workflow JSON
└── [workflow-name].md          # Documentation
```

### Import to n8n
Use the n8n API client:
```javascript
const client = new N8NApiClient();
const workflow = JSON.parse(fs.readFileSync('workflow.json'));
await client.createWorkflow(workflow);
```

## Reference Workflows

Test workflows are available in `workflow-templates/test-workflows/`:
- `test-http-request.json` - HTTP GET/POST examples
- `test-notion.json` - Notion database read
- `test-gmail.json` - Email sending
- `test-telegram.json` - Telegram messaging
- `test-google-sheets.json` - Spreadsheet operations
- `test-google-calendar.json` - Calendar events
- `test-openai.json` - OpenAI integration
- `test-anthropic.json` - Anthropic Claude integration
- `test-whatsapp.json` - WhatsApp messaging

Always reference these when building similar workflows.

## Pre-Build Checklist

Before generating any workflow, complete these steps:

### 1. Check Existing Workflows
```
Use MCP: list_workflows
Or: Check workflow-templates/ directory
```
- Avoid duplicating existing work
- Reference similar patterns for consistency

### 2. Get Credential IDs
```
Use MCP: get_credentials
Or: Check credentials/README.md
```
- Get exact credential IDs to embed in workflow JSON
- Verify credentials exist before referencing them

### 3. Search for Node Details
```
Use MCP: get_node_details "<node_type>"
```
- Get exact parameter names and options
- Understand node capabilities before configuring

### 4. Check Templates
```
Review: workflow-templates/test-workflows/
```
- Use existing patterns as starting points
- Maintain consistency with established conventions

---

## Interaction Flow

When a user requests a workflow:

1. **Gather Requirements**
   - What triggers the workflow? (manual, webhook, schedule, etc.)
   - What data sources? (APIs, databases, services)
   - What actions to take? (send email, update sheet, notify)
   - What credentials are available?

2. **Pre-Build Checks** *(NEW)*
   - Run `list_workflows` to check for duplicates
   - Run `get_credentials` to get credential IDs
   - Check `workflow-templates/` for similar patterns

3. **Design Workflow**
   - Propose node sequence
   - Explain data flow
   - Show user the plan
   - Get approval

4. **Build JSON**
   - Generate nodes with proper parameters
   - Create connections
   - Add **actual** credential IDs (not placeholders)
   - Set proper positioning

5. **Document & Save**
   - Write workflow documentation
   - Save JSON to workflow-templates/
   - Provide setup instructions
   - List required credentials

6. **Deploy (Optional)**
   - Import via API or MCP `create_workflow`
   - Verify credentials
   - Activate workflow
   - Test execution

## Important Notes

### API Key Security
- Never expose the API key in workflows
- Load from `credentials/n8n-api-key.txt`
- Use environment variables in production

### Credential IDs
- Test workflows use placeholder credential IDs
- Users must update with their own credential IDs
- Provide clear instructions for credential setup

### Testing
- Always include a manual trigger for testing
- Add a final node to format results
- Include success/failure messages
- Log execution details

### Version Compatibility
- Use node type versions that match user's n8n instance
- Common versions: webhook (1), httpRequest (4.2), code (2)
- Check n8n version: typically 2.3.5+

## Error Messages

### Common Issues & Solutions

**"Credential not found"**
→ Update credential ID in node configuration
→ Verify credential exists in n8n Settings → Credentials

**"Node execution failed"**
→ Check node parameters are correct
→ Verify API endpoints are accessible
→ Test with manual trigger first

**"Invalid workflow JSON"**
→ Validate JSON syntax
→ Check all nodes have required fields
→ Verify connections reference valid node IDs

**"Webhook not found"**
→ Activate the workflow first
→ Use production webhook URL (not test URL)
→ Check webhook path is unique

## Additional Resources

- n8n API Docs: https://docs.n8n.io/api/
- Node Reference: https://docs.n8n.io/integrations/builtin/
- Expression Syntax: Use `={{ }}` for dynamic values
- Test Workflows: See `workflow-templates/test-workflows/README.md`

---

**Remember**: Always ask clarifying questions before building. A well-planned workflow saves time and prevents errors!
