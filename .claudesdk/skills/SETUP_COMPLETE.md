# N8N Workflow Builder Skill - Setup Complete

## What Was Created

### 1. Claude Skill Files

**Location**: `.claudesdk/skills/`

- `n8n-workflow-builder.md` - Complete skill instructions and documentation
- `n8n-workflow-builder.json` - Skill configuration and metadata
- `README.md` - Skills directory overview

### 2. Utility Scripts

**Location**: `utilities/`

- `workflow-builder.js` - WorkflowBuilder class with fluent API
- `workflow-builder-example.js` - Example usage patterns

### 3. Documentation

**Location**: `docs/guides/`

- `using-workflow-builder-skill.md` - Comprehensive user guide

## How to Use the Skill

### Quick Start

Simply say:
```
"Create an n8n workflow that..."
```

Or invoke directly:
```
/n8n-workflow-builder
```

### Example Requests

**Simple**:
```
"Build a workflow that fetches weather data and sends it to Telegram"
```

**Scheduled**:
```
"Create a daily automation that reads my Notion tasks and emails a summary"
```

**Webhook**:
```
"Make a webhook that logs to Google Sheets and notifies Telegram"
```

## Skill Capabilities

### Workflow Design
- Interactive planning with user questions
- Node selection and configuration
- Credential setup guidance
- Data flow mapping

### Node Types Supported

**Triggers**:
- Manual Trigger
- Webhook
- Schedule (cron)

**Actions**:
- HTTP Request (GET, POST, PUT, DELETE)
- Code (JavaScript)
- Gmail
- Google Sheets
- Google Calendar
- Notion
- Telegram
- OpenAI
- Anthropic
- WhatsApp

**Logic**:
- IF conditions
- Code transformations
- Data formatting

### Workflow Generation
- Proper JSON structure
- Correct node positioning
- Connection mapping
- Credential references
- Settings configuration

### Deployment
- Save to `workflow-templates/`
- Generate documentation
- Import via n8n API (optional)
- Activation instructions

## File Structure

```
/
├── .claudesdk/
│   └── skills/
│       ├── n8n-workflow-builder.md      ← Skill instructions
│       ├── n8n-workflow-builder.json    ← Skill config
│       ├── README.md                    ← Skills overview
│       └── SETUP_COMPLETE.md            ← This file
├── utilities/
│   ├── workflow-builder.js              ← Builder class
│   ├── workflow-builder-example.js      ← Examples
│   └── n8n-api-client.js                ← API client
├── credentials/
│   └── n8n-api-key.txt                  ← Your API key
├── workflow-templates/
│   └── test-workflows/                  ← Reference workflows
└── docs/
    └── guides/
        └── using-workflow-builder-skill.md  ← User guide
```

## Reference Workflows

Test workflows are available in `workflow-templates/test-workflows/`:

- `test-http-request.json` - HTTP GET/POST examples
- `test-notion.json` - Notion database operations
- `test-gmail.json` - Email sending
- `test-telegram.json` - Telegram messaging
- `test-google-sheets.json` - Spreadsheet operations
- `test-google-calendar.json` - Calendar events
- `test-openai.json` - OpenAI integration
- `test-anthropic.json` - Anthropic Claude integration

**Use these as references** when building similar workflows!

## Programmatic Usage

You can also use the WorkflowBuilder class directly:

```javascript
const { WorkflowBuilder } = require('./utilities/workflow-builder');

const workflow = new WorkflowBuilder('My Workflow', 'Description')
  .addManualTrigger()
  .addHttpRequest('https://api.example.com/data')
  .addCode('return $input.all();')
  .connect('manual-trigger', 'http-request-1')
  .connect('http-request-1', 'code-1')
  .save('my-workflow.json');

console.log(workflow.generateDocs());
```

## Testing the Skill

### 1. Run Examples

```bash
cd utilities
node workflow-builder-example.js
```

