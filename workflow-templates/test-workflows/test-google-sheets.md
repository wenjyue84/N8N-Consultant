# TEST: Google Sheets

Simple test workflow to verify Google Sheets integration is working.

## What It Tests

- ✅ Reading data from a Google Sheet
- ✅ Writing data to a Google Sheet

## Setup Instructions

### 1. Prepare a Google Sheet

1. Create a new Google Sheet or use an existing one
2. Make sure it has at least one sheet (default "Sheet1")
3. Optionally add some test data in columns A, B, C

### 2. Get Spreadsheet ID

1. Open your Google Sheet in browser
2. Look at the URL: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`
3. Copy the **YOUR_SPREADSHEET_ID** part

### 3. Import the Workflow

```powershell
node utilities/import-workflow.js workflow-templates/test-workflows/test-google-sheets.json
```

Or manually:
1. Open n8n at http://localhost:5678
2. Click **...** → **Import from File**
3. Select `test-google-sheets.json`

### 4. Configure Google Sheets Credential

1. Click on **Read Sheet Data** node
2. Click **Credential to connect with** → **Create New**
3. Select **Google Sheets OAuth2 API**
4. Follow the OAuth flow to authorize your Google account
5. Grant Google Sheets access permissions

### 5. Update Spreadsheet ID

1. Click on **Read Sheet Data** node
2. Update **Document ID** field (replace `YOUR_SPREADSHEET_ID`)
3. Update **Sheet Name** if different from "Sheet1"
4. Repeat for **Write Test Row** node

### 6. Test the Workflow

1. Click **Execute Workflow** button
2. Check the output:
   - **Format Read Result**: Shows data read from sheet
   - **Format Final Result**: Shows both read and write results
3. Check your Google Sheet - a new row should be appended!

## Expected Output

**Format Read Result**:
```json
{
  "success": true,
  "message": "✅ Google Sheets READ test successful! Retrieved X row(s).",
  "rowCount": 5,
  "rows": [...],
  "testDate": "2026-01-16T..."
}
```

**Format Final Result**:
```json
{
  "success": true,
  "message": "✅ Google Sheets test successful! Both READ and WRITE operations worked.",
  "read": {
    "rowCount": 5,
    "success": true
  },
  "write": {
    "success": true,
    "updatedCells": "3",
    "updatedRange": "Sheet1!A10:C10"
  }
}
```

**New Row in Sheet**:
- Column A: Timestamp (e.g., "2026-01-16 12:34:56")
- Column B: "n8n Integration Test"
- Column C: "✅ Success"

## Notes

- The test will read from range A1:C5 (first 5 rows)
- A new row will be appended with test data
- Make sure the sheet has write permissions
- Update the range if your sheet structure is different

## Troubleshooting

**Error: "Invalid credentials"**
- Re-authorize the OAuth2 credential
- Make sure you granted Google Sheets access

**Error: "Spreadsheet not found"**
- Verify the spreadsheet ID is correct
- Check that the sheet is accessible
- Make sure the sheet is shared (if using a service account)

**Error: "Sheet not found"**
- Verify the sheet name is correct (default is "Sheet1")
- Check that the sheet exists in the spreadsheet

**Write permission denied**
- Make sure the sheet is editable
- Check sharing settings
- Verify OAuth2 has write permissions

## Using This as Reference

When building complex workflows:
- Copy the credential setup from **Read Sheet Data** node
- Use the spreadsheet ID format for other operations
- Reference the read/write operations for data manipulation
- Use ranges to read/write specific cells
