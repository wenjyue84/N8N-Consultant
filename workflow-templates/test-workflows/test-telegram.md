# TEST: Telegram

Simple test workflow to verify Telegram bot integration is working.

## What It Tests

- ✅ Sending messages via Telegram bot

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Start a conversation with BotFather
3. Send `/newbot` command
4. Follow the instructions:
   - Choose a name for your bot
   - Choose a username (must end with "bot")
5. BotFather will give you a **token** - save it!

### 2. Get Your Chat ID

1. Start a chat with your new bot (search for it by username)
2. Send any message to the bot (e.g., "Hello")
3. Visit this URL in your browser (replace `YOUR_BOT_TOKEN`):
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
4. Look for `"chat":{"id":123456789}` in the response
5. Copy that number - that's your **Chat ID**

### 3. Import the Workflow

```powershell
node utilities/import-workflow.js workflow-templates/test-workflows/test-telegram.json
```

Or manually:
1. Open n8n at http://localhost:5678
2. Click **...** → **Import from File**
3. Select `test-telegram.json`

### 4. Configure in n8n

1. Click on **Send Test Message** node
2. Click **Credential to connect with** → **Create New**
3. Select **Telegram API**
4. Enter your **Bot Token** (from BotFather)
5. Update **Chat ID** field (replace `YOUR_CHAT_ID` with your chat ID)

### 5. Test the Workflow

1. Click **Execute Workflow** button
2. Check your Telegram - you should receive a test message!
3. Check the **Format Test Result** node output

## Expected Output

**Telegram Message**:
```
✅ n8n Telegram Test Successful!

This is a test message from your n8n workflow.
Time: 2026-01-16 12:34:56

If you received this, your Telegram integration is working correctly!
```

**Format Test Result**:
```json
{
  "success": true,
  "message": "✅ Telegram test successful! Message sent successfully.",
  "messageId": 123,
  "chatId": 123456789,
  "timestamp": 1234567890,
  "testDate": "2026-01-16T..."
}
```

## Notes

- You must start a conversation with the bot first
- The bot can only send messages to users who have messaged it
- Chat ID is your personal Telegram user ID
- You can send messages to groups too (use group chat ID)

## Troubleshooting

**Error: "Invalid token"**
- Verify the bot token is correct
- Make sure you copied the full token from BotFather

**Error: "Chat not found"**
- Make sure you've sent at least one message to the bot
- Verify the chat ID is correct
- Try getting updates again: `https://api.telegram.org/bot<TOKEN>/getUpdates`

**Message not received**
- Check that you started a conversation with the bot
- Verify chat ID is correct
- Make sure the bot is not blocked

## Using This as Reference

When building complex workflows:
- Copy the credential setup from **Send Test Message** node
- Use the chat ID format for sending to different chats
- Reference the message structure for formatting
- Use Markdown or HTML for rich text formatting