This creates three example workflows in `workflow-templates/`:
- `weather-to-telegram.json`
- `daily-task-reminder.json`
- `smart-webhook-handler.json`

### 2. Test with Claude

```
"Create a simple workflow that makes an HTTP GET request to
https://api.github.com/users/octocat and logs the result"
```

Claude should:
1. Ask clarifying questions
2. Propose a workflow design
3. Generate the JSON
4. Save to workflow-templates/
5. Provide setup instructions

### 3. Import to n8n

Option A - Via UI:
1. Open n8n at http://localhost:5678
2. Click "..." → "Import from File"
3. Select the generated JSON

Option B - Via API:
```javascript
const client = require('./utilities/n8n-api-client');
const workflow = require('./workflow-templates/my-workflow.json');
await client.createWorkflow(workflow);
```

## Credentials Setup

Make sure these are configured in n8n:

**OAuth2 Services**:
- Gmail (for email sending)
- Google Sheets (for spreadsheet operations)
- Google Calendar (for calendar events)

**API Keys**:
- Notion (integration token)
- Telegram (bot token)
- OpenAI (API key)
- Anthropic (API key)
- WhatsApp (Meta Cloud API)

**How to get credential IDs**:
1. Go to n8n → Settings → Credentials
2. Click on a credential
3. Copy the ID from the URL or credential details
4. Use in workflow JSON

Or use credential names (e.g., "Gmail account") if they match exactly.

## Common Patterns

### Pattern 1: API to Notification
```
Manual Trigger → HTTP Request → Code → Telegram
```

### Pattern 2: Scheduled Sync
```
Schedule Trigger → Notion → Code → Gmail
```

### Pattern 3: Webhook Handler
```
Webhook → Code → Google Sheets + Telegram
```

### Pattern 4: Multi-Step Processing
```
Manual → HTTP 1 → HTTP 2 → Code → Final Action
```

## Troubleshooting

### Skill doesn't respond
- Check you're invoking correctly
- Use natural language or `/n8n-workflow-builder`
- Restart Claude if needed

### Can't save workflow
- Ensure `workflow-templates/` directory exists
- Check file permissions
- Try saving manually to a different location

### Credential errors
- Verify credentials exist in n8n
- Check credential IDs match
- Test credentials in n8n first

### Node configuration errors
- Reference test workflows
- Check n8n version compatibility
- Verify node parameters are complete

## Next Steps

1. **Read the guide**: `docs/guides/using-workflow-builder-skill.md`
2. **Run examples**: `node utilities/workflow-builder-example.js`
3. **Study templates**: Check `workflow-templates/test-workflows/`
4. **Build your first workflow**: Ask Claude to create something simple
5. **Iterate**: Start simple, add complexity gradually

## MCP Integration

The skill can leverage the n8n-mcp server for:
- Node documentation lookup
- Parameter validation
- Workflow management
- Real-time testing

Just ask Claude: "What parameters does the HTTP Request node accept?"

## Support Resources

- **Skill docs**: `.claudesdk/skills/n8n-workflow-builder.md`
- **User guide**: `docs/guides/using-workflow-builder-skill.md`
- **Test workflows**: `workflow-templates/test-workflows/README.md`
- **n8n API docs**: https://docs.n8n.io/api/
- **n8n node docs**: https://docs.n8n.io/integrations/builtin/

## Feature Highlights

✅ Natural language workflow creation
✅ Interactive design with clarifying questions
✅ Proper JSON generation with validation
✅ Credential management guidance
✅ Auto-documentation generation
✅ Reference to test workflows
✅ Programmatic builder API
✅ MCP server integration ready
✅ Deployment support
✅ Comprehensive examples

---

## Ready to Build!

You're all set to create n8n workflows with Claude. Start simple, reference the test workflows, and gradually build more complex automations.

**Try it now**:
```
"Hey Claude, create an n8n workflow that sends me a daily email summary of my calendar events"
```

Happy automating! 🚀
