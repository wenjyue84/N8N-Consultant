# Using the N8N Workflow Builder Skill

This guide shows you how to use the `n8n-workflow-builder` Claude skill to create n8n automation workflows.

## What is the Workflow Builder Skill?

The n8n-workflow-builder is a Claude skill that helps you:
- Design workflows through conversation
- Generate proper n8n workflow JSON
- Configure nodes with correct parameters
- Set up credentials and connections
- Deploy workflows to your n8n instance

## Quick Start

### 1. Prerequisites

Make sure you have:
- n8n running at `http://localhost:5678`
- API key in `credentials/n8n-api-key.txt`
- Required credentials set up in n8n (Gmail, Notion, etc.)

### 2. Start a Conversation

Simply tell Claude what you want to automate:

```
"Create an n8n workflow that sends me a Telegram message every time someone submits a form"
```

Or invoke the skill directly:

```
/n8n-workflow-builder
```

### 3. Answer Questions

The skill will ask clarifying questions:
- What triggers the workflow?
- What data sources do you need?
- Where should the output go?
- What credentials are available?

### 4. Review the Plan

Claude will show you:
- List of nodes to be created
- How they connect
- What credentials are needed
- Data flow diagram

### 5. Generate & Deploy

Once you approve:
- Workflow JSON is generated
- Saved to `workflow-templates/`
- Documentation is created
- Optionally deployed to n8n

## Example Use Cases

### Example 1: Daily Email Summary

**Request**:
```
"I want a workflow that runs every morning at 8am, fetches my Notion tasks,
and emails me a summary"
```

**What the skill does**:
1. Asks for your Notion database ID
2. Asks for your email address
3. Creates workflow with:
   - Schedule Trigger (cron: `0 8 * * *`)
   - Notion node (get database pages)
   - Code node (format summary)
   - Gmail node (send email)
4. Generates proper connections
5. Saves JSON and documentation

### Example 2: Webhook Logger

**Request**:
```
"Build a webhook that logs incoming requests to Google Sheets and
sends a Telegram notification"
```

**What the skill does**:
1. Asks for webhook path name
2. Asks for Google Sheet ID and Telegram chat ID
3. Creates workflow with:
   - Webhook Trigger
   - Google Sheets node (append row)
   - Telegram node (send message)
4. Provides webhook URL format
5. Shows testing instructions

### Example 3: API Integration

**Request**:
```
"Make a workflow that fetches weather data from OpenWeather API
and posts it to Slack"
```

**What the skill does**:
1. Asks for API endpoint and key location
2. Asks for Slack channel
3. Creates workflow with:
   - Manual Trigger (for testing)
   - HTTP Request node (API call)
   - Code node (format message)
   - Slack node (post message)
4. Includes error handling
5. Shows test procedure

## Understanding Workflow Structure

### Basic Pattern

All workflows follow this pattern:

```
TRIGGER → PROCESS → ACTION
```

**Trigger**: What starts the workflow
- Manual (click button)
- Webhook (HTTP request)
- Schedule (time-based)
- Email (incoming mail)

**Process**: Transform data
- HTTP Request (fetch data)
- Code (custom logic)
- IF (conditional logic)

**Action**: Do something
- Send email
- Update database
- Send notification
- Log to sheet

### Advanced Patterns

**Branching**:
```
TRIGGER → FETCH DATA → IF
                       ├─ TRUE → ACTION A
                       └─ FALSE → ACTION B
```

**Parallel**:
```
TRIGGER → FETCH DATA ┬─ ACTION A
                     ├─ ACTION B
                     └─ ACTION C
```

**Chaining**:
```
TRIGGER → API 1 → API 2 → API 3 → FINAL ACTION
```

## Working with Credentials

### Available Credential Types

The skill knows about these credential types:
- Gmail OAuth2
- Google Sheets OAuth2
- Google Calendar OAuth2
- Notion API
- Telegram Bot API
- WhatsApp API (Meta Cloud)
- OpenAI API
- Anthropic API
- Slack OAuth2
- Generic OAuth2
- HTTP Authentication

### Setting Up Credentials

When the skill references a credential:

```json
{
  "credentials": {
    "gmailOAuth2": {
      "id": "GMAIL_CREDENTIAL_ID",
      "name": "Gmail account"
    }
  }
}
```

