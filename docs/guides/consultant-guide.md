# N8N Consultant Guide

This guide helps you understand how to work with the n8n consultant to create workflows.

## What the Consultant Can Do

The n8n consultant can help you with:

### 1. Workflow Design
- Analyze your automation requirements
- Suggest appropriate workflow structures
- Recommend nodes for specific tasks
- Design error handling and retry logic

### 2. Node Configuration
- Help configure node parameters
- Explain node-specific settings
- Provide credential setup guidance
- Optimize node configurations

### 3. Workflow Creation
- Generate workflow JSON files
- Create reusable templates
- Build complex multi-step workflows
- Connect different services and APIs

### 4. Best Practices
- Follow n8n best practices
- Optimize workflow performance
- Handle errors gracefully
- Implement proper data transformation

## Common Workflow Patterns

### Webhook to API
1. Webhook trigger receives data
2. Transform/validate data
3. Call external API
4. Process response
5. Return result

### Scheduled Automation
1. Schedule/Cron trigger
2. Fetch data from source
3. Process/transform data
4. Send to destination
5. Log results

### Data Synchronization
1. Trigger (webhook/schedule)
2. Fetch from source A
3. Transform data
4. Update destination B
5. Handle conflicts/errors

## Asking Questions

When asking the consultant for help, be specific:

✅ Good questions:
- "Create a workflow that sends a Slack message when a new GitHub issue is created"
- "Help me set up a workflow to sync customer data from HubSpot to Salesforce daily"
- "How do I handle API rate limits in my workflow?"

❌ Less helpful:
- "Make a workflow"
- "Help with n8n"
- "Fix my workflow"

## Workflow Import

Once the consultant generates a workflow JSON:

1. Copy the JSON content
2. Open your n8n instance
3. Click "Import from File" or "Import from URL"
4. Paste the JSON
5. Configure credentials and parameters
6. Test and activate

## Tips

- Always test workflows with sample data first
- Use the "Execute Workflow" feature to debug
- Save workflow versions before major changes
- Use descriptive node names
- Add notes/comments to complex workflows
- Monitor workflow executions for errors
