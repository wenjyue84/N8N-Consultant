# 1.3 Daily Briefing - Tasks to Gmail

**Workflow 1.3 from Jay's N8N Master Plan**

Sends a daily summary of tasks at 8:00 AM via Gmail, grouped by @Context.

---

## Flow Overview

```
[Schedule 8AM] → [Query Notion Tasks] → [Group by @Context] → [Send Gmail]
```

## Nodes

| Node | Type | Purpose |
|------|------|---------|
| Daily 8AM Trigger | Schedule Trigger | Runs every day at 8:00 AM |
| Query Notion Tasks | Notion | Fetches tasks where "When" = "Today" OR "Past" |
| Group by Context | Code | Groups tasks by @Context, generates HTML email |
| Send Gmail | Gmail | Sends summary email |

---

## Setup Instructions

### 1. Import the Workflow

1. Open n8n at http://localhost:5678
2. Click **...** → **Import from File**
3. Select `daily-briefing-gmail.json`

### 2. Configure Notion Credential

1. Click **Query Notion Tasks** node
2. Create new Notion credential (or select existing)
3. Use your Notion Integration Token
4. Database ID is pre-configured: `8daa8801-62e4-4447-a1cb-a5fedceedcb9`

### 3. Configure Gmail Credential

1. Click **Send Gmail** node
2. Create new Gmail OAuth2 credential
3. Authorize your Gmail account
4. **Update the `sendTo` field** with your actual email address

### 4. Verify Property Names

The workflow expects these Notion properties:
- `When` (Select) - with values "Today", "Past", etc.
- `@Context` (Select) - your context tags
- `Name` or `Task` (Title) - the task name

If your properties are named differently, update the Code node.

### 5. Test & Activate

1. Click **Test workflow** to run manually
2. Check your email for the briefing
3. If working, toggle **Active** to enable the schedule

---

## Sample Output

**Subject:** 📋 Daily Briefing: 12 tasks for Friday, January 16, 2026

**Body:**

🌅 Good Morning, Jay!
**Date:** Friday, January 16, 2026
**Total Tasks:** 12

---

### @Cafe Ops (3)
⚠️ 1 overdue
- Review menu pricing 🔴
- Order coffee beans
- Staff schedule update

### @Computer (5)
- Update website
- Reply to client emails
- ...

---

## Customization

### Change Schedule Time
Edit the **Daily 8AM Trigger** node → `triggerAtHour` value (0-23)

### Add More Filters
Modify the `filterJson` in **Query Notion Tasks** to include additional conditions

### Change Email Format
Edit the JavaScript in **Group by Context** node to customize the HTML/plain text output

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No tasks returned | Check Notion credential and database ID |
| Email not received | Verify Gmail credential and recipient email |
| Wrong property names | Update the Code node to match your Notion schema |

