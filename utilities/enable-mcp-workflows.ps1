# Enable workflows for Instance-level MCP and add descriptions
# This script updates workflows with descriptions and prepares them for MCP exposure

$ErrorActionPreference = "Stop"

# Load API key
$credPath = Join-Path $PSScriptRoot "..\credentials\n8n-api-key.txt"
$apiKeyContent = Get-Content $credPath -Raw
$apiKeyMatch = $apiKeyContent -match "API_KEY=(.+)"
if (-not $apiKeyMatch) {
    Write-Host "❌ Could not find API key in credentials file" -ForegroundColor Red
    exit 1
}
$apiKey = ($apiKeyContent -split "API_KEY=")[1].Split("`n")[0].Trim()

$baseUrl = "http://localhost:5678"
$headers = @{
    "X-N8N-API-KEY" = $apiKey
    "Content-Type" = "application/json"
}

# Generate description based on workflow name
function Get-Description {
    param([string]$workflowName, [array]$nodes)
    
    $nameLower = $workflowName.ToLower()
    
    if ($nameLower -like "*openai*") {
        return "Test workflow for OpenAI integration. Processes OpenAI API requests and responses for testing automation capabilities."
    }
    elseif ($nameLower -like "*google cal*" -or $nameLower -like "*calendar*") {
        return "Test workflow for Google Calendar integration. Manages calendar events, scheduling, and calendar-based automation."
    }
    elseif ($nameLower -like "*notion*") {
        return "Test workflow for Notion integration. Syncs data with Notion databases and pages, enabling content management automation."
    }
    elseif ($nameLower -like "*gmail*") {
        return "Test workflow for Gmail integration. Handles email operations, notifications, and email-based automation workflows."
    }
    
    return "Test workflow for automation and integration testing. Enables workflow automation capabilities."
}

Write-Host "🔍 Fetching workflows...`n" -ForegroundColor Cyan

try {
    # List all workflows
    $workflowsResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/workflows" -Method GET -Headers $headers
    
    if (-not $workflowsResponse -or $workflowsResponse.Count -eq 0) {
        Write-Host "No workflows found." -ForegroundColor Yellow
        exit 0
    }
    
    Write-Host "Found $($workflowsResponse.Count) workflow(s)`n" -ForegroundColor Green
    
    # Filter for test workflows (based on the image)
    $testWorkflows = $workflowsResponse | Where-Object {
        $name = $_.name
        if (-not $name) { return $false }
        $nameLower = $name.ToLower()
        return ($nameLower -like "*test: openai*" -or 
                $nameLower -like "*test: google cal*" -or 
                $nameLower -like "*test: notion*" -or 
                $nameLower -like "*test: gmail*")
    }
    
    if ($testWorkflows.Count -eq 0) {
        Write-Host "No matching test workflows found. Processing all workflows...`n" -ForegroundColor Yellow
        $workflowsToProcess = $workflowsResponse
    } else {
        Write-Host "Processing $($testWorkflows.Count) test workflow(s)...`n" -ForegroundColor Green
        $workflowsToProcess = $testWorkflows
    }
    
    foreach ($workflow in $workflowsToProcess) {
        Write-Host "📝 Processing: $($workflow.name)" -ForegroundColor Cyan
        
        # Get full workflow details
        $fullWorkflow = Invoke-RestMethod -Uri "$baseUrl/api/v1/workflows/$($workflow.id)" -Method GET -Headers $headers
        
        # Generate description
        $description = Get-Description -workflowName $workflow.name -nodes $fullWorkflow.nodes
        
        Write-Host "   Description: $description" -ForegroundColor Gray
        
        # Update workflow with description
        $updateBody = @{
            name = $fullWorkflow.name
            nodes = $fullWorkflow.nodes
            connections = $fullWorkflow.connections
            active = $fullWorkflow.active
            settings = $fullWorkflow.settings
            staticData = $fullWorkflow.staticData
            tags = $fullWorkflow.tags
            description = $description
        } | ConvertTo-Json -Depth 10
        
        try {
            $updated = Invoke-RestMethod -Uri "$baseUrl/api/v1/workflows/$($workflow.id)" -Method PUT -Headers $headers -Body $updateBody
            Write-Host "   ✅ Updated successfully`n" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ Error updating: $($_.Exception.Message)`n" -ForegroundColor Red
        }
    }
    
    Write-Host "✨ All workflows updated!`n" -ForegroundColor Green
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Go to Settings → Instance-level MCP in n8n UI" -ForegroundColor White
    Write-Host "   2. Click 'Enable workflows' button" -ForegroundColor White
    Write-Host "   3. Select the workflows you want to expose via MCP" -ForegroundColor White
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
    exit 1
}
