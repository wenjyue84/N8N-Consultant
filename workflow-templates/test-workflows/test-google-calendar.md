# TEST: Google Calendar

Simple test workflow to verify Google Calendar integration is working.

## What It Tests

- ✅ Reading upcoming calendar events
- ✅ Creating a test event

## Setup Instructions

### 1. Import the Workflow

```powershell
node utilities/import-workflow.js workflow-templates/test-workflows/test-google-calendar.json
```

Or manually:
1. Open n8n at http://localhost:5678
2. Click **...** → **Import from File**
3. Select `test-google-calendar.json`

### 2. Configure Google Calendar Credential

1. Click on **Get Upcoming Events** node
2. Click **Credential to connect with** → **Create New**
3. Select **Google Calendar OAuth2 API**
4. Follow the OAuth flow to authorize your Google account
5. Grant calendar access permissions

### 3. Test the Workflow

1. Click **Execute Workflow** button
2. Check the output:
   - **Format Test Result** node: Shows upcoming events
   - **Test Complete** node: Shows test event creation result
3. Check your Google Calendar for the test event (created 1 hour from now)

## Expected Output

**Format Test Result**:
```json
{
  "success": true,
  "message": "✅ Google Calendar test successful! Found X upcoming event(s).",
  "eventCount": 5,
  "events": [...],
  "testDate": "2026-01-16T..."
}
```

**Test Complete**:
- Shows the created test event details
- Event will appear in your calendar

## Notes

- The test event will be created 1 hour from execution time
- You can manually delete the test event after testing
- Uses `primary` calendar by default (can be changed in node settings)
- The workflow reads up to 5 upcoming events

## Troubleshooting

**Error: "Invalid credentials"**
- Re-authorize the OAuth2 credential
- Make sure you granted calendar access

**Error: "Calendar not found"**
- Verify the calendar ID (default is "primary")
- Check that the calendar exists and is accessible

**No events returned**
- This is normal if you have no upcoming events
- The test will still succeed if connection works

## Using This as Reference

When building complex workflows:
- Copy the credential setup from **Get Upcoming Events** node
- Use the event structure from the output
- Reference the create event parameters for creating events