**You need to**:
1. Go to n8n → Settings → Credentials
2. Create the credential (follow n8n's setup)
3. Copy the credential ID
4. Replace `GMAIL_CREDENTIAL_ID` in the workflow
5. Or use the credential name if it matches

### Credential Placeholders

Test workflows use placeholders like:
- `YOUR_EMAIL@gmail.com`
- `YOUR_CHAT_ID`
- `YOUR_DATABASE_ID`
- `YOUR_API_KEY`

**Always replace these** before activating the workflow!

## Customizing Generated Workflows

### Editing Nodes

After generation, you can:
1. Open the JSON in a text editor
2. Modify node parameters
3. Adjust positioning
4. Add more nodes
5. Change connections

### Testing Workflows

Before deploying:
1. Import to n8n (via UI or API)
2. Use "Test workflow" button
3. Check each node's output
4. Verify credentials work
5. Test with real data

### Common Modifications

**Change schedule time**:
```json
"parameters": {
  "rule": {
    "interval": [{
      "field": "cronExpression",
      "expression": "0 8 * * *"  // Change this
    }]
  }
}
```

**Update webhook path**:
```json
"parameters": {
  "path": "my-webhook",  // Change this
  "httpMethod": "POST"
}
```

**Modify HTTP request**:
```json
"parameters": {
  "url": "https://api.example.com/data",  // Change this
  "method": "GET",
  "options": {...}
}
```

## Tips & Best Practices

### Be Specific

❌ Bad: "Create a workflow"
✅ Good: "Create a workflow that monitors my Gmail for invoices and saves them to Google Sheets"

### Mention Credentials

❌ Bad: "Send to Notion"
✅ Good: "Send to Notion using my existing Notion account credential"

### Include Context

❌ Bad: "Make it send notifications"
✅ Good: "Send Telegram notifications to chat ID 123456789 when urgent items are found"

### Test Incrementally

1. Start with a simple workflow
2. Test each node individually
3. Add complexity gradually
4. Use manual triggers for testing
5. Activate schedule/webhooks last

### Reference Examples

Always check test workflows first:
```
workflow-templates/test-workflows/
├── test-gmail.json          # Email examples
├── test-notion.json         # Notion examples
├── test-http-request.json   # API examples
└── test-telegram.json       # Messaging examples
```

## Troubleshooting

### "Skill not responding"

**Solution**: Make sure you invoke it correctly:
- Natural language: "create an n8n workflow..."
- Direct: `/n8n-workflow-builder`

### "Can't find credentials"

**Solution**:
1. Check n8n is running
2. Verify API key in `credentials/n8n-api-key.txt`
3. Create credentials in n8n first

### "Workflow validation error"

**Solution**:
1. Check all credential IDs are valid
2. Verify node parameters are complete
3. Test with a simple workflow first

### "Node execution failed"

**Solution**:
1. Check the node's configuration
2. Verify API endpoints are correct
3. Test API calls separately
4. Check credential permissions

## Advanced Usage

### Programmatic Builder

You can also use the WorkflowBuilder class directly:

```javascript
const { WorkflowBuilder } = require('./utilities/workflow-builder');

const builder = new WorkflowBuilder('My Workflow', 'Description');

builder
  .addManualTrigger()
  .addHttpRequest('https://api.example.com')
  .addCode('return $input.all();')
  .connect('manual-trigger', 'http-request-1')
  .connect('http-request-1', 'code-1')
  .save('my-workflow.json');
```

### Using MCP Tools

The skill can leverage n8n-mcp tools for:
- Node documentation lookup
- Parameter validation
- Workflow management
- Execution monitoring

Just ask: "What parameters does the Gmail node support?"

## Next Steps

1. Try the examples in `utilities/workflow-builder-example.js`
2. Study test workflows in `workflow-templates/test-workflows/`
3. Create a simple workflow with the skill
4. Gradually build more complex automations
5. Share your workflows in the templates directory

## Getting Help

- Check the skill documentation: `.claudesdk/skills/n8n-workflow-builder.md`
- Review test workflows: `workflow-templates/test-workflows/README.md`
- Read n8n docs: https://docs.n8n.io
- Ask Claude: "How do I configure a [node type] node?"

---

**Happy automating!** The workflow builder skill is here to make n8n workflow creation easier and faster.
