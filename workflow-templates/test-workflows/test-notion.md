# TEST: Notion

Simple test workflow to verify Notion integration is working.

## What It Tests

- ✅ Reading database pages from Notion

## Setup Instructions

### 1. Import the Workflow

```powershell
node utilities/import-workflow.js workflow-templates/test-workflows/test-notion.json
```

Or manually:
1. Open n8n at http://localhost:5678
2. Click **...** → **Import from File**
3. Select `test-notion.json`

### 2. Get Notion Integration Token

1. Go to https://www.notion.so/my-integrations
2. Click **+ New integration**
3. Give it a name (e.g., "n8n Integration")
4. Select your workspace
5. Copy the **Internal Integration Token**

### 3. Share Database with Integration

1. Open your Notion database
2. Click **...** (three dots) → **Connections** → **Add connections**
3. Select your integration
4. The integration now has access to the database

### 4. Get Database ID

1. Open your Notion database in browser
2. Look at the URL: `https://www.notion.so/YOUR_DATABASE_ID?v=...`
3. Copy the **YOUR_DATABASE_ID** part (32 characters with hyphens)
   - Example: `8daa8801-62e4-4447-a1cb-a5fedceedcb9`

### 5. Configure in n8n

1. Click on **Get Database Pages** node
2. Click **Credential to connect with** → **Create New**
3. Select **Notion API**
4. Paste your **Internal Integration Token**
5. Update **Database ID** field with your database ID (replace `YOUR_DATABASE_ID`)

### 6. Test the Workflow

1. Click **Execute Workflow** button
2. Check the **Format Test Result** node output
3. Verify it shows your database pages

## Expected Output

```json
{
  "success": true,
  "message": "✅ Notion test successful! Retrieved X page(s) from database.",
  "pageCount": 5,
  "pages": [
    {
      "id": "...",
      "title": "Page Title",
      "url": "https://notion.so/...",
      "createdTime": "2026-01-16T...",
      "lastEditedTime": "2026-01-16T..."
    }
  ],
  "testDate": "2026-01-16T..."
}
```

## Notes

- If database is empty, you'll still get a success message (connection works)
- The workflow reads up to 5 pages
- Make sure your integration has access to the database
- Database ID is different from page ID

## Troubleshooting

**Error: "Invalid credentials"**
- Verify the integration token is correct
- Make sure you copied the full token

**Error: "Database not found"**
- Check the database ID is correct
- Verify the database is shared with your integration

**Empty results**
- This is normal if database is empty
- Check that integration has access to the database
- Verify database ID is correct

## Using This as Reference

When building complex workflows:
- Copy the credential setup from **Get Database Pages** node
- Use the database ID format for other Notion operations
- Reference the page structure from the output
- Use filters to query specific pages
