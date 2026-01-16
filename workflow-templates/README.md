# N8N Workflow Templates

This directory contains reusable workflow templates for common automation scenarios, organized according to [Jay's N8N Master Plan](../docs/plans/jay-n8n-master-plan.md).

## Available Templates

### Phase 1: AI Assistant Core

- **1.3 Daily Briefing - Tasks to Gmail** (`daily-briefing-gmail.json`)
  - Sends daily task summary at 8:00 AM via Gmail, grouped by @Context
  - Status: ✅ Complete

### Phase 2: GTD Automation

- **2.1 Inbox Processing Reminder** (`notion-inbox-reminder.json`)
  - Runs every 6 hours, checks for inbox items older than 24h without "When" date
  - Sends Telegram reminder with count
  - Status: ✅ Complete

- **2.4 Context Switcher** (`notion-context-query-telegram.json`)
  - Manual trigger workflow for context-based task retrieval
  - Query tasks by @Context via webhook, receive via Telegram
  - Status: ✅ Complete

### Other Templates

- **Scheduled API Sync** (`scheduled-api-sync.json`)
  - Generic template for scheduled API synchronization
  - Status: ✅ Complete

- **Webhook to Email** (`webhook-to-email.json`)
  - Generic template for webhook-triggered email notifications
  - Status: ✅ Complete

## Workflow Numbering

Workflows are numbered according to the master plan:
- **Phase 1**: 1.1, 1.2, 1.3...
- **Phase 2**: 2.1, 2.2, 2.3, 2.4...
- **Phase 3**: 3.1, 3.2, 3.3, 3.4...
- **Phase 4**: 4.1...

## Using Templates

1. Import the JSON file into your n8n instance:
   ```powershell
   # Using the import utility (recommended)
   node utilities/import-workflow.js workflow-templates/<workflow-name>.json
   
   # Or manually via n8n UI
   # Open n8n → ... → Import from File
   ```

2. Configure the nodes with your credentials and parameters
3. Read the companion `.md` file for detailed setup instructions
4. Test the workflow before activating
5. Activate the workflow

## Import Utility

Use the automated import script for easier workflow deployment:

```powershell
# Import specific workflow
node utilities/import-workflow.js workflow-templates/2.1-inbox-reminder.json

# Or use the PowerShell wrapper
.\import-notion-inbox-reminder.ps1
```

The import utility:
- ✅ Tries API first (faster)
- ✅ Falls back to CLI if API fails
- ✅ Handles existing workflows (updates instead of duplicating)
