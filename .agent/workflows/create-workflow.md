---
description: Create a new n8n workflow via API or UI
---

# Create Workflow

## Option 1: Via n8n UI (Recommended)

1. Open http://localhost:5678
2. Click **+ Add Workflow** (or `Ctrl+N`)
3. Build your workflow visually
4. Save and activate

## Option 2: Via API (Programmatic)

### Using the Utility Script

```javascript
const { createWorkflow } = require('./utilities/n8n-api-client');

const workflow = {
    name: "My New Workflow",
    nodes: [
        {
            name: "Start",
            type: "n8n-nodes-base.manualTrigger",
            position: [250, 300]
        },
        // Add more nodes...
    ],
    connections: {}
};

createWorkflow(workflow);
```

### Using cURL

```powershell
$apiKey = Get-Content "credentials\n8n-api-key.txt"
$body = @{
    name = "My New Workflow"
    nodes = @()
    connections = @{}
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/api/v1/workflows" `
    -Method POST `
    -Headers @{ "X-N8N-API-KEY" = $apiKey } `
    -Body $body `
    -ContentType "application/json"
```

## Option 3: Import from Template

1. Find template in `workflow-templates/`
2. Read the `.md` file for configuration steps
3. Import via UI:
   - Click **...** → **Import from File**
   - Select the `.json` file
   - Configure credentials
   - Save and activate

## Option 4: Use Workflow Builder

```javascript
const WorkflowBuilder = require('./utilities/workflow-builder');

const builder = new WorkflowBuilder("My Workflow");
builder.addTrigger("schedule", { cron: "0 9 * * *" });
builder.addNode("httpRequest", { url: "https://api.example.com" });
builder.addNode("code", { code: "return items;" });

const json = builder.build();
// Import this JSON into n8n
```

## Export Workflow for Sharing

1. Open workflow in n8n
2. Click **...** → **Download**
3. Save JSON to `workflow-templates/`
4. Create companion `.md` with documentation

## Workflow Best Practices

- Always add a description
- Use meaningful node names
- Add error handling (Error Trigger node)
- Test before activating
- Store credentials in n8n, not in workflow JSON
