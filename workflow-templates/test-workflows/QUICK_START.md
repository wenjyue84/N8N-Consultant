# Quick Start: Test All Nodes

Get all your major node integrations working in 5 minutes!

## Step 1: Import All Test Workflows

```powershell
node utilities/test-all-nodes.js
```

This will import all 6 test workflows into your n8n instance.

## Step 2: Configure Each Workflow

Open each workflow in n8n and configure:

### ✅ TEST: HTTP Request
- **No setup needed!** Just execute it.

### ✅ TEST: Telegram
1. Create bot with [@BotFather](https://t.me/botfather)
2. Get your chat ID from `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Configure credential and update chat ID

### ✅ TEST: Gmail
1. Create Gmail OAuth2 credential
2. Update email address in "Send Test Email" node

### ✅ TEST: Notion
1. Get integration token from https://www.notion.so/my-integrations
2. Share database with integration
3. Update database ID in workflow

### ✅ TEST: Google Sheets
1. Create Google Sheets OAuth2 credential
2. Update spreadsheet ID in both nodes

### ✅ TEST: Google Calendar
1. Create Google Calendar OAuth2 credential
2. Ready to test! (uses primary calendar)

## Step 3: Test Each Workflow

1. Click **Execute Workflow** on each test
2. Verify success messages (✅)
3. Check outputs (emails, messages, etc.)

## Step 4: Use as Reference

Once all tests pass, you can:
- Copy node configurations to your complex workflows
- Reference credential setups
- Understand data structures

## Troubleshooting

**Credential errors?**
- Re-authorize OAuth2 credentials
- Verify API keys and tokens

**ID errors?**
- Double-check IDs (database, spreadsheet, chat)
- IDs are usually 32 characters with hyphens

**Empty results?**
- Some tests may return empty but still succeed
- Check the success message in output

## Next Steps

- ✅ All nodes tested and working
- ✅ Ready to build complex workflows
- 📚 See individual `.md` files for detailed setup

---

**Need help?** Check the detailed README.md in this directory.
