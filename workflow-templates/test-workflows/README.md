# N8N Node Test Workflows

This directory contains simple test workflows to verify that major n8n nodes are properly configured and working. Use these as references when building more complex workflows.

## Available Test Workflows

| Workflow | Node Tested | Purpose |
|----------|-------------|---------|
| `test-google-calendar.json` | Google Calendar | Tests reading events and creating a test event |
| `test-notion.json` | Notion | Tests reading database pages |
| `test-telegram.json` | Telegram | Tests sending messages |
| `test-google-sheets.json` | Google Sheets | Tests reading and writing data |
| `test-gmail.json` | Gmail | Tests sending emails |
| `test-http-request.json` | HTTP Request | Tests GET and POST API calls |
| `test-whatsapp.json` | WhatsApp | Tests sending template messages |
| `test-openai.json` | OpenAI | Tests GPT-4o connection |
| `test-anthropic.json` | Anthropic | Tests Claude 3.5 Sonnet connection |

## Quick Start

### 1. Import a Test Workflow

```powershell
# Using the import utility
node utilities/import-workflow.js workflow-templates/test-workflows/test-telegram.json

# Or manually via n8n UI
# Open n8n → ... → Import from File → Select the JSON file
```

### 2. Configure Credentials

Each workflow requires specific credentials. See individual workflow documentation below.

### 3. Update Required Parameters

Some workflows need you to update specific values:
- **Telegram**: Update `YOUR_CHAT_ID`
- **Gmail**: Update `YOUR_EMAIL@gmail.com`
- **Notion**: Update `YOUR_DATABASE_ID`
- **Google Sheets**: Update `YOUR_SPREADSHEET_ID`
- **WhatsApp**: Update `PHONE_NUMBER_ID` and `RECIPIENT_PHONE_NUMBER`

### 4. Test the Workflow

1. Click **Execute Workflow** button in n8n
2. Check the output of the final node
3. Verify the test was successful (look for ✅ success messages)

### 5. Use as Reference

Once a test workflow is working, you can:
- Copy node configurations to your complex workflows
- Use the credential setup as a reference
- Understand the data flow and structure

---

## Individual Workflow Details

### TEST: Google Calendar

**File**: `test-google-calendar.json`

**What it tests**:
- Reading upcoming calendar events
- Creating a test event

**Setup**:
1. Create Google Calendar OAuth2 credential in n8n
2. Authorize access to your Google Calendar
3. The workflow uses `primary` calendar by default

**Expected Output**:
- List of upcoming events (up to 5)
- A test event created 1 hour from now
- Success message with event details

**Notes**:
- The test event will appear in your calendar
- You can delete it manually after testing

---

### TEST: Notion

**File**: `test-notion.json`

**What it tests**:
- Reading database pages from Notion

**Setup**:
1. Create Notion API credential in n8n
   - Get integration token from: https://www.notion.so/my-integrations
   - Grant access to your database
2. Update `YOUR_DATABASE_ID` in the workflow:
   - Find it in your Notion database URL: `https://www.notion.so/YOUR_DATABASE_ID?v=...`
   - Copy the ID (32 characters, with hyphens)

**Expected Output**:
- List of pages from your database (up to 5)
- Success message with page count and details

**Notes**:
- If database is empty, you'll still get a success message (connection works)
- Make sure your Notion integration has access to the database

---

### TEST: Telegram

**File**: `test-telegram.json`

**What it tests**:
- Sending messages via Telegram bot

**Setup**:
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
   - Create Telegram API credential
   - Enter your bot token
   - Update `YOUR_CHAT_ID` in the workflow with your chat ID

**Expected Output**:
- A test message sent to your Telegram
- Success message with message ID

**Notes**:
- You must start a conversation with the bot first
- The bot can only send messages to users who have started a chat

---

### TEST: Google Sheets

**File**: `test-google-sheets.json`

**What it tests**:
- Reading data from a Google Sheet
- Writing data to a Google Sheet

