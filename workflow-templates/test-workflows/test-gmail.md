# TEST: Gmail

Simple test workflow to verify Gmail integration is working.

## What It Tests

- ✅ Sending emails via Gmail

## Setup Instructions

### 1. Import the Workflow

```powershell
node utilities/import-workflow.js workflow-templates/test-workflows/test-gmail.json
```

Or manually:
1. Open n8n at http://localhost:5678
2. Click **...** → **Import from File**
3. Select `test-gmail.json`

### 2. Configure Gmail Credential

1. Click on **Send Test Email** node
2. Click **Credential to connect with** → **Create New**
3. Select **Gmail OAuth2 API**
4. Follow the OAuth flow to authorize your Gmail account
5. Grant Gmail send permissions

### 3. Update Email Address

1. Click on **Send Test Email** node
2. Update **Send To** field (replace `YOUR_EMAIL@gmail.com` with your email)

### 4. Test the Workflow

1. Click **Execute Workflow** button
2. Check your email inbox (and spam folder)
3. Check the **Format Test Result** node output

## Expected Output

**Email Subject**:
```
✅ n8n Gmail Test - 2026-01-16 12:34
```

**Email Body** (HTML):
```html
<h2>✅ n8n Gmail Integration Test</h2>
<p>This is a test email from your n8n workflow.</p>
<p><strong>Test Time:</strong> 2026-01-16 12:34:56</p>
<p>If you received this email, your Gmail integration is working correctly!</p>
```

**Format Test Result**:
```json
{
  "success": true,
  "message": "✅ Gmail test successful! Email sent successfully.",
  "messageId": "...",
  "threadId": "...",
  "to": "your-email@gmail.com",
  "subject": "✅ n8n Gmail Test - ...",
  "testDate": "2026-01-16T..."
}
```

## Notes

- The email will be sent from your authorized Gmail account
- Check spam folder if you don't see it
- The email includes both HTML and plain text versions
- Subject includes timestamp for easy identification

## Troubleshooting

**Error: "Invalid credentials"**
- Re-authorize the OAuth2 credential
- Make sure you granted Gmail send permissions

**Error: "Send permission denied"**
- Make sure OAuth2 has "Send email" scope
- Re-authorize with proper permissions

**Email not received**
- Check spam/junk folder
- Verify the email address is correct
- Check Gmail sent folder to confirm it was sent
- Wait a few minutes (delivery can be delayed)

**Error: "Rate limit exceeded"**
- Gmail has sending limits
- Wait a few minutes and try again
- Check your Gmail sending quota

## Using This as Reference

When building complex workflows:
- Copy the credential setup from **Send Test Email** node
- Use the email structure for formatting messages
- Reference the HTML/plain text format
- Use expressions for dynamic content
