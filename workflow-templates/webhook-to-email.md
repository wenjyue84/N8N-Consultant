# Webhook to Email Workflow

## Description

This workflow receives data via a webhook and sends it as an email notification.

## Workflow Steps

1. **Webhook Trigger**: Receives POST requests at `/webhook`
2. **Prepare Email Data**: Formats the webhook data for email
3. **Send Email**: Sends the formatted data via email
4. **Respond to Webhook**: Returns a success response

## Configuration

### Required Credentials

- **SMTP Account**: Configure your email service (Gmail, Outlook, custom SMTP)

### Node Configuration

1. **Webhook Node**:
   - Path: `/webhook` (customize as needed)
   - Method: POST
   - Response Mode: Response Node

2. **Prepare Email Data Node**:
   - Subject: "New webhook received"
   - Body: JSON stringified webhook data
   - Customize these fields as needed

3. **Send Email Node**:
   - From: Your sender email
   - To: Recipient email
   - Subject: Uses data from previous node
   - Body: Uses data from previous node

4. **Respond to Webhook Node**:
   - Returns JSON response: `{"status": "success", "message": "Email sent"}`

## Usage

1. Import the JSON file into n8n
2. Configure SMTP credentials
3. Update email addresses (from/to)
4. Customize the webhook path if needed
5. Activate the workflow
6. Test by sending a POST request to the webhook URL

## Testing

Use curl to test:

```bash
curl -X POST https://your-n8n-instance.com/webhook/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Customization

- Modify email subject/body format
- Add data validation
- Add error handling
- Support multiple recipients
- Add email templates