**Setup**:
1. Create Google Sheets OAuth2 credential in n8n
2. Authorize access to your Google Sheets
3. Update `YOUR_SPREADSHEET_ID` in the workflow:
   - Find it in your Google Sheet URL: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`
4. Ensure the sheet has a sheet named "Sheet1" (or update the sheet name)

**Expected Output**:
- Data read from the sheet (first 5 rows from A1:C5)
- A test row appended to the sheet
- Success message with read/write confirmation

**Notes**:
- The test will append a row with timestamp, test type, and status
- Make sure the sheet has write permissions
- Update the range if your sheet structure is different

---

### TEST: Gmail

**File**: `test-gmail.json`

**What it tests**:
- Sending emails via Gmail

**Setup**:
1. Create Gmail OAuth2 credential in n8n
2. Authorize your Gmail account
3. Update `YOUR_EMAIL@gmail.com` in the "Send Test Email" node

**Expected Output**:
- A test email sent to your specified address
- Success message with email details

**Notes**:
- Check your inbox (and spam folder) for the test email
- The email will have HTML formatting

---

### TEST: HTTP Request

**File**: `test-http-request.json`

**What it tests**:
- Making GET requests
- Making POST requests

**Setup**:
- No credentials needed! This uses httpbin.org (a public testing service)

**Expected Output**:
- GET request response with query parameters
- POST request response with JSON body
- Success message with both request details

**Notes**:
- This is a great way to test HTTP Request node without any external setup
- httpbin.org is a reliable testing service
- You can modify the URLs to test your own APIs

---

### TEST: WhatsApp

**File**: `test-whatsapp.json`

**What it tests**:
- Sending template messages via Meta WhatsApp Cloud API

**Setup**:
1. Create WhatsApp API credential in n8n (Access Token)
2. Update `PHONE_NUMBER_ID` and `RECIPIENT_PHONE_NUMBER` in the workflow
3. Ensure you have a template named `hello_world` (default) or update to an existing one

**Expected Output**:
- A "Hello World" message delivered to your WhatsApp
- JSON response with message ID

**Notes**:
- Test numbers require verifying the recipient number first
- Production numbers need a permanent token

---

### TEST: OpenAI

**File**: `test-openai.json`

**What it tests**:
- Connecting to OpenAI's completion API

**Setup**:
1. Create OpenAI credential in n8n with your API Key
2. (Optional) Adjust model if you don't have access to GPT-4o

**Expected Output**:
- Text response from the AI

---

### TEST: Anthropic

**File**: `test-anthropic.json`

**What it tests**:
- Connecting to Anthropic's Messages API

**Setup**:
1. Create Anthropic credential in n8n with your API Key
2. (Optional) Adjust model if needed

**Expected Output**:
- Text response from Claude

---

## Running All Tests

You can create a master workflow that runs all tests, or test them individually:

```powershell
# Test all workflows
Get-ChildItem workflow-templates/test-workflows/*.json | ForEach-Object {
    Write-Host "Testing: $($_.Name)"
    node utilities/import-workflow.js $_.FullName
}
```

## Troubleshooting

### Common Issues

1. **Credential Errors**
   - Make sure credentials are properly configured
   - Re-authorize OAuth2 credentials if expired
   - Check API keys and tokens are correct

2. **Permission Errors**
   - Ensure integrations have proper permissions
   - Check that databases/sheets are shared with the integration

3. **ID Errors**
   - Verify IDs are correct (database ID, spreadsheet ID, chat ID)
   - IDs are usually 32 characters with hyphens

4. **Empty Results**
   - Some tests may return empty results but still succeed (connection works)
   - Check the success message in the output

### Getting Help

- Check n8n execution logs for detailed error messages
- Verify credentials in n8n Settings → Credentials
- Test individual nodes using "Test step" feature
- Refer to n8n documentation for specific node requirements

---

## Next Steps

Once all test workflows are working:

1. ✅ You have verified all major node integrations
2. ✅ You can use these as templates for complex workflows
3. ✅ You understand the data flow and structure
4. ✅ You're ready to build production workflows

Use the node configurations from these tests as building blocks for your more complex automation workflows!
