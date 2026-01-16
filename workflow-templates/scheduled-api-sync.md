# Scheduled API Sync Workflow

## Description

This workflow runs on a schedule (every hour), fetches data from an API, validates it, and syncs it to a destination API.

## Workflow Steps

1. **Schedule Trigger**: Runs every hour
2. **Fetch Data**: Makes GET request to source API
3. **Check Status**: Validates the response status
4. **Sync to Destination**: POSTs data to destination API
5. **Log Result**: Writes sync result to a log file

## Configuration

### Required Credentials

- **HTTP Header Auth**: For source API authentication
- **Destination API**: May require authentication (configure in node)

### Node Configuration

1. **Schedule Trigger**:
   - Interval: Every hour
   - Customize schedule as needed (daily, weekly, etc.)

2. **Fetch Data**:
   - Method: GET
   - URL: Your source API endpoint
   - Authentication: HTTP Header Auth

3. **Check Status**:
   - Condition: Checks if `status === "success"`
   - Only proceeds if condition is true

4. **Sync to Destination**:
   - Method: POST
   - URL: Your destination API endpoint
   - Body: Sends the fetched data

5. **Log Result**:
   - File: `sync-log.txt`
   - Operation: Append
   - Logs the sync result

## Usage

1. Import the JSON file into n8n
2. Configure API credentials
3. Update API URLs (source and destination)
4. Customize the schedule if needed
5. Configure the status check condition
6. Activate the workflow

## Customization

- Change schedule frequency
- Add data transformation before sync
- Add error handling and retry logic
- Support multiple destinations
- Add notifications on failure
- Implement data deduplication

## Error Handling

Consider adding:
- Error handling nodes
- Retry logic for failed API calls
- Alert notifications on failures
- Dead letter queue for failed syncs
