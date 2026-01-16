# 2.4 Context Switcher

**Workflow 2.4 from Jay's N8N Master Plan**

Query Notion Tasks by Context and Send to Telegram

This workflow allows you to query your Notion Tasks database for tasks matching a specific context (like "@Computer" or "@Cafe Ops"), filter out completed tasks, sort by priority and due date, and receive the results via Telegram.

---

## Flow Overview

```
[Webhook Trigger] → [Extract Context] → [Query Notion Tasks] → [Sort and Format] → [Send Telegram] → [Respond to Webhook]
```

## Nodes

| Node | Type | Purpose |
|------|------|---------|
| **Webhook Trigger** | Webhook | Receives POST requests with context parameter |
| **Extract Context** | Set | Extracts context from webhook body or query parameters |
| **Query Notion Tasks** | Notion | Queries database for tasks matching context, Status ≠ Done |
| **Sort and Format Tasks** | Code | Sorts by priority and due date, formats message |
| **Send Telegram Message** | Telegram | Sends formatted task list to Telegram |
| **Respond to Webhook** | Respond to Webhook | Returns success response |

---

## Setup Instructions

### 1. Import the Workflow

1. Open n8n at http://localhost:5678
2. Click **...** → **Import from File**
3. Select `notion-context-query-telegram.json`

### 2. Configure Notion Credential

1. Click **Query Notion Tasks** node
2. Create new Notion credential (or select existing)
3. Use your Notion Integration Token
4. Database ID is pre-configured: `8daa8801-62e4-4447-a1cb-a5fedceedcb9`

**Important**: Make sure your Notion integration has access to the Tasks database.

### 3. Configure Telegram Credential

1. Create a Telegram Bot:
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot` and follow instructions
   - Copy the bot token

2. Get your Chat ID:
   - Start a chat with your bot
   - Send any message to the bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your `chat.id` in the response

3. Configure in n8n:
   - Click **Send Telegram Message** node
   - Create new Telegram credential
   - Enter your bot token
   - **Update the `chatId` field** with your actual chat ID

### 4. Verify Property Names

The workflow expects these Notion properties:
- `@Context` (Select) - your context tags (e.g., "@Computer", "@Cafe Ops")
- `Status` (Select) - task status (must have "Done" as a value)
- `Priority` (Select) - task priority (optional, defaults to "Medium" if missing)
- `Due Date` or `Due` (Date) - task due date (optional)
- `Name` or `Task` (Title) - the task name

If your properties are named differently, update the **Sort and Format Tasks** Code node.

### 5. Test & Activate

1. Click **Test workflow** to run manually
2. When testing, you'll need to provide a context value
3. Check your Telegram for the message
4. If working, toggle **Active** to enable the webhook

---

## Usage

### Option 1: POST Request with JSON Body

```powershell
# Using PowerShell
$body = @{
    context = "@Computer"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook/notion-context-query" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

```bash
# Using curl
curl -X POST http://localhost:5678/webhook/notion-context-query \
  -H "Content-Type: application/json" \
  -d '{"context": "@Computer"}'
```

### Option 2: POST Request with Query Parameter

```powershell
# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:5678/webhook/notion-context-query?context=@Cafe%20Ops" `
    -Method POST
```

```bash
# Using curl
curl -X POST "http://localhost:5678/webhook/notion-context-query?context=@Cafe%20Ops"
```

### Option 3: Using n8n UI Test Button

1. Click the **Webhook Trigger** node
2. Click **Listen for Test Event**
3. In the test panel, send a POST request with:
   ```json
   {
     "context": "@Computer"
   }
   ```

---

## Sample Output

### Telegram Message Format

```
📋 Tasks for @Computer

Found 5 tasks:

1. 🔴 Review code changes
   Priority: High | Due: Jan 18

2. 🟡 Update documentation
   Priority: Medium | Due: Jan 20

3. 🟡 Fix bug in API
   Priority: Medium | Due: Jan 22

4. 🟢 Organize files
   Priority: Low | Due: No due date

5. 🟢 Backup database
   Priority: Low | Due: No due date
```

### Webhook Response

```json
{
  "status": "success",
  "context": "@Computer",
  "count": 5,
  "message": "Tasks sent to Telegram"
}
```

---

## How It Works

1. **Webhook receives context**: Accepts context via POST body (`{"context": "@Computer"}`) or query parameter (`?context=@Computer`)

2. **Extract context**: Pulls context from body or query parameters, with fallback options

3. **Query Notion**: 
   - Filters by `@Context` property matching the provided context
   - Filters out tasks where `Status = "Done"`
   - Returns all matching tasks

4. **Sort and format**:
   - Sorts by priority (High → Medium → Low)
   - Then sorts by due date (earliest first)
   - Tasks without due dates appear at the end
   - Formats a readable message with emojis

5. **Send to Telegram**: Sends formatted message to your Telegram chat

6. **Respond to webhook**: Returns JSON response confirming success

---

## Customization

### Change Priority Sorting

Edit the **Sort and Format Tasks** Code node. Modify the `priorityValue` assignment:

```javascript
if (priority === 'High' || priority === '🔴 High') {
  priorityValue = 1;
} else if (priority === 'Low' || priority === '🟢 Low') {
  priorityValue = 3;
} else {
  priorityValue = 2; // Medium
}
```

### Change Date Format

In the **Sort and Format Tasks** Code node, modify the date formatting:

```javascript
const dueDateStr = task.dueDate 
  ? new Date(task.dueDate).toLocaleDateString('en-MY', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'  // Add year if needed
    })
  : 'No due date';
```

### Add More Filters

Edit the **Query Notion Tasks** node's `filterJson` parameter to add additional filters:

```json
{
  "and": [
    { "property": "@Context", "select": { "equals": "{{ $json.context }}" } },
    { "property": "Status", "select": { "does_not_equal": "Done" } },
    { "property": "When", "select": { "equals": "Today" } }  // Add this
  ]
}
```

---

## Troubleshooting

### No tasks found

- Verify the context value matches exactly (case-sensitive)
- Check that tasks exist with that context in Notion
- Ensure tasks don't have Status = "Done"

### Telegram message not sending

- Verify bot token is correct
- Check chat ID is correct (must be your personal chat ID with the bot)
- Ensure bot is started (send `/start` to your bot first)

### Context not extracted

- Check webhook is receiving data: look at execution logs
- Try sending context in both body and query parameter
- Verify the context value doesn't have extra spaces

### Sorting not working

- Check that Priority property exists in Notion
- Verify Priority values match expected format (High/Medium/Low)
- Check Due Date property name matches ("Due Date" or "Due")

### Notion query fails

- Verify Notion integration has access to the database
- Check database ID is correct
- Ensure property names match exactly (case-sensitive)

---

## Related Workflows

- **Daily Briefing - Tasks to Gmail**: Scheduled daily task summary
- **Notion Inbox Processing Reminder**: Reminds you to process inbox items

---

## Notes

- Context values must match exactly (including "@" symbol and capitalization)
- Tasks without due dates are sorted to the end
- Priority defaults to "Medium" if not set
- The workflow filters out tasks with Status = "Done" automatically
