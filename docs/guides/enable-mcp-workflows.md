# Enable Workflows for Instance-level MCP

This guide helps you enable workflows for MCP exposure and add descriptions.

## Quick Steps

### Option 1: Using the Script (Recommended)

1. **Start n8n** (if not running):
   ```powershell
   n8n start
   ```

2. **Run the script**:
   ```powershell
   pwsh utilities/enable-mcp-workflows.ps1
   ```

3. **Enable in UI**:
   - Go to **Settings → Instance-level MCP**
   - Click **"Enable workflows"** button
   - Select the workflows you want to expose

### Option 2: Manual UI Steps

1. **Add Descriptions** (for each workflow):
   - Go to each workflow in n8n
   - Click the workflow settings (gear icon)
   - Add a description in the "Description" field
   - Save

2. **Enable for MCP**:
   - Go to **Settings → Instance-level MCP**
   - Click **"Enable workflows"** button
   - Check the boxes next to workflows you want to expose
   - The workflows will now appear in the MCP interface

## Workflow Descriptions

Based on the workflows shown in your MCP interface, here are suggested descriptions:

### Test: OpenAI
**Description**: Test workflow for OpenAI integration. Processes OpenAI API requests and responses for testing automation capabilities.

### TEST: Google Calendar
**Description**: Test workflow for Google Calendar integration. Manages calendar events, scheduling, and calendar-based automation.

### TEST: Notion
**Description**: Test workflow for Notion integration. Syncs data with Notion databases and pages, enabling content management automation.

### TEST: Gmail
**Description**: Test workflow for Gmail integration. Handles email operations, notifications, and email-based automation workflows.

## Troubleshooting

**"Connection refused" error**:
- Ensure n8n is running: `n8n start`
- Check n8n is accessible at `http://localhost:5678`

**Workflows not appearing in MCP**:
- Workflows must be **published/active** to appear
- Only workflows with supported triggers can be exposed
- Refresh the MCP page after enabling

**API key issues**:
- Verify API key in `credentials/n8n-api-key.txt`
- Check API key is valid in n8n: Settings → API → API Keys
