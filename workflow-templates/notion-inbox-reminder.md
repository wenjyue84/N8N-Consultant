# 2.1 Inbox Processing Reminder

**Workflow 2.1 from Jay's N8N Master Plan**

Automated reminder workflow for processing Notion Tasks Inbox

Runs every 6 hours and checks your Notion Tasks Inbox view for items older than 24 hours without a "When" date. If found, sends a Telegram message with the count and a reminder to process your inbox.

---

## Flow Overview

```
[Schedule Every 6 Hours] 
    → [Query Notion Inbox] 
        → [Filter Old Items (24h+ & no When date)] 
            → [Count Items] 
                → [IF Items Found] 
                    → [Send Telegram Message]
```

---

## Nodes

| Node | Type | Purpose |
|------|------|---------|
| **Every 6 Hours** | Schedule Trigger | Runs workflow every 6 hours |
| **Query Notion Inbox** | Notion | Fetches items from Tasks Inbox database, filters for empty "When" date |
| **Filter Old Items** | Code | Filters items older than 24 hours from creation time |
| **Count Items** | Code | Counts filtered items and prepares message |
| **Check If Items Found** | IF | Checks if count > 0 |
| **Send Telegram Message** | Telegram | Sends notification with count and reminder |

---

## Setup Instructions

### 1. Import the Workflow

1. Open n8n at http://localhost:5678
2. Click **...** → **Import from File**
3. Select `notion-inbox-reminder.json`

### 2. Configure Notion Credential

1. Click **Query Notion Inbox** node
2. Create new Notion credential (or select existing)
3. Use your Notion Integration Token
   - Get token from: https://www.notion.so/my-integrations
   - Create a new integration if needed
   - Grant it access to your Tasks database
4. **Update Database ID** if different:
   - Current: `8daa8801-62e4-4447-a1cb-a5fedceedcb9`
   - Find your database ID from the Notion database URL

### 3. Configure Telegram Credential

1. Create a Telegram Bot:
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot` and follow instructions
   - Save the bot token

2. Get your Chat ID:
   - Start a chat with your bot
   - Send any message to the bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your `chat.id` in the response

3. Configure in n8n:
   - Click **Send Telegram Message** node
   - Create new Telegram credential
   - Enter your bot token
   - **Update `chatId` field** with your Chat ID (replace `YOUR_CHAT_ID`)

### 4. Verify Property Names

The workflow expects:
- **"When"** property (Select type) - checked for empty/null values
- **Created time** - used to determine if item is older than 24 hours

If your properties are named differently:
- Update the **Filter Old Items** Code node to match your property names
- Common variations: `when`, `When Date`, `Due Date`, etc.

### 5. Test & Activate

1. Click **Test workflow** to run manually
2. Check your Telegram for the message (if items found)
3. If working correctly, toggle **Active** to enable the schedule

---

## How It Works

### Step 1: Schedule Trigger
- Runs every 6 hours (configurable in the node)
- Alternative: Use cron expression `0 */6 * * *` for every 6 hours at minute 0

### Step 2: Notion Query
- Queries your Tasks Inbox database
- Filters for items where "When" date is empty (using Notion API filter)
- Returns all matching items

### Step 3: Filter Old Items
- Code node that filters items by:
  - **Age**: Created time must be older than 24 hours
  - **When date**: Must be empty/null (double-check, as Notion filtering can be unreliable)
- Uses JavaScript date comparison

### Step 4: Count Items
- Counts filtered items
- Prepares message text with count
- Sets `hasItems` boolean flag

### Step 5: Conditional Check
- IF node checks if `hasItems === true`
- Only proceeds to Telegram if items found

### Step 6: Telegram Notification
- Sends message with:
  - Count of items found
  - Reminder to process inbox
- Example: "You have 3 items in your Notion Tasks Inbox older than 24 hours without a 'When' date. Please process your inbox."

---

## Customization

### Change Schedule Frequency

Edit **Every 6 Hours** node:
- Change `hoursInterval` to desired hours (e.g., `12` for every 12 hours)
- Or use cron expression: `0 */6 * * *` (every 6 hours)

### Customize Message

Edit **Count Items** Code node to change the message format:
```javascript
message: `📋 Inbox Alert: ${count} task${count === 1 ? '' : 's'} need processing!`
```

### Change Time Threshold

Edit **Filter Old Items** Code node:
```javascript
// Change 24 to desired hours
const twentyFourHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48 hours
```

### Use Different View

If you want to query a specific view instead of the entire database:
- Update **Query Notion Inbox** node
- Use view filter or query specific view ID

---

## Troubleshooting

### "No items found" but you know there are items

1. **Check Database ID**: Verify the database ID matches your Tasks Inbox
2. **Check Property Names**: Ensure "When" property exists and is named correctly
3. **Check Notion Filter**: The Notion date filter may not work reliably - the Code node provides fallback filtering
4. **Check Created Time**: Verify items have `created_time` property

### Telegram message not sending

1. **Check Bot Token**: Verify token is correct
2. **Check Chat ID**: Ensure Chat ID is correct (must be a number, not username)
3. **Check Bot Permissions**: Make sure you've started a chat with the bot
4. **Test Manually**: Use **Test workflow** to see error messages

### Workflow runs but finds wrong items

1. **Check Date Logic**: Verify 24-hour calculation is correct
2. **Check Timezone**: Ensure n8n timezone matches your expectations
3. **Check Property Format**: Verify "When" property is Select type (or update workflow to match your type)

---

## Related Workflows

- `daily-briefing-gmail.json` - Daily task summary via Gmail
- Similar pattern for other reminder workflows

---

## Notes

- **Notion Date Filtering**: Known issue in n8n where Notion date filters can be unreliable. This workflow uses Code node filtering as a fallback.
- **Timezone**: All date comparisons use the n8n server timezone. Adjust if needed.
- **Rate Limits**: Notion API has rate limits. This workflow runs every 6 hours to minimize API calls.

---

**Last Updated**: 2026-01-16
