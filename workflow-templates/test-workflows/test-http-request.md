# TEST: HTTP Request

Simple test workflow to verify HTTP Request node is working.

## What It Tests

- ✅ Making GET requests
- ✅ Making POST requests

## Setup Instructions

### 1. Import the Workflow

```powershell
node utilities/import-workflow.js workflow-templates/test-workflows/test-http-request.json
```

Or manually:
1. Open n8n at http://localhost:5678
2. Click **...** → **Import from File**
3. Select `test-http-request.json`

### 2. Test the Workflow

**No credentials needed!** This uses httpbin.org (a public testing service).

1. Click **Execute Workflow** button
2. Check the **Format Test Result** node output

## Expected Output

**Format Test Result**:
```json
{
  "success": true,
  "message": "✅ HTTP Request test successful! Both GET and POST requests worked.",
  "get": {
    "success": true,
    "status": 200,
    "url": "https://httpbin.org/get?test=n8n-integration-test&timestamp=...",
    "args": {
      "test": "n8n-integration-test",
      "timestamp": "..."
    }
  },
  "post": {
    "success": true,
    "status": 200,
    "url": "https://httpbin.org/post",
    "json": {
      "test": "n8n-post-test",
      "message": "This is a test POST request from n8n",
      "timestamp": "..."
    }
  },
  "testDate": "2026-01-16T..."
}
```

## What It Does

1. **HTTP GET Request**: 
   - Sends a GET request to httpbin.org/get
   - Includes query parameters: `test` and `timestamp`
   - httpbin.org echoes back the parameters

2. **HTTP POST Request**:
   - Sends a POST request to httpbin.org/post
   - Includes JSON body with test data
   - httpbin.org echoes back the JSON

## Notes

- httpbin.org is a reliable public testing service
- No authentication or credentials required
- Great for testing HTTP Request node functionality
- You can modify URLs to test your own APIs

## Customizing for Your APIs

To test your own APIs:

1. Update **HTTP GET Request** node:
   - Change `url` to your API endpoint
   - Add authentication if needed (headers, basic auth, etc.)
   - Modify query parameters

2. Update **HTTP POST Request** node:
   - Change `url` to your API endpoint
   - Update request body structure
   - Add required headers

## Troubleshooting

**Error: "Network error"**
- Check your internet connection
- Verify httpbin.org is accessible
- Check firewall settings

**Error: "Timeout"**
- Increase timeout in node options
- Check if the service is down

**Error: "Invalid URL"**
- Verify URL format is correct
- Check for typos in the URL

## Using This as Reference

When building complex workflows:
- Copy the GET request structure for reading data
- Copy the POST request structure for creating/updating data
- Reference authentication methods (headers, OAuth, etc.)
- Use expressions for dynamic URLs and parameters
