# Daily Email Summary to WhatsApp

## Overview
Automatically summarizes your unread Gmail emails every morning and sends a digest to your WhatsApp via Periskope.

## Triggers
| Trigger | Schedule | Purpose |
|---------|----------|---------|
| Schedule | 8:30 AM daily | Automated morning briefing |
| Manual | On-demand | Testing and ad-hoc summaries |

## Workflow Flow

```
┌─────────────────┐     ┌─────────────────┐
│ Schedule 8:30AM │────▶│                 │
└─────────────────┘     │  Get Unread     │
                        │  Emails (24h)   │
┌─────────────────┐     │                 │
│ Manual Trigger  │────▶│                 │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ Prepare Email   │
                        │ Data (Code)     │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  Has Emails?    │
                        │     (IF)        │
                        └───┬─────────┬───┘
                            │ YES     │ NO
                            ▼         ▼
                   ┌────────────┐  ┌────────────┐
                   │ Summarize  │  │ No Emails  │
                   │ with AI    │  │ Message    │
                   └─────┬──────┘  └─────┬──────┘
                         │               │
                         ▼               │
                   ┌────────────┐        │
                   │ Format AI  │        │
                   │ Response   │        │
                   └─────┬──────┘        │
                         │               │
                         └───────┬───────┘
                                 ▼
                        ┌─────────────────┐
                        │ Send WhatsApp   │
                        │ via Periskope   │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ Format Result   │
                        └─────────────────┘
```

## Nodes

### 1. Schedule Trigger - "Every Day 8:30 AM"
- **Cron**: `30 8 * * *` (8:30 AM every day)
- **Timezone**: Uses n8n instance timezone

### 2. Manual Trigger
- Click "Execute Workflow" for on-demand runs

### 3. Gmail - "Get Unread Emails (24h)"
- **Operation**: Get All Messages
- **Filters**: 
  - Unread emails only (`is:unread`)
  - Last 24 hours
  - INBOX label
- **Limit**: 50 emails max
- **Credential**: Gmail OAuth2

### 4. Code - "Prepare Email Data"
- Extracts sender, subject, snippet from each email
- Creates AI prompt for summarization
- Handles empty inbox case

### 5. IF - "Has Emails?"
- Routes to AI summarization if emails exist
- Routes to simple message if inbox empty

### 6. OpenAI - "Summarize with AI"
- **Model**: gpt-4o-mini (cost-effective)
- **Temperature**: 0.3 (focused responses)
- **Max Tokens**: 500
- **Prompt**: Categorizes emails into:
  - Important/Urgent
  - Action Required
  - FYI/Updates

### 7. Code - "Format AI Response"
- Extracts the message content from OpenAI response

### 8. Code - "No Emails Message"
- Returns "📭 No unread emails in the last 24 hours."

### 9. HTTP Request - "Send WhatsApp via Periskope"
- **URL**: `https://api.periskope.app/v1/message/send`
- **Method**: POST
- **Headers**: 
  - `x-phone`: Your WhatsApp number
  - Authorization via Header Auth credential
- **Body**: Chat ID + Message

### 10. Code - "Format Result"
- Logs success status and Periskope response

## Required Credentials

| Credential | ID | Name | Status |
|------------|-----|------|--------|
| Gmail OAuth2 | `kqQQwRQvzbnGtK2v` | Gmail account | ✅ Ready |
| OpenAI API | `OPENAI_CREDENTIAL_ID` | OpenAI account | ⚠️ Update ID |
| Periskope Header Auth | `uuWu8FGTTO9VX3Bn` | Header Auth account | ✅ Ready |

## Setup Instructions

### 1. Import Workflow
```bash
# Via n8n UI
1. Open n8n at http://localhost:5678
2. Click Import from File
3. Select email-summary-to-whatsapp.json
```

### 2. Update OpenAI Credential
1. Go to Settings → Credentials
2. Find your OpenAI credential
3. Copy the credential ID
4. Update the workflow's OpenAI node with correct ID

### 3. Verify Your Phone Number
The workflow uses `60127088789` as the WhatsApp recipient. Update if needed in:
- HTTP Request node → `x-phone` header
- HTTP Request node → `chat_id` in JSON body

### 4. Test Manually
1. Open workflow in n8n editor
2. Click "Execute Workflow"
3. Check each node's output
4. Verify WhatsApp message received

### 5. Activate
1. Toggle workflow to Active
2. Confirm schedule trigger is working

## Customization

### Change Schedule Time
Edit the Schedule Trigger node:
- `30 8 * * *` = 8:30 AM
- `0 7 * * 1-5` = 7:00 AM weekdays only
- `0 9 * * *` = 9:00 AM daily

### Change AI Model
In the OpenAI node:
- `gpt-4o-mini` - Fast & cheap (default)
- `gpt-4o` - More detailed summaries
- `gpt-3.5-turbo` - Even cheaper

### Adjust Email Lookback
In Gmail node filters, change `receivedAfter`:
- `{hours: 24}` - Last 24 hours
- `{hours: 12}` - Last 12 hours
- `{days: 2}` - Last 2 days

## Troubleshooting

### "No emails returned"
- Check Gmail credential is connected
- Verify there are unread emails in inbox
- Test Gmail connection separately

### "OpenAI error"
- Verify OpenAI API key is valid
- Check you have API credits
- Update credential ID in workflow

### "WhatsApp not sending"
- Verify Periskope API key is active
- Check phone number format (country code, no +)
- Test with the existing "Test Whatsapp via Periskope" workflow

## Sample Output

```
📬 **Email Summary** (8 unread)

1. **Important/Urgent**
   - Meeting invite from boss@company.com - Team sync at 10 AM

2. **Action Required**
   - Invoice #1234 from vendor - Payment due Jan 20
   - PR review request from dev@team.com

3. **FYI/Updates**
   - Weekly newsletter from product-updates
   - 3 promotional emails (Amazon, LinkedIn, etc.)
```
